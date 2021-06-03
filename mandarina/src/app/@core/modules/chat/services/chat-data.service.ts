import { MESSAGE_VIEW, CHAT_USER } from './../fragments';
import { JwtService } from '@services/jwt.service';
import {
  IUserChat,
  IRecentMessages,
  IConversation,
  IMessage,
  statusChatResponse
} from './../model';
import { tap, pluck, takeUntil, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { gql, Apollo, QueryRef } from 'apollo-angular';
import _ from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IUser } from '@core/models/User';

const ACTIVE_USERS = gql`
  ${CHAT_USER}
  query activeUsers($idUser: Int!) {
    getActiveUser(idUser: $idUser) {
      ...userChatFragment
    }
  }
`;

const RECENT_MESSAGES = gql`
  query getRecentMessages($idUser: Int!) {
    recentMessages(idUser: $idUser) {
      id_user
      avatar
      name
      id_conversation
      count_messages
      last_message
      time_message
      unread_messages
    }
  }
`;

const VIEW_PRINCIPAL = gql`
  ${CHAT_USER}
  query viewChatPrincipal($idUser: Int!) {
    recentMessages(idUser: $idUser) {
      id_user
      avatar
      name
      id_conversation
      count_messages
      last_message
      time_message
      unread_messages
    }
    getActiveUser(idUser: $idUser) {
      ...userChatFragment
    }
  }
`;

const ON_NEW_RECENT_MESSAGE = gql`
  subscription onNewRecentMessage($idUser: Int!) {
    onNewRecentMessage(idUser: $idUser)
  }
`;

const GET_CONVERSATION = gql`
  ${MESSAGE_VIEW}
  ${CHAT_USER}
  query conversation($id: ID!) {
    conversation(id: $id) {
      id
      messages {
        ...messageView
      }
      members {
        ...userChatFragment
      }
    }
  }
`;
const CREATE_CONVERSATION = gql`
  ${MESSAGE_VIEW}
  ${CHAT_USER}
  mutation createConversation($idResponse: Int!, $idRemitent: Int!) {
    createConversation(idRemitent: $idResponse, idResponse: $idRemitent) {
      id
      created
      messages {
        ...messageView
      }
      members {
        ...userChatFragment
      }
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation sendMessage($message: InputMessage!) {
    createMessage(message: $message) {
      id
      message
      created
      id_creator
      id_conversation
      read
    }
  }
`;

// suscriptions

const ON_NEW_MESSAGE = gql`
  subscription onNewMessage($idUser: Int!, $idConversation: Int!) {
    onNewMessage(idConversation: $idConversation, idUser: $idUser) {
      id
      created
      id_creator
      message
      id_conversation
    }
  }
`;

const ON_NEW_USER = gql`
  ${CHAT_USER}
  subscription onConnectionUser($idUser: ID!) {
    connectionUser(idUser: $idUser) {
      id
      event
      user {
        ...userChatFragment
      }
    }
  }
`;

const READ_MESSAGES = gql`
  mutation readMessages($idUser: Int!, $idConversation: Int!) {
    readMessages(idUser: $idUser, idConversation: $idConversation)
  }
`;
import { orderUserXActive } from './helpers';
import { ConversationService } from './conversation.service';

@Injectable()
export class ChatDataService {
  private activeUsersSubject$ = new BehaviorSubject<IUserChat[]>([]);
  private recentMessagesSubject$ = new BehaviorSubject<IRecentMessages[]>([]);
  private messageConversationSubject$ = new BehaviorSubject<IMessage[]>([]);

  // emit name Header

  public nameUser = new BehaviorSubject<string>('');

  private _user: IUser;
  // expose
  public activeUsers$ = this.activeUsersSubject$
    .asObservable()
    .pipe(map(orderUserXActive));
  public recentMessages$ = this.recentMessagesSubject$.asObservable();
  public messages$ = this.messageConversationSubject$.asObservable();

  // subject for destroy suscriptions

  private destroyOnNewMessage$ = new Subject<void>();
  private destroyGeneral$ = new Subject<void>();

  // temporaly

  // refs queries

  private queryRefRecentMessage: QueryRef<any>;
  private queryRefConversation: QueryRef<any>;

  membersInconversation: IUserChat[] = [];

  constructor(
    private apollo: Apollo,
    private jwtService: JwtService,
    private conversationService: ConversationService
  ) {}

  public init() {
    this.getViewPrincipal(this.user.id);
    this.initSubscriptions();
    this.initRefsQueries();
    this.queryListens();
  }

  initRefsQueries() {
    this.queryRefRecentMessage = this.apollo.watchQuery({
      query: RECENT_MESSAGES,
      variables: { idUser: this.user.id }
    });
  }

  /**
   *
   * @param id
   * @returns
   * Trae la lista de mensajes de una conversacioon
   */

  private initSubscriptions() {
    // suscribe new users
    this.apollo
      .subscribe<{ connectionUser: statusChatResponse }>({
        query: ON_NEW_USER,
        variables: { idUser: this.user.id }
      })
      .pipe(pluck('data', 'connectionUser'), takeUntil(this.destroyGeneral$))
      .subscribe((sub: statusChatResponse) => {
        this.actueSubInAvatars(sub);
      });

    this.apollo
      .subscribe({
        query: ON_NEW_RECENT_MESSAGE,
        variables: { idUser: this.user.id }
      })
      .pipe(takeUntil(this.destroyGeneral$))
      .subscribe((_) => {
        this.queryRefRecentMessage.refetch();
      });
  }
  private queryListens() {
    this.queryRefRecentMessage.valueChanges
      .pipe(pluck('data', 'recentMessages'), takeUntil(this.destroyGeneral$))
      .subscribe((data) => {
        this.recentMessagesSubject$.next(data);
      });
  }
  /**
   *
   * @param idConversation
   * @returns Promise(Boolean)
   *
   */
  public readMessages(idConversation: number) {
    return this.apollo
      .mutate({
        mutation: READ_MESSAGES,
        variables: {
          idUser: this.user.id,
          idConversation: idConversation
        }
      })
      .toPromise();
  }

