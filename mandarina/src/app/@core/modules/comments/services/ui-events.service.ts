import { CRUD_ACTION, payloadComment } from './../model';
import { filter, tap } from 'rxjs/operators';
import { Comment } from '../models/comment.class';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
type payloadEvent = {
  event: string;
  parentComment: Comment;
  showBox: boolean;
};

@Injectable()
export class UiEventsService {
  private respondCommentEvents$ = new BehaviorSubject<payloadEvent>(null);

  private onlyCommentsEvent$ = new Subject<payloadComment>();

  constructor() {}

  public onEventComment(action: CRUD_ACTION): Observable<payloadComment> {
    return this.onlyCommentsEvent$
      .asObservable()
      .pipe(filter((el) => el.action == action));
  }

  public emitEventInComment(payload: payloadComment) {
    this.onlyCommentsEvent$.next(payload);
  }

  public respondComment(parentComment: Comment, showBox: boolean = true) {
    this.respondCommentEvents$.next({
      event: 'openReply',
      parentComment,
      showBox: showBox
    });
  }

  public onEventRespondComment(event: string): Observable<payloadEvent> {
    return this.respondCommentEvents$
      .asObservable()
      .pipe(filter((el) => el.event == event));
  }
}
