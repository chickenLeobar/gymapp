import { ActionService } from '@services/action.service';
import { mergeMap, pluck, map, tap, takeUntil } from 'rxjs/operators';
import { of, Subscription, Subject, from } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UtilsService } from '@services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { IEvent, MODEEVENT } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';
import { AlertService } from '@core/modules/alert/alert.service';
import { eventsCategoryOperations } from '../../services/events.operation';
import { Icategorie } from 'src/app/dashboard/categorie/model.categorie';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['./listevents.component.scss']
})
@UntilDestroy()
export class ListeventsComponent implements OnInit {
  public items: IEvent[] = [];
  public options: NgxMasonryOptions = {
    gutter: 20,
    horizontalOrder: true
  };

  informationArgs: {
    label: string;
    showButton?: boolean;
    args: eventsCategoryOperations;
  }[] = [];

  private recolectorSubs: Subscription[] = [];
  programs: IEvent[] = [];
  events: IEvent[] = [];
  typeEvent: MODEEVENT;

  private unsuscribeEvents: Subject<void> = new Subject<void>();

  public currentCategorie: Icategorie;

  constructor(
    private eventService: EventService,
    private utilsService: UtilsService,
    private route: Router,
    private activateRouter: ActivatedRoute,
    private alertService: AlertService,
    private actionService: ActionService
  ) {}
  /*=============================================
 =            events DOM            =
 =============================================*/
  public redirectEvent(id: number) {
    this.route.navigateByUrl(`/dashboard/view/event/${id}`);
  }

  ngOnInit(): void {
    // this.prepareLists();
    this.routerListens();
  }

  /*=============================================
   =            LISTENS            =
   =============================================*/
  private routerListens() {
    this.actionService.suscribeEvents('REFETCHEVENTS').subscribe((_) => {
      const params = this.activateRouter.snapshot.queryParams;
      this.prepareALlLists(params);
    });
    this.activateRouter.queryParams
      .pipe(takeUntil(this.unsuscribeEvents))
      .subscribe((params: Params) => {
        this.prepareALlLists(params);
      });
  }
  private prepareALlLists(params: Params) {
    const isEmpty = Object.keys(params).length == 0;
    if (isEmpty) {
      this.route.navigate([], { queryParams: { type: 'events' } });
    }
    if (params?.type) {
      const isEvent = params?.type === 'events';
      if (isEvent) {
        this.typeEvent = 'EVENT';
      } else {
        this.typeEvent = 'PROGRAM';
      }
      this.prepareCategories();
    } else if (params?.category) {
      const categoryid = Number(params.category);
      this.prepareRowsForCategory(categoryid);
    }
  }
  prepareRowsForCategory(idCategory: number) {
    this.eventService
      .getCategories(idCategory)
      .pipe(
        untilDestroyed(this),
        tap((categorie) => {
          this.currentCategorie = categorie[0];
          this.informationArgs = [];
          // recents events
          this.informationArgs.push({
            label: 'Eventos',
            showButton: false,
            args: {
              idCategory: idCategory,
              modeEvent: 'EVENT',
              recents: true
            }
          });
          // recents programs
          this.informationArgs.push({
            label: 'Programas',
            showButton: false,
            args: {
              idCategory: idCategory,
              modeEvent: 'PROGRAM',
              recents: true
            }
          });
        })
      )
      .subscribe();
  }

  prepareCategories() {
    this.currentCategorie = null;
    this.informationArgs = [];
    this.informationArgs.push({
      label: 'Recientes',
      args: { idCategory: -1, modeEvent: this.typeEvent, recents: true }
    });
    this.prepareLists();
  }
  /*=============================================
  =            METHODS            =
  =============================================*/
  private prepareLists() {
    this.eventService
      .getCategories()
      .pipe(
        takeUntil(this.unsuscribeEvents),
        mergeMap(from),
        tap((categorie: Icategorie) => {
          this.informationArgs.push({
            label: categorie.name,
            args: {
              idCategory: categorie.id,
              modeEvent: this.typeEvent,
              recents: false
            }
          });
        })
      )
      .subscribe();
  }
}
