import { IlistMessageItem, IRecentMessages } from './../../model';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-chat-list-message-item',
  template: `
    <div class="list_chats_item">
      <!-- avatar -->
      <app-chat-avatar
        [active]="item.active_user"
        [count]="item.unread_messages"
        [avatar]="item.avatar"
      ></app-chat-avatar>
      <div class="list_chats_item_text">
        <h3 class="subtitle">{{ item.name }}</h3>
        <p class="paragraph">
          {{ item.last_message }}
        </p>
      </div>
      <div class="list_chats_item_actions">
        <span> {{ item.time_message | date: 'mm:ss' }}</span>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListMessageItemComponent implements OnInit {
  constructor() {}

  @Input() item: IRecentMessages;

  ngOnInit(): void {}
}
