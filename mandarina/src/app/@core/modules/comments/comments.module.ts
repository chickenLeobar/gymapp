import { UiEventsService } from './services/ui-events.service';
import { InteractionService } from './services/interaction.service';
import { BoxCommentsService } from './services/box-comments.service';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments/comments.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzCardModule } from 'ng-zorro-antd/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CommentService } from './services/comment.service';
import { CommentComponent } from './components/comment.component';
import { BoxwriteCommentComponent } from './components/boxwrite-comment.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { BoxCommentsComponent } from './components/box-comments.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ShowRepliesBtnComponent } from './components/show-replies-btn/show-replies-btn.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ShowMoreCommentsComponent } from './components/show-more-comments/show-more-comments.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { TitleModule } from '@core/ui/title/title.module';
const zorro = [
  NzIconModule,
  NzDividerModule,
  NzInputModule,
  NzFormModule,
  NzCommentModule,
  NzLayoutModule,
  NzListModule,
  NzButtonModule,
  NzAvatarModule,
  NzCardModule,
  NzSpaceModule,
  NzEmptyModule
];
const material = [MatInputModule, MatButtonModule, ScrollingModule];

const nativeModules = [FormsModule, HttpClientModule, PickerModule];

@NgModule({
  declarations: [
    CommentsComponent,
    CommentComponent,
    BoxwriteCommentComponent,
    BoxCommentsComponent,
    ShowRepliesBtnComponent,
    ShowMoreCommentsComponent
  ],
  imports: [CommonModule, ...zorro, ...nativeModules, ...material, TitleModule],
  exports: [CommentsComponent],
  providers: [
    CommentService,
    BoxCommentsService,
    InteractionService,
    UiEventsService
  ]
})
export class CommentsModule {}
