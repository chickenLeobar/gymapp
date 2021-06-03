import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.class';
import { Subject } from 'rxjs';

export type typeEventBoxComments = 'ADD' | 'ADD:REPLY' | '';

@Injectable()
export class BoxCommentsService {
  private commentEventsSubject$ = new Subject<{
    event: typeEventBoxComments;
    comment: Comment;
  }>();

  constructor() {}

  onEvent(event: typeEventBoxComments) {
    return this.commentEventsSubject$
      .asObservable()
      .pipe(filter((el) => el.event == event));
  }

  emitEvent(event: typeEventBoxComments, comment: Comment) {
    this.commentEventsSubject$.next({ event, comment });
  }
}
