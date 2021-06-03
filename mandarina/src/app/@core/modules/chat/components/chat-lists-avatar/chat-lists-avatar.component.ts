import { IUserChat } from './../../model';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  Input
} from '@angular/core';

import { SwiperComponent } from 'swiper/angular';
@Component({
  selector: 'app-chat-lists-avatar',
  template: ` <div class="list_avatars">
    <swiper #swiper [config]="config">
      <ng-content></ng-content>
    </swiper>
  </div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListsAvatarComponent implements OnInit {
  @ViewChild('swiper', { static: false }) directiveRef?: SwiperComponent;

  @Input() users: IUserChat[];
  config: SwiperConfigInterface = {
    slidesPerView: 3,
    direction: 'horizontal'
    // navigation: true
  };
  constructor() {}

  ngOnInit(): void {}
}
