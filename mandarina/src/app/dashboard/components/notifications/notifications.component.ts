import { tap, map } from 'rxjs/operators';
import { Inotification } from './model.notification';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';
import { NzConfigService } from 'ng-zorro-antd/core/config';

@Component({
  selector: 'app-notifications',
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="" class="viewport_container">
      <nz-card class="notifications_container">
        <li class="item" *cdkVirtualFor="let item of notifications | async">
          <div class="icon" [appChangueIcon]="item.type"></div>
          <div class="detail">
            <a class="title"> {{ item.title }} </a>
            <p>{{ item.description }}</p>
            <span class="time"> {{ item.time | date }}</span>
          </div>
        </li>
        <nz-empty
          [nzNotFoundImage]="notIamge"
          [nzNotFoundContent]="notificationTemplate"
          *ngIf="countItems === 0"
        ></nz-empty>
      </nz-card>
    </cdk-virtual-scroll-viewport>
    <ng-template #notIamge>
      <div class="not_found">
        <i class="fas fa-bell-slash"></i>
        <span>No cuentas con notificaciones</span>
      </div>
    </ng-template>
    <ng-template #notificationTemplate> </ng-template>
  `,
  styleUrls: ['./notification.component.scss'],
  providers: [NotificationService],
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  notifications: Observable<Inotification[]>;
  @ViewChild('notificationTemplate', { static: false })
  templateNotFound: TemplateRef<any>;
  @Output() sizeList = new EventEmitter<number>();
  @Output() onReadNotifications = new EventEmitter<() => void>();
  private allNotificationRead = false;
  countItems = 0;
  constructor(
    private notificationService: NotificationService,
    private nzConfigService: NzConfigService
  ) {}
  ngAfterViewInit(): void {
    this.nzConfigService.set('empty', {
      nzDefaultEmptyContent: this.templateNotFound,
    });
  }

  ngOnInit(): void {
    this.preparateEventReadNotifications();
    // init configuration service
    this.notificationService.initConfigurations();

    this.notifications = this.notificationService.notifications.pipe(
      tap(this.notifyCount),
      tap((el) => (this.countItems = el.length))
    );
  }

  /*=============================================
  =            FILTERS AND ACTIONS            =
  =============================================*/

  notifyCount = (el: Inotification[]) => {
    // all notificatios to read ?
    this.allNotificationRead = el.every(({ read }) => read);
    this.sizeList.emit(el.filter(({ read }) => !read).length);
  };

  private preparateEventReadNotifications() {
    const readNotification = (els: Inotification[]) => {
      return els.map((el) => ({ ...el, read: true }));
    };
    const onReadNotification = async () => {
      // read notification on server only has unread notifications :)
      if (!this.allNotificationRead)
        await this.notificationService.readNotifications();
      else console.log('ignore all notifications => read :)');
      // read local notifications
      this.notifications = this.notifications.pipe(
        map(readNotification),
        tap(this.notifyCount)
      );
    };
    this.onReadNotifications.emit(onReadNotification);
  }
}
