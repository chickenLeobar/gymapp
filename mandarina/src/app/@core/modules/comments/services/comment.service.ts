import { UiEventsService } from './ui-events.service';
import { isValidValue } from './../../../../helpers/helpers';
import { BoxCommentsService } from './box-comments.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { IComment, CRUD_ACTION } from './../model';
import { tap, map, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gql, Apollo, QueryRef } from 'apollo-angular';
import { Comment } from '../models/comment.class';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
const FRAGMENTCOMMENT = gql`
  fragment fragmentComment on Comment {
    id
    user {
      id
      image
      lastName
      getCompleteName
      name
    }

    comment
    id_bootstrap
    createComment
    updateComment
    interaction {
      id
      id_user
      id_comment
      typeInteraction
    }
    id_comment
  }
`;

export const SUB_NEWCOMMENTS = gql`
  ${FRAGMENTCOMMENT}
  subscription actionComment($bootstrap: Int, $idComment: ID) {
    actionComment(bootstrap: $bootstrap, idComment: $idComment) {
      action
      comment {
        ...fragmentComment
        replies {
          ...fragmentComment
        }
      }
    }
  }
`;

const GET_COMMENTS = gql`
  ${FRAGMENTCOMMENT}
  query getComments($bootstrap: Int) {
    getComments(bootstrap: $bootstrap) {
      ...fragmentComment
      replies {
        ...fragmentComment
      }
    }
  }
`;
const ADD_COMMENT = gql`
  ${FRAGMENTCOMMENT}
  mutation addComment($inputComment: InputComment!) {
    addComment(comment: $inputComment) {
      ...fragmentComment
    }
  }
`;

type PayloadActionInComment = { action: CRUD_ACTION; comment: Comment };

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import _ from 'lodash';
@Injectable()
@UntilDestroy()
export class CommentService {
  //  local variables

  private idBootstrap: number;

  //  subjects

  private commentSubject = new Subject<Comment[]>();

  // expose public  subjects

  public comments$ = this.commentSubject.asObservable();

  // ref apollo queries

  private _refComments: QueryRef<NzSafeAny>;

  constructor(
    private uiEventsService: UiEventsService,
    private apollo: Apollo,
    private boxCommentsService: BoxCommentsService
  ) {}

  public lengthComments() {
    return this.commentSubject
      .asObservable()
      .pipe(map((el) => (isValidValue(el?.length) ? el.length : 0)));
  }

  public addComment(comment: IComment, isReply: boolean = false) {
    return this.apollo
      .mutate<{ addComment: Comment }>({
        mutation: ADD_COMMENT,
        variables: {
          inputComment: { ...comment }
        }
      })
      .pipe(
        pluck('data', 'addComment'),
        tap((el) => {
          if (!isReply) {
            this.boxCommentsService.emitEvent('ADD', Comment.instance(el));
          } else {
            this.boxCommentsService.emitEvent(
              'ADD:REPLY',
              Comment.instance(el)
            );
          }
        })
      );
  }

  public init(id_bootstrap: number) {
    this.idBootstrap = id_bootstrap;
    // initialize ref with new id bootstrap
    this.refComments;
    this.commentsChangues();
    this.subscribeActionComments({ bootstrap: id_bootstrap })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  // subs
  public subscribeActionComments(variables: {
    bootstrap?: number;
    idComment?: string;
  }) {
    const actionCreate = (data: PayloadActionInComment) => {
      if (!isInReply) {
        this.boxCommentsService.emitEvent('ADD', data.comment);
      } else {
        this.boxCommentsService.emitEvent('ADD:REPLY', data.comment);
      }
    };

    const actionUpdate = (data: PayloadActionInComment) => {
      this.uiEventsService.emitEventInComment({
        action: data.action,
        comment: data.comment
      });
    };

    // suscribe action comments
    const isInReply = isValidValue(variables.idComment);
    // FIXME: esta suscripcion causa muchos oyentes en el backed -> se debe generalizar
    return this.apollo
      .subscribe({
        query: SUB_NEWCOMMENTS,
        variables: variables,
        fetchPolicy: 'no-cache'
      })
      .pipe(pluck('data', 'actionComment'))
      .pipe(
        tap((data: PayloadActionInComment) => {
          data.comment = Comment.instance(data.comment);
          // ignore comment is it is ,me
          actionUpdate(data);
          if (!data.comment.isMe) {
            switch (data.action) {
              case 'CREATE': {
                actionCreate(data);
                break;
              }
              case 'UPDATE': {
              }
            }
          }
        })
      );
  }

  /**
   *  suscribe to the changues in the
   * comment itself
   */

  // local suscribes
  private commentsChangues() {
    this.refComments.valueChanges
      .pipe(
        pluck('data', 'getComments'),
        map((els: IComment[]) => {
          return els.map((el) => Comment.instance(el));
        }),
        untilDestroyed(this)
      )
      .subscribe((comments: Comment[]) => {
        console.log('renew comments');
        this.commentSubject.next(comments);
      });
  }

  // resolver refs
  get refComments() {
    if (!this._refComments) {
      if (!this.idBootstrap) {
        throw new Error('Not bootstrap id provider for this comment');
      }
      this._refComments = this.apollo.watchQuery<
        NzSafeAny,
        { bootstrap: number }
      >({ query: GET_COMMENTS, variables: { bootstrap: this.idBootstrap } });
      return this._refComments;
    } else {
      return this._refComments;
    }
  }

  public getComments(variables: { bootstrap: number }): Observable<Comment[]> {
    return this.apollo
      .query({ query: GET_COMMENTS, variables: variables })
      .pipe(
        pluck('data', 'getComments'),
        map((els: IComment[]) => {
          return els.map((el) => Comment.instance(el));
        })
      ) as Observable<Comment[]>;
  }
}