  public detroyEvent() {
    this.destroyGeneral$.next();
    this.destroyGeneral$.complete();
    this.destroyOnNewMessage$.next();
  }
  /**
   *
   * @param eventSuscribeUser
   * Actua frente a la suscripcion
   * de un nuevo usuario
   * si existe : lo actualiza
   * els :  lo agrega
   *   */
  private actueSubInAvatars(eventSuscribeUser: statusChatResponse) {
    let usersActives = [...this.activeUsersSubject$.value];
    const usTemp = usersActives.findIndex(
      (el) => el.id == eventSuscribeUser.id
    );

    if (usTemp !== -1) {
      usersActives.splice(usTemp, 1, eventSuscribeUser.user);
      this.activeUsersSubject$.next(usersActives);
    } else {
      usersActives = [...usersActives, eventSuscribeUser.user];
      this.activeUsersSubject$.next(usersActives);
    }
  }

  public createConversation(idResponse: number): Observable<IConversation> {
    const user = this.user;

    return this.apollo
      .mutate({
        mutation: CREATE_CONVERSATION,
        variables: {
          idRemitent: Number(user.id),
          idResponse: idResponse
        }
      })
      .pipe(
        tap((data) => {
          this.membersInconversation = _.get(
            data,
            'data.createConversation.members'
          );
          const useResponse = this.membersInconversation.find(
            (el) => el.id == idResponse
          );
          this.nameUser.next(useResponse.name);

          const messages = _.get(data, 'data.createConversation.messages');
          this.messageConversationSubject$.next(
            this.transformMessage(messages)
          );
        }),
        pluck('data', 'createConversation')
      );
  }

  public getConversation(id: number): Promise<IConversation> {
    this.readMessages(id).then((data) => {});
    return this.apollo
      .query({
        query: GET_CONVERSATION,
        variables: { id: id },
        fetchPolicy: 'network-only'
      })
      .pipe(
        tap((data) => {
          const messages = _.get(data, 'data.conversation.messages');
          this.messageConversationSubject$.next(
            this.transformMessage(messages)
          );

          this.membersInconversation = _.get(data, 'data.conversation.members');
          this.getName(this.membersInconversation);
        }),
        pluck('data', 'conversation')
      )
      .toPromise() as Promise<IConversation>;
  }
  private getName(users: IUserChat[]) {
    this.nameUser.next(users.find((el) => el.id != this.user.id).name);
  }
  private transformMessage(messages: IMessage[]) {
    return messages
      .map((msg) => ({
        ...msg,
        reverse: msg.id_creator == this.user.id
      }))
      .reverse();
  }
  get user() {
    if (this._user) {
      return this._user;
    } else {
      this._user = this.jwtService.getUserOfToken();
      return this._user;
    }
  }
  public getViewPrincipal(idUser: number) {
    this.apollo
      .query({ query: VIEW_PRINCIPAL, variables: { idUser: idUser } })
      .pipe(
        pluck('data'),
        map((source) => {
          const activeUsers = _.get(source, 'getActiveUser') as IUserChat[];
          const recentMessages = _.get(
            source,
            'recentMessages'
          ) as IRecentMessages[];

          this.activeUsersSubject$.next(activeUsers);
          this.recentMessagesSubject$.next(recentMessages);
          return;
        })
      )
      .subscribe();
  }

  // acomoda el mensaje buscando los datos disponibles
  addMessageInLocal(msg: IMessage) {
    let msgs = this.messageConversationSubject$.value;
    if (_.isUndefined(msg.avatar)) {
      const member = this.membersInconversation.find(
        (el) => el.id == msg.id_creator
      );
      if (member) {
        msg.name = member.name;
        msg.avatar = member.image;
      }
    }
    msg.reverse = msg.id_creator == this.user.id;
    this.conversationService.newMessage(msg);
    // msgs = [...msgs, msg];
    // this.messageConversationSubject$.next(msgs);
    // refetch recent messages
    this.queryRefRecentMessage.refetch();
  }
  // remplaza el mensaje por el que estaba
  replaceMessageInLocal(msg: IMessage) {
    let currentMessages = this.messageConversationSubject$.value;
    const index = currentMessages.findIndex((val) => val.id == msg.id);
    currentMessages = [...currentMessages.splice(index, 1, msg)];
    this.messageConversationSubject$.next(currentMessages);
  }

  public destroyOnNewMessage() {
    this.destroyOnNewMessage$.next();
    return;
  }

  public suscribeOnNewMessage(variables: {
    idConversation: number;
    idUser?: number;
  }) {
    variables.idUser = this.user.id;
    this.apollo
      .subscribe({
        query: ON_NEW_MESSAGE,
        variables: variables
      })
      .pipe(
        takeUntil(this.destroyOnNewMessage$),
        pluck('data', 'onNewMessage'),
        tap((data: IMessage) => {
          this.addMessageInLocal(data);
        })
      )
      .subscribe();
  }

  // read messages

  /*=============================================
  =            messages            =
  =============================================*/
  public createMessage(msg: IMessage) {
    msg.id_creator = this.user.id;
    msg = _.omit(msg, 'reverse');
    return this.apollo
      .mutate({
        mutation: CREATE_MESSAGE,
        variables: { message: msg }
      })
      .pipe(
        pluck('data', 'createMessage'),
        tap((el: IMessage) => this.addMessageInLocal(el))
      );
  }
}
