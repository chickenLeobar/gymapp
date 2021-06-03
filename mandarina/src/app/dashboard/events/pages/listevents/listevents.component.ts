import { ICONFIG_ACTION, IconfigAction } from './../../config';
import { pluck, map, tap } from 'rxjs/operators';
import { ProfileService } from './../../../profile/services/profile.service';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@services/utils.service';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { configResolverFactoryWithParams } from '../../config';
import { Subscription, Observable } from 'rxjs';
import _ from 'lodash';
import es from 'date-fns/locale/es';
import { getTimestamp } from '@helpers/helpers';
export interface IviewEvent extends IEvent {
  participants?: number;
  countSesions?: number;
  lessSesions?: number;
  lastSesion?: Date;
}

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['../../events.component.scss'],
  providers: [
    ProfileService,
    {
      provide: ICONFIG_ACTION,
      useFactory: configResolverFactoryWithParams,
      deps: [ActivatedRoute],
    },
  ],
})
export class ListeventsComponent implements OnInit, OnDestroy {
  config = {
    locale: es,
    addSuffix: true,
  };
  public viewEventsData: IviewEvent[] = [];
  public recolectSubs: Subscription[] = [];
  public configAction: IconfigAction;
  constructor(
    private eventsService: EventService,
    private utils: UtilsService,
    private router: Router,
    private profileService: ProfileService,
    private activateRoute: ActivatedRoute,
    @Inject(ICONFIG_ACTION) public obsconfigAction: Observable<IconfigAction>
  ) {}
  ngOnDestroy(): void {
    this.recolectSubs.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
    this.fillLists();
  }

  /*=============================================
  =            fill list            =
  =============================================*/

  private fillLists(): void {
    const buildData = (data: IEvent[]) => {
      return data.map((item) => {
        item = {
          ...item,
          createEvent: getTimestamp(item.createEvent) as Date,
          eventCover: this.utils.resolvePathImage(
            item.eventCover as string
          ) as string,
        };
        return {
          ...item,
        };
      });
    };

    // suscribe changue panel
    const sub = this.obsconfigAction.subscribe((data) => {
      this.configAction = data;
      this.recolectSubs.push(
        this.profileService
          .getUser(data.type, 'eventscreated')
          .pipe(
            pluck('data', 'getUser', 'user', 'eventsCreated'),
            map(buildData)
          )
          .subscribe((data) => {
            this.viewEventsData = data;
          })
      );
    });

    this.recolectSubs.push(sub);
  }

  /*=============================================
=            GETS            =
=============================================*/
  getStateEvent(source: string): { color: string; text: string } {
    type TypePublished = 'DRAFT' | 'PUBLIC' | 'PROGRAM';
    source = source as TypePublished;
    switch (source) {
      case 'DRAFT':
        return { color: '#2db7f5', text: 'borrador' };
      case 'PUBLIC':
        return { color: '#87d068', text: 'publicado' };
      case 'PROGRAM':
        return { color: '#108ee9', text: 'programado' };
    }
    return;
  }

  /*=============================================
   =            event the dom            =
   =============================================*/
  redirectEdit(event: IEvent) {
    const route = event.modeEvent == 'EVENT' ? 'events' : 'program';
    this.router.navigate(['dashboard', 'events', route], {
      queryParams: {
        edit: event.id,
      },
    });
  }
}
