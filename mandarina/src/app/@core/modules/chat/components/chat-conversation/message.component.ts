import { IConversationItem, IMessage } from './../../model';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core/util';
@Component({
  selector: 'app-chat-message',
  template: `
    <li
      class="chat-card_list_conversation_item"
      [ngClass]="{ reverse: item.reverse }"
    >
      <app-chat-avatar
        *ngIf="!item.reverse"
        class="avatar"
        [avatar]="item?.avatar"
      ></app-chat-avatar>
      <div class="context">
        <h3 *ngIf="!item.reverse" class="subtitle">{{ item.name }}</h3>
        <p>
          {{ item.message }}
        </p>
        <span> {{ item.created | date: 'hh:mm' }} </span>
      </div>
    </li>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
  @Input() item: IMessage;
  constructor() {}

  ngOnInit(): void {}
}
