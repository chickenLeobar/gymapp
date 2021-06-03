import { isValidValue } from './../../../../helpers/helpers';
import { BehaviorSubject } from 'rxjs';
import { IComment, EnumboxCommentState } from './../model';
import { CommentService } from './../services/comment.service';
import { UiEventsService } from './../services/ui-events.service';
import { BoxCommentsService } from './../services/box-comments.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ChangeDetectorRef
} from '@angular/core';
import { Comment } from '../models/comment.class';
import { CommentComponent } from './comment.component';

import { typeEventBoxComments } from '../services/box-comments.service';
import _ from 'lodash';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@Component({
  selector: 'box-comments',
  template: `
    <!--Box comments -->
    <ul class="comments__box" [ngClass]="{ replies: isReply }">
      <nz-space nzDirection="vertical">
        <nz-space-item>
          <app-write-comment
            *ngIf="isReply && showBoxWrite"
            (hideEvent)="showBoxWrite = false"
            (onComment)="sendReplyComment($event)"
            inReply
          ></app-write-comment>
        </nz-space-item>
        <nz-space-item>
          <ng-template #commentsBox></ng-template>
          <nz-empty
            *ngIf="isEmpty$ | async"
            nzNotFoundContent="Se el primero en comentar"
          >
          </nz-empty>
        </nz-space-item>
      </nz-space>
      <btn-more-comments
        (moreCommentsEvent)="onMoreComments($event)"
        [moreComments]="moreComments"
      ></btn-more-comments>
    </ul>

    <!-- <app-write-comment *ngIf="isReply === true"></app-write-comment> -->
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class BoxCommentsComponent implements OnInit {
  _comments: Comment[];
  showBoxWrite: boolean = false;
  isReply: boolean = false;
  _parentComment: Comment;

  isEmpty$ = new BehaviorSubject<boolean>(false);

  private isEmpty() {
    this.isEmpty$.next(this.comments.length == 0);
  }

  moreComments: number = 0;
  /*=============================================
  =            inputs            =
  =============================================*/

  @Input() set parentComment(v: Comment) {
    this._parentComment = v;
    this.isReply = true;
  }

  get parentComment() {
    return this._parentComment;
  }

  @Input() set comments(v: Comment[]) {
    if (!isValidValue(v)) {
      v = [];
    }

    let commentsShow = Object.assign([] as Comment[], v);
    if ((this.stateComponent = EnumboxCommentState.COLLECTED)) {
      // obtain number of the config
      commentsShow = commentsShow.slice(-3);
    }
    this.moreComments = v.length - commentsShow.length;
    this.fillAllComments(commentsShow);
    this._comments = v;
    this.isEmpty();
  }
  private _stateComponent: EnumboxCommentState;

  @Input() set stateComponent(v: EnumboxCommentState) {
    this._stateComponent = v;
  }

  get stateComponent() {
    return this._stateComponent || EnumboxCommentState.COLLECTED;
  }

  @ViewChild('commentsBox', { read: ViewContainerRef, static: true })
  vcComments: ViewContainerRef;
  get comments() {
    return this._comments;
  }
  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private boxCommentsService: BoxCommentsService,
    private uiEventsService: UiEventsService,
    private changueDetection: ChangeDetectorRef,
    private commentService: CommentService
  ) {}
  ngOnInit(): void {
    this.suscribeBoxEvents();
    this.listenSubjects();
    if (this.isReply) {
      this.suscribeActionComments();
    }
  }

  // suscribers
  private suscribeActionComments() {
    this.commentService
      .subscribeActionComments({
        idComment: this.parentComment.id
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  /*=============================================
  =            DOM EVENT            =
  =============================================*/
  public onMoreComments(countComments: number) {
    if (countComments == -1) {
      this.fillAllComments(_.clone(this.comments).slice(-3));
    } else {
      _.clone(this.comments)
        .slice(0, countComments)
        .forEach((el) => this.addItemComment(el, null));
    }
  }

  private listenSubjects() {
    if (this.isReply) {
      this.uiEventsService
        .onEventRespondComment('openReply')
        .subscribe((payload) => {
          if (
            payload.parentComment.id == this.parentComment.id &&
            payload.showBox
          ) {
            this.showBoxWrite = true;
            this.changueDetection.markForCheck();
          }
        });
    }
  }

  public sendReplyComment(content: string) {
    const resolvePromises = async () => {
      const user = this.parentComment.userLocal;
      await this.commentService
        .addComment(
          {
            id_user: user.id,
            id_comment: this.parentComment.id,
            comment: content
          } as IComment,
          true
        )
        .toPromise();
    };
    resolvePromises();
    this.showBoxWrite = false;
  }

  public suscribeBoxEvents() {
    let event: typeEventBoxComments;
    if (this.isReply) {
      event = 'ADD:REPLY';
    } else {
      event = 'ADD';
    }
    this.boxCommentsService.onEvent(event).subscribe((com) => {
      if (event == 'ADD:REPLY') {
        if (this.parentComment.id == com.comment.id_comment) {
          this.addItemComment(com.comment);
        }
      } else {
        this.addItemComment(com.comment);
      }
    });
  }

  // list comments
  private fillAllComments(comments: Comment[], clear: boolean = true) {
    if (clear) {
      this.vcComments.clear();
    }
    comments.forEach((el) => this.addItemComment(el));
  }

  // add item comments
  private addItemComment(comment: Comment, index: number = 0) {
    const factoryComponentComment = this.factoryResolver.resolveComponentFactory(
      CommentComponent
    );

    const commentComponent = this.vcComments.createComponent(
      factoryComponentComment,
      index
    );

    commentComponent.instance.comment = comment;
    commentComponent.changeDetectorRef.markForCheck();
    if (this.comments) {
      this.comments.push(comment);
      this.isEmpty();
    }
  }
}
