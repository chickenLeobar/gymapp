import { ChatuiService } from './../services/chatui.service';
import { typeRender } from './../model';
import { Component, OnInit, Input } from '@angular/core';
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { FloatComponent } from '../layouts/float/float.component';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  portal: Portal<any>;
  /**
   * @Input : type(typeRender)
   */
  @Input() type: typeRender;
  constructor(private chatUiService: ChatuiService) {}
  ngOnInit(): void {
    switch (this.type) {
      case 'FLOAT': {
        this.chatUiService.buildFloatComponent();
        break;
      }
    }
  }
}
