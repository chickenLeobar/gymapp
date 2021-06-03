import { Comment } from '../../models/comment.class';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  ViewEncapsulation,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostBinding
} from '@angular/core';
import _ from 'lodash';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import pluralize from 'pluralize';
@Component({
  selector: 'show-replies-btn',
  template: `
    <a *ngIf="showBtn" class="btn_show_replies" (click)="showReplies()">
      {{ textShowReplies }}
    </a>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .hide {
        display: none;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowRepliesBtnComponent implements OnInit {
  private _comment: Comment;
  @Input() set comment(v: Comment) {
    this._comment = v;
  }
  get comment() {
    return this._comment;
  }

  @Input() @InputBoolean() show: boolean;
  @Output() showRepliesEvent = new EventEmitter<Comment>();
  constructor(
    private vc: ViewContainerRef,
    private changueRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  private _showBtn: boolean;
  get showBtn(): boolean {
    this._showBtn = !_.isNull(this.textShowReplies);
    return this._showBtn;
  }

  set showBtn(v: boolean) {
    this._showBtn = v;
  }

  @HostBinding('class.hide') hide: boolean = false;
  showReplies() {
    this.showRepliesEvent.next(this.comment);
    this.hide = true;
    this.changueRef.markForCheck();
  }
  get textShowReplies() {
    if (this.comment.replies.length == 0) {
      return null;
    } else {
      return `Mostrar ${pluralize(
        'respuesta',
        this.comment.replies.length,
        true
      )}`;
    }
    ///}
  }
}
