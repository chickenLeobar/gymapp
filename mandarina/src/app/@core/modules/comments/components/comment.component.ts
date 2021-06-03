import { UiEventsService } from './../services/ui-events.service';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { InteractionService } from './../services/interaction.service';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  HostBinding
} from '@angular/core';
import { Comment } from '../models/comment.class';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@Component({
  selector: 'le-comment',
  template: `
    <li class="comment" [ngClass]="{ reply: comment.isReply }">
      <div class="comment__avatar">
        <nz-avatar
          nzSize="large"
          [nzSrc]="comment.displayAvatar"
          [nzText]="comment.getInitials"
        ></nz-avatar>
      </div>
      <div class="comment__body">
        <a class="username">{{ comment.displayName }}</a>
        <p class="content">
          {{ comment.comment }}
        </p>
        <div class="action_comment">
          <a *ngIf="!comment.isReply" (click)="addReply()"> Responder </a>
          <span> {{ comment.displayTime }} </span>
        </div>
      </div>
      <div class="comment__action">
        <a class="like" (click)="likeComment(comment)">
          <b> {{ comment.likes }} </b>
          <i
            nz-icon
            nzType="heart"
            [nzTheme]="comment.isYourLike ? 'fill' : 'outline'"
          ></i>
        </a>
      </div>
      <ng-container *ngIf="visbleReplies">
        <box-comments
          [comments]="comment.replies"
          [parentComment]="comment"
        ></box-comments>
      </ng-container>
    </li>

    <show-replies-btn
      *ngIf="comment.hasReplies"
      [comment]="comment"
      (showRepliesEvent)="showReplies($event)"
    ></show-replies-btn>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class CommentComponent implements OnInit {
  @Input() comment: Comment;

  @Input() @InputBoolean() isReply: boolean;

  visbleReplies = false;

  constructor(
    private interactionService: InteractionService,
    private changuesDetection: ChangeDetectorRef,
    private uiEventService: UiEventsService
  ) {}
  @HostBinding('class.hide') hide: boolean = false;

  hideComment() {
    this.hide = true;
  }
  ngOnInit(): void {
    this.listenChagues();
  }

  public showReplies(comment: Comment) {
    this.uiEventService.respondComment(this.comment, false);
    this.visbleReplies = true;
  }
  // abre la caja de text
  public addReply() {
    this.uiEventService.respondComment(this.comment);
    this.visbleReplies = true;
  }

  private listenChagues() {
    /// suscribe on delete comemnt
    this.uiEventService
      .onEventComment('DELETE')
      .pipe(untilDestroyed(this))
      .subscribe((el) => {
        if (el.comment.id == this.comment.id) {
          this.hide = true;
        }
      });

    this.uiEventService
      .onEventComment('UPDATE')
      .pipe(untilDestroyed(this))
      .subscribe((el) => {
        console.log('update after');
        if (el.comment.id == this.comment.id) {
          this.comment = el.comment;
          console.log('update');
          this.changuesDetection.markForCheck();
        }
      });
  }
  public likeComment(comment: Comment) {
    if (!comment.isYourLike) {
      this.interactionService
        .addInteraction({
          idUser: comment.userLocal.id,
          idComment: comment.id
        })
        .then((el) => {
          comment.interaction = el;
          this.changuesDetection.markForCheck();
        });
    } else {
      this.interactionService
        .removeInteraction({
          idComment: comment.id,
          idUser: comment.userLocal.id
        })
        .then((el) => {
          comment.interaction = el;
          this.changuesDetection.markForCheck();
        });
    }
  }
}
