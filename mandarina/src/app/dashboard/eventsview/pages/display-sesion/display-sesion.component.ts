import { CommentService } from './../../../../@core/modules/comments/services/comment.service';
import { CommonEventSesionComponent } from './../../components/common-event-sesion/common-event-sesion.component';
import { UtilsService } from '@services/utils.service';
import { SesionService } from './../../../events/services/sesion.service';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { isPast } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-display-sesion',
  templateUrl: './display-sesion.component.html',
  styleUrls: ['../styles.scss']
})
export class DisplaySesionComponent
  extends CommonEventSesionComponent
  implements OnInit {
  currentSesion: Isesion;
  constructor(
    private activatRoute: ActivatedRoute,
    private sesionServiceex: SesionService,
    private utilsService: UtilsService,
    private modal: NzModalService,
    public changueDetector: ChangeDetectorRef,
    public commentService: CommentService
  ) {
    super(changueDetector, commentService);
  }
  ngOnInit(): void {
    this.listenRoutes();
  }
  /*=============================================
  =            listens            =
  =============================================*/
  private listenRoutes() {
    this.activatRoute.params.subscribe((params: Params) => {
      this.sesionServiceex
        .getSesion(params.sesion)
        .valueChanges.subscribe((resp) => {
          const sesion = resp.data.sesion;
          if (sesion) {
            this.currentSesion = {
              ...resp.data.sesion,
              sesionCover: this.utilsService.resolvePathImage(
                sesion.sesionCover
              ) as string
            };
          }
        });
    });
  }
  /*=============================================
  =            events Dom            =
  =============================================*/
  registerSesion() {
    if (isPast(this.currentSesion.startSesion)) {
      this.modal.error({
        nzTitle: 'Sesión no disponible',
        nzContent:
          'Esta sesion ya ha pasado o no esta disponible, si cree que es nuestro error comuniquese con un asesor'
      });
    } else {
      window.open(this.currentSesion.linkRoom, '_blank');
    }
  }

  /*=============================================
  =            gets            =
  =============================================*/

  get isVideo() {
    return this.currentSesion.includeVideo;
  }

  /*=============================================
  =            helpers            =
  =============================================*/
}
