import { typID } from '@core/models/types';
import { IlistMessageItem, IRecentMessages } from './../../model';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chat-list-messages',
  template: ` <cdk-virtual-scroll-viewport
    #virtualScroll
    itemSize="3"
    class="list_chats"
  >
    <app-chat-list-message-item
      [item]="item"
      *cdkVirtualFor="let item of items"
      (click)="eventClick(item.id_conversation)"
    >
    </app-chat-list-message-item>
  </cdk-virtual-scroll-viewport>`,
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
export class ChatListMessagesComponent implements OnInit, OnChanges {
  @Input() items: IRecentMessages[];
  @Output() clickEvent = new EventEmitter<{ id: typID }>();

  @ViewChild('virtualScroll', { static: true })
  refScroll: CdkVirtualScrollViewport;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}
  eventClick(id: any) {
    this.clickEvent.next({ id: id });
  }
}
