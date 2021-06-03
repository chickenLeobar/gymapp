import { Isesion } from '@core/models/eventmodels/sesion.model';
import { map, pluck } from 'rxjs/operators';
import { JwtService } from '@services/jwt.service';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { EventService } from '../../../events/services/event.service';
import _ from 'lodash';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  public date = new Date();
  public mode: NzCalendarMode = 'month';
  public sesions: Isesion[];
  constructor(
    private eventService: EventService,
    private jwtService: JwtService
  ) {}
  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }
  ngOnInit(): void {
    this.listenQueries();
  }

  /*=============================================
  =            listen Routes            =
  =============================================*/
  listenQueries() {
    const user = this.jwtService.getUserOfToken();
    this.eventService
      .getEventsOfUser(user.id)
      .valueChanges.pipe(
        pluck('data', 'getEventsOfUser'),
        map((response) => {
          return _.flatMap(response.events.map((ev) => ev.sesions));
        })
      )
      .subscribe((sesions) => {
        this.sesions = sesions;
      });
  }

  public existSesion(date: Date) {
    const sesions = (this.sesions || []).filter((ev) => {
      const startSesion = new Date(ev.startSesion);
      return (
        startSesion.getDate() === date.getDate() &&
        startSesion.getMonth() === date.getMonth() &&
        startSesion.getFullYear() === date.getFullYear()
      );
    });
    if (sesions.length > 0) {
      return sesions;
    }
    return null;
  }

  /*=============================================
  =            Dom Events            =
  =============================================*/

  changueItem($event): void {
    console.log($event);
  }
}
