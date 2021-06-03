import { BEvent } from './../../../../@core/models/eventmodels/event.model';
import { InteractionServiceEvent } from './../../services/interaction.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { CommentService } from './../../../../@core/modules/comments/services/comment.service';
import { isValidValue } from './../../../../helpers/helpers';
import { CommonEventSesionComponent } from './../../components/common-event-sesion/common-event-sesion.component';
import { ProfileService } from './../../../profile/services/profile.service';
import { IUser } from '@core/models/User';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { IDetailResponse } from '@core/models/eventmodels/event.response';
import { UtilsService } from 'src/app/services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IEvent } from '@core/models/eventmodels/event.model';
import {
  Component,
  OnInit,
  OnDestroy,
  Type,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of, Subscription, Subject } from 'rxjs';
import { JwtService } from '@services/jwt.service';
import { EventService as DisplayEventService } from '../../services/event.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryRef } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import {
  IModalData,
  ModalConfirmInscriptionComponent
} from '../../components/modal-confirm-inscription/modal-confirm-inscription.component';
import { MediaObserver } from '@angular/flex-layout';
import {
  BreakPointCheck,
  checkBreakPoint,
  EBreakpoints
} from '@core/breakPointCheck/public-api';

enum LOCAL_EVENTS {
  ADD_REACTION,
  REMOVEREACTION
}

