import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent as NotificationComponent } from '../notifications/notifications.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ChangueIconDirective } from './changue-icon.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

const deps = [NzListModule, NzEmptyModule, NzCardModule];

@NgModule({
  declarations: [NotificationComponent, ChangueIconDirective],
  imports: [CommonModule, ...deps, ScrollingModule],
  exports: [NotificationComponent],
})
export class NotificationsModule {}
