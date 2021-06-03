import { ChatuiService } from './../../services/chatui.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  template: `
    <h3 class="title line_addon">
      <ng-content></ng-content>
      <button (click)="closeChat()" chatBtnreverse style="float : right">
        <i nz-icon nzType="close-circle"></i>
      </button>
    </h3>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 0;
        padding: 0;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChatHeaderComponent implements OnInit {
  constructor(private chatService: ChatuiService) {}

  ngOnInit(): void {}
  closeChat() {
    this.chatService.closeChat();
  }
}
