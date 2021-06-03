import { UiEventsService } from './../services/ui-events.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  forwardRef,
  ChangeDetectorRef,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { Comment } from '../models/comment.class';
const placeHolders = {
  default: 'Deja tu comentario',
  reply: 'Respondiendo a {nameUser}'
};
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import format from 'string-template';
@Component({
  selector: 'app-write-comment',
  template: `
    <mat-form-field [ngStyle]="styleBox">
      <mat-label> {{ placeHolderBox }} </mat-label>
      <textarea
        (focus)="onFocusBox()"
        [(ngModel)]="inputValue"
        name="inputValue"
        matInput
        (input)="eventWriteComment($event)"
        (Keyup.enter)="handleSubmit()"
        cols="30"
        rows="3"
      >
      </textarea>
      <emoji-mart
        *ngIf="visiblePickerIcon"
        [style]="{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 5
        }"
        (emojiClick)="emogiClick($event)"
      ></emoji-mart>

      <mat-hint align="end">
        {{ inputValue?.length }} / {{ MAX_LENGHT }}
      </mat-hint>
      <mat-hint>
        <nz-space>
          <nz-space-item>
            <nz-form-item>
              <button
                nz-button
                *ngIf="inReply"
                nzDanger
                nzType="primary"
                (click)="hideBox()"
              >
                cancelar
              </button>
            </nz-form-item>
          </nz-space-item>
          <nz-space-item>
            <nz-form-item>
              <button
                nz-button
                nzType="primary"
                (click)="handleSubmit()"
                [hidden]="inputValue.length == 0"
              >
                comentar
              </button>
            </nz-form-item>
          </nz-space-item>
        </nz-space>
      </mat-hint>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 25px 0;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BoxwriteCommentComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class BoxwriteCommentComponent implements OnInit, ControlValueAccessor {
  inputValue: string = '';
  private onChangue: (data: string) => void;
  private onTouch: () => void;
  visiblePickerIcon = false;
  public MAX_LENGHT = 150;

  public placeHolderBox = '';

  public parentComment: Comment;

  private _styleBox: CSSStyleDeclaration;

  @Input() @InputBoolean() inReply: boolean;
  // @Input() set visible(v: boolean) {
  //   console.log('here visible');

  //   // this.hide = !v;
  // }
  @Output() onComment = new EventEmitter<string>();
  @Output() hideEvent = new EventEmitter<void>();

  constructor(
    private detection: ChangeDetectorRef,
    private uiEventsService: UiEventsService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.listenSubjects();
  }

  /*=============================================
  =            Events            =
  =============================================*/
  // @HostBinding('class.hide') hide: boolean = false;

  onFocusBox() {
    if (this.inReply) {
    }
  }
  hideBox() {
    // this.hide = true;
    this.hideEvent.emit();
  }

  private listenSubjects() {
    if (this.inReply) {
      this.uiEventsService
        .onEventRespondComment('openReply')
        .pipe(untilDestroyed(this))
        .subscribe((payload) => {
          this.parentComment = payload.parentComment;
          this.placeHolderBox = format(placeHolders.reply, {
            nameUser: payload.parentComment.user.name
          });
        });
    }
  }

  public writeValue(defaultValue: string): void {
    if (defaultValue?.length) {
      this.inputValue = defaultValue;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangue = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  /*=============================================
  =            DOM EVENTS            =
  =============================================*/
  public handleSubmit(): void {
    if (this.inputValue.length > 1) {
      this.onComment.emit(this.inputValue);
      this.inputValue = '';
    }
  }
  public eventWriteComment($event: InputEvent) {
    if (this.inputValue.length >= this.MAX_LENGHT || $event.data === null) {
      ($event.target as HTMLTextAreaElement).value = this.inputValue.substr(
        0,
        this.inputValue.length - 1
      );
    }
  }

  /*=============================================
 =            helpers            =
 =============================================*/
  get styleBox() {
    this._styleBox = {} as CSSStyleDeclaration;
    if (this.inReply) {
      this._styleBox.width = '600px';
      this._styleBox.marginLeft = '25px';
      this._styleBox.marginTop = '-10px';
    } else {
      this._styleBox.width = '100%';
    }

    return this._styleBox;
  }

  /*=============================================
=            Events Emit            =
=============================================*/
  emogiClick({ emoji }) {
    this.inputValue += emoji.native;
    this.visiblePickerIcon = false;
  }
}
