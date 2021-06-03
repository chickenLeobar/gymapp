import { isValidValue } from '@helpers/helpers';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { InputBoolean, InputNumber } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'app-chat-avatar',
  template: `
    <div class="chat_card_avatar" [ngClass]="{ active: active }">
      <div class="chat_card_avatar_badge" *ngIf="count">
        <span class="chat_card_avatar_badge_text"> +{{ count }} </span>
      </div>
      <nz-avatar
        class="img"
        [ngClass]="{ not_image: !hasAvatar }"
        nzIcon="user"
        [nzSrc]="avatar | resolveUrl"
      ></nz-avatar>
      <span class="chat_card_avatar_user" *ngIf="name">
        <ng-container *nzStringTemplateOutlet="name">
          {{ name | shortParagraph: 5:true }}
        </ng-container>
      </span>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAvatarComponent implements OnInit, OnChanges {
  hasAvatar: boolean = false;
  // chague configuration
  @Input() avatar: string;

  @Input('name') name: string;

  @Input('count') @InputNumber(0) count: number;

  @Input('active') @InputBoolean() active: boolean;

  @Input('id') id: any;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.hasAvatar = isValidValue(this.avatar?.length);
  }
  ngOnInit(): void {}
}
