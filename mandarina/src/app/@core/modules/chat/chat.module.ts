import { ConversationService } from './services/conversation.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FloatComponent } from './layouts/float/float.component';
import { ChatComponent } from './chat/chat.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ChatuiService } from './services/chatui.service';
import { OverlayHoverModule } from '@core/ui/overlay-hover/overlay-hover.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ChatCardComponent } from './components/chat-card/chat-card.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  SwiperModule,
  SWIPER_CONFIG,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { ChatSearchComponent } from './components/chat-search/chat-search.component';
import { ChatListsAvatarComponent } from './components/chat-lists-avatar/chat-lists-avatar.component';
import { ChatAvatarComponent } from './components/chat-avatar/chat-avatar.component';
import { ChatListMessagesComponent } from './components/chat-list-messages/chat-list-messages.component';
import { ChatListMessageItemComponent } from './components/chat-list-message-item/chat-list-message-item.component';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatConversationComponent } from './components/chat-conversation/chat-conversation.component';
import { MessageComponent } from './components/chat-conversation/message.component';
import { ChatCardFormComponent } from './components/chat-conversation/chat-card-form.component';
import { BtnreverseDirective } from './directives/btnreverse.directive';
import { DelimiterDirective } from './directives/delimiter.directive';

// services
import { ListMessageService } from './services/list-message.service';
import { ChatDataService } from './services/chat-data.service';

// pipes
import { PipeShortParagraphModule } from '@core/pipes/short-paragraph.pipe';
const material = [
  PortalModule,
  OverlayModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  ScrollingModule
];
const zorro = [
  NzButtonModule,
  NzOutletModule,
  NzIconModule,
  NzCardModule,
  NzImageModule,
  NzAvatarModule,
  NzInputModule
];
import { ResolveUrlPipeModule } from '@core/pipes/resolve-url.pipe';
const me = [OverlayHoverModule, ResolveUrlPipeModule, PipeShortParagraphModule];
const SWIPER_CONFIG_DEFAULT: SwiperConfigInterface = {
  slidesPerView: 3,
  direction: 'horizontal'
};
@NgModule({
  declarations: [
    FloatComponent,
    ChatComponent,
    ChatCardComponent,
    ChatHeaderComponent,
    ChatSearchComponent,
    ChatListsAvatarComponent,
    ChatAvatarComponent,
    ChatListMessagesComponent,
    ChatListMessageItemComponent,
    ChatConversationComponent,
    MessageComponent,
    ChatCardFormComponent,
    BtnreverseDirective,
    DelimiterDirective
  ],
  imports: [
    CommonModule,
    SwiperModule,
    ReactiveFormsModule,
    FormsModule,
    ...material,
    ...zorro,
    ...me
  ],
  exports: [ChatComponent],
  providers: [
    ChatuiService,
    ListMessageService,
    ChatDataService,
    ConversationService,
    { provide: SWIPER_CONFIG, useValue: SWIPER_CONFIG_DEFAULT }
  ]
})
export class ChatModule {}
