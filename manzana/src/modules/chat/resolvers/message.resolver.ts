import { Conversation } from "./../entities/Conversation";
import { MessageService } from "./../services/message.service";
import { onNewMessagePayload } from "./../model";
import { TopicsSubscription } from "./../../../globals/constants";
import { EntityManager } from "typeorm";
import { InputMessage } from "./../inputs/message.input";
import {
  Arg,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
} from "type-graphql";
import { Service } from "typedi";
import { MessageView } from "../views/message.view";
import { InjectManager } from "typeorm-typedi-extensions";
import { Message } from "../entities/message";
import { Not, Equal } from "typeorm";
@Resolver()
@Service()
export class MessageResolver {
  // add message
  constructor(
    @InjectManager() private manager: EntityManager,

    private msgService: MessageService
  ) {}

  @Mutation((type) => MessageView)
  async createMessage(
    @Arg("message", (type) => InputMessage) inputMessage: InputMessage,
    @PubSub(TopicsSubscription.NEW_MESSAGE)
    emitNewMessage: Publisher<onNewMessagePayload>
  ) {
    const msg = await this.manager.create(Message, inputMessage).save();
    //
    this.msgService.emitMemberForNewMessage(
      msg.id_creator,
      msg.id_conversation
    );
    let mgsView = new MessageView();
    mgsView.id = msg.id;
    mgsView.created = msg.created;
    mgsView.read = msg.read;
    mgsView.message = msg.message;
    mgsView.id_creator = msg.id_creator;
    mgsView.id_conversation = msg.id_conversation;
    await emitNewMessage({ message: mgsView });
    return mgsView;
  }

  @Mutation((type) => Boolean)
  async readMessages(
    @Arg("idConversation", (type) => Int) idConversation: number,
    @Arg("idUser", (type) => Int) idUser: number,
    @PubSub(TopicsSubscription.NEW_MESSAGE_ADDED)
    messgeAdded: Publisher<{ id: number }>
  ) {
    const resp = await Message.update(
      {
        id_conversation: idConversation,
        id_creator: Not(Equal(idUser)),
      },
      { read: true }
    );
    await messgeAdded({ id: idUser });
    return true;
  }

  @Subscription((type) => MessageView, {
    topics: TopicsSubscription.NEW_MESSAGE,
    filter: MessageService.filterConversation,
  })
  async onNewMessage(
    @Root() payload: onNewMessagePayload,
    @Arg("idConversation", (type) => Int) idConversation: number,
    @Arg("idUser", (type) => Int) idUser: number
  ) {
    // read message
    this.manager.update<Message>(Message, payload.message.id, { read: true });

    return payload.message;
  }

  @Subscription((type) => String, {
    topics: [TopicsSubscription.NEW_MESSAGE_ADDED],
    filter: ({
      args,
      payload,
    }: ResolverFilterData<{ id: number }, { idUser: number }>) =>
      args.idUser == payload.id,
  })
  async onNewRecentMessage(@Arg("idUser", (type) => Int) idUser: number) {
    return "REFRESH";
  }
}