@Component({
  selector: 'app-displayevent',
  templateUrl: './displayevent.component.html',
  styleUrls: ['../styles.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@BreakPointCheck({ nameObserver: 'media' })
export class DisplayeventComponent
  extends CommonEventSesionComponent
  implements OnInit {
  currentEvent: BEvent;

  public isRegister: boolean = false;

  private modalConfirmRegister: Type<ModalConfirmInscriptionComponent>;

  private refQuerieIsRegister: QueryRef<{ isRegisterEvent: IDetailResponse }>;

  private recolectSubs: Subscription[] = [];

  // describe height of size list of contain sesions
  sizeDisplay = '500px';

  private localEvents$ = new Subject<{
    event: LOCAL_EVENTS;
    paylod?: NzSafeAny;
  }>();

  constructor(
    private activateRoute: ActivatedRoute,
    private eventService: EventService,
    private jwtService: JwtService,
    private serviceDisplayEvent: DisplayEventService,
    private modal: NzModalService,
    private router: Router,
    private dialog: MatDialog,
    private userService: ProfileService,
    public changueDetector: ChangeDetectorRef,
    private media: MediaObserver,
    public commentService: CommentService,
    private interactionService: InteractionServiceEvent
  ) {
    super(changueDetector, commentService);
  }
  /*=============================================
   =           Lfe Cicle            =
   =============================================*/

  ngOnInit(): void {
    this.listenRoutes();
    this.localState();
  }
  ngOnDestroy(): void {
    this.recolectSubs.forEach((sub) => sub.unsubscribe());
  }

  private localState() {
    this.localEvents$.subscribe((pin) => {
      switch (pin.event) {
        case LOCAL_EVENTS.ADD_REACTION: {
          console.log('call add interaction');
          this.reactionEvent('MORE');
          break;
        }
        case LOCAL_EVENTS.REMOVEREACTION: {
          this.reactionEvent('LESS');
          break;
        }
      }
    });
  }

  private reactionEvent(type: 'MORE' | 'LESS') {
    const id = this.jwtService.getUserOfToken().id;
    const eventId = this.currentEvent.id;
    const updateEvent = (data: NzSafeAny[]) => {
      this.currentEvent.interactions = data;
      this.changueDetector.markForCheck();
    };
    if (type == 'MORE') {
      this.interactionService
        .addInteraction({ idUser: id, idEvent: eventId })
        .toPromise()
        .then(updateEvent);
    } else {
      this.interactionService
        .removeInteraction({
          idUser: id,
          idEvent: eventId
        })
        .toPromise()
        .then(updateEvent);
    }
  }

  /*=============================================
  =            gets             =
  ============================================= */
  get isVideo() {
    return (
      isValidValue(this.currentEvent) && isValidValue(this.currentEvent.video)
    );
  }

  /*=============================================
  =            Badges            =
  =============================================*/

  addInteraction() {
    if (this.currentEvent.isMeReaction) {
      this.localEvents$.next({ event: LOCAL_EVENTS.REMOVEREACTION });
    } else {
      this.localEvents$.next({ event: LOCAL_EVENTS.ADD_REACTION });
    }
  }

  /*=============================================
  =            listens            =
  =============================================*/
  private listenRoutes(): void {
    const subRouter = this.activateRoute.params
      .pipe(
        switchMap((params: Params) => {
          if ('id' in params) {
            // display event
            this.recolectSubs.push(
              // recolect sub
              this.eventService.getEvent(params.id, true).subscribe((el) => {
                this.currentEvent = BEvent.instace(el.data.event);

                this.updateifRegiterInEvent();
                // enf id register
              })
            );
          }
          return of(params);
        })
      )
      .subscribe();
    this.recolectSubs.push(subRouter);
  }

  /*=============================================
=            functions bd            =
=============================================*/

  private updateifRegiterInEvent() {
    const user = this.jwtService.getUserOfToken();
    this.refQuerieIsRegister = this.serviceDisplayEvent.isRegisterinEvent(
      user.id,
      Number(this.currentEvent.id)
    );
    this.recolectSubs.push(
      this.refQuerieIsRegister.valueChanges.subscribe((resp) => {
        this.isRegister = resp.data.isRegisterEvent.resp;
        this.changueDetector.markForCheck();
      })
    );
  }

  /*=============================================
  =            GETS LOCAL            =
  =============================================*/

  private componentConfirmCredits(callback: () => void) {
    if (this.modalConfirmRegister) {
      callback();
    } else {
      const components = import(
        '../../components/modal-confirm-inscription/modal-confirm-inscription.component'
      ).then((component) => {
        this.modalConfirmRegister = component.ModalConfirmInscriptionComponent;
        callback();
      });
    }
  }

  private requestRegisterEvent(user: IUser) {
    this.serviceDisplayEvent
      .registerEvent(Number(user.id), Number(this.currentEvent.id))
      .subscribe(({ data }) => {
        const resp = data.attendEvent.resp;
        if (resp) {
          // update register
          this.refQuerieIsRegister.refetch();
          this.modal.success({
            nzTitle: 'Correcto',
            nzContent: 'Se ha registrado a este ' + this.label
          });
        }
      });
  }

  /*=============================================
  =            DOM EVENTs            =
  =============================================*/
  public async registerEvent() {
    const user = await this.userService.onlyUser();
    const haveCredits = user.credit.currentCredits >= this.currentEvent.credits;
    if (!haveCredits) {
      this.modal.error({
        nzTitle: 'Creditos insuficientes',
        nzContent:
          'No dispone de los creditos necesarios para este ' + this.label,
        nzOkText: 'Solicitar',
        nzCancelText: 'cancelar'
      });
      return;
    }
    this.componentConfirmCredits(() => {
      const type =
        this.currentEvent.modeEvent == 'EVENT' ? 'Evento' : 'Programa';
      const text = ``;
      const ref = this.dialog.open(this.modalConfirmRegister, {
        data: {
          nameEvent: this.currentEvent.name,
          prefix: type,
          costCredits: this.currentEvent.credits,
          type: this.currentEvent.modeEvent,
          text: text,
          userCredits: user.credit?.currentCredits
        } as IModalData
      });
      ref.afterClosed().subscribe((resp) => {
        // register in event
        if (resp) {
          this.requestRegisterEvent(user);
        }
      });
    });
  }

  // navigate sesion sesion
  navigateSesion(sesion: Isesion) {
    //  this.r
    if (this.isRegister) {
      this.currentEvent.credits;
      this.router.navigate([
        '/dashboard',
        'view',
        'event',
        this.currentEvent.id,
        sesion.id
      ]);
    } else {
      this.modal.error({
        nzContent: 'Es necesario registrase para tener acceso a las sesiones'
      });
    }
  }

  /*=============================================
=            helpers            =
=============================================*/
  get label() {
    return this.currentEvent.modeEvent == 'EVENT' ? 'evento' : 'programa';
  }
  /*=============================================
  =            breakpoints            =
  =============================================*/
}
