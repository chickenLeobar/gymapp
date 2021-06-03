import { MyCustomValidators } from './../../../../helpers/Validators';
import { IconfigAction } from './../../config';
import { ResourceService } from '@services/resource.service';
import { StorageService } from '@core/modules/storage/storage.service';
import { IEvent } from 'src/app/@core/models/eventmodels/event.model';
import { EventState } from '@core/models/eventmodels/enums.event';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '@services/utils.service';
import { EventService } from './../../services/event.service';
import { mergeDatetTime } from '@helpers/helpers';
import { Component, Inject, OnInit, Injector } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { getBase64 } from 'src/app/helpers/helpers';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { configResolveFactory, ICONFIG_ACTION } from '../../config';
import { Icategorie } from 'src/app/dashboard/categorie/model.categorie';

interface IEventForm {
  title: string;
  description: string;
  categorie: any;
  credits: number;
}
interface IconfigValueForm {
  includeComment: boolean;
  programDate: Date;
  programTime: Date;
  includeVideo: boolean;
  optionPublished: EventState;
}
@Component({
  selector: 'app-handleevent',
  templateUrl: './handleevent.component.html',
  styleUrls: ['../../events.component.scss'],
  providers: [
    {
      provide: ICONFIG_ACTION,
      useFactory: configResolveFactory,
      deps: [ActivatedRoute]
    }
  ]
})
export class HandleeventComponent implements OnInit {
  /**
   *
   * TODO:
   * [ ] implement reset forms
   *
   */
  public previewImage: string | SafeUrl;
  public eventForm: FormGroup;
  public configForm: FormGroup;
  private fileForUpload: File;
  public currentEvent: IEvent;
  public editMode = false;
  private fileVideoUpload: File;
  private subs: Subscription[] = [];
  public videosrc: string | SafeUrl;
  public messageSpinner = 'Loading..';
  public percentVideo = -1;
  public isProgram = false;

  public categories: Icategorie[] = [];
  // usage for embed video in html

  public optionsPublished: {
    label: string;
    value: EventState;
    checked?: boolean;
  }[] = [
    {
      label: 'borrador',
      value: EventState.DRAFT
    },
    {
      label: 'publicar',
      value: EventState.PUBLIC
    },
    {
      label: 'programar',
      value: EventState.PROGRAM
    }
  ];
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private eventService: EventService,
    private modal: NzModalService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private utils: UtilsService,
    private ngxSpinner: NgxSpinnerService,
    private sanitize: DomSanitizer,
    private serviceStorage: StorageService,
    private resourceService: ResourceService,
    @Inject(ICONFIG_ACTION) public config: IconfigAction,
    private injector: Injector
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.listenRoutes();
  }
  private listenRoutes(): void {
    this.eventService.getCategories().subscribe((categories: Icategorie[]) => {
      this.categories = categories;
    });
    this.activateRoute.data.subscribe((data: Data) => {
      if (data?.type && data.type === 'program') {
      }
    });

    const subRoute = this.activateRoute.queryParams.subscribe(
      (params: Params) => {
        if ('edit' in params) {
          const idParam: number = params['edit'];
          this.editMode = true;
          if (!this.currentEvent) {
            this.getEvent(idParam);
          }
        }
      }
    );
    this.subs.push(subRoute);
  }

  /*=============================================
  =            cloudinary logic functions            =
  =============================================*/

  public selectVideo(video: File): void {
    /**
     * FIXME:
     * - the file preview in only show once
     */
    this.fileVideoUpload = video;
    this.videosrc = this.sanitize.bypassSecurityTrustUrl(
      URL.createObjectURL(video)
    );
  }

  /*=============================================
   =            upload video (in S3)            =
   =============================================*/

  private async uploadVIdeo() {
    return new Promise((resolve, reject) => {
      let detailResource: {
        bucket?: string;
        key?: string;
        type?: string;
      } = {};
      const subUpload = this.serviceStorage
        .uploadFileAws3(this.fileVideoUpload)
        .subscribe(
          (res) => {
            detailResource = res.resp;
            this.percentVideo = res.percent;
          },
          () => {},
          async () => {
            // clean the file
            this.fileVideoUpload = null;
            // create resource in backend
            resolve(detailResource);
            this.percentVideo = -1;
            subUpload.unsubscribe();
          }
        );
    });
  }
  public navigateSesions(): void {
    this.router.navigate([
      '/dashboard',
      'events',
      'sesion',
      this.currentEvent.id
    ]);
  }

  /** validations */
  private validateEvent(): IEvent {
    const configValue = this.configForm.value as IconfigValueForm;
    if (this.eventForm.invalid) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: 'Formulario invalido'
      });
      throw new Error();
    }
    // value event
    const eventFormValue = this.eventForm.value as IEventForm;
    const title = eventFormValue.title;
    const description = eventFormValue.description;
    // value config
    let programDate: Date = null;
    if (configValue.optionPublished === EventState.PROGRAM) {
      if (configValue.programDate == null || configValue.programTime == null) {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: 'Por favor proporcione todos los campos'
        });
        throw new Error();
      }
      programDate = mergeDatetTime(
        configValue.programDate,
        configValue.programTime
      );
    }
    return {
      ...this.currentEvent,
      name: title,
      includeVideo: configValue.includeVideo,
      description: description,
      publishedDate: programDate != null ? programDate : null,
      published: configValue.optionPublished,
      includeComments: configValue.includeComment,
      modeEvent: this.config.type,
      category_id: eventFormValue.categorie,
      credits: Number(eventFormValue.credits)
    } as IEvent;
  }
  /*=============================================
=            get for easy consult            =
=============================================*/
  get isIncludeVideo(): boolean {
    return this.configForm.get('includeVideo').value;
  }

  /*============================================
 =            logic for interactue with BD          =
 =============================================*/
  /** final load event nad prepare sesions */
  public actionEvent(): void {
    let event: IEvent | null = null;
    try {
      event = this.validateEvent();
    } catch (error) {
      return;
    }
    if (!this.previewImage) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: `El ${this.config.action} necesita una imagen`
      });
      return;
    }
    const ctrlEvent = async () => {
      /**
       *  Si se envia un null en el video el backend debe editarlo
       * o si se envia una url diferente
       */
      /// validations for video
      if (!this.fileVideoUpload && !this.videosrc && this.isIncludeVideo) {
        this.modal.confirm({
          nzTitle: 'Ups',
          nzContent:
            'No se ha includo un video, este no es requerido, pero activo la opción ¿Desea continuar sin video?',
          nzOkText: 'si',
          nzCancelText: 'no',
          nzOnOk: () => {
            this.configForm.patchValue({ includeVideo: false });
          },
          nzOnCancel: () => {
            throw new Error();
          }
        });
      }

      this.ngxSpinner.show();

      if (this.fileVideoUpload && this.isIncludeVideo) {
        this.messageSpinner = 'Cargando video';
        try {
          const dataresource: {
            bucket?: string;
            key?: string;
            type?: string;
          } = await this.uploadVIdeo();
          if (!this.editMode || !this.currentEvent?.id_resource) {
            const resource = await this.resourceService.createResource({
              key: dataresource.key,
              bucket: dataresource.bucket,
              type: dataresource.type
            });
            event.id_resource = resource.data.createResource.id;
          } else {
            await this.resourceService.editResource(
              {
                bucket: dataresource.bucket,
                key: dataresource.key,
                type: dataresource.type
              },
              this.currentEvent.id_resource
            );
          }

          // event.id_resource = resource.id;
        } catch (error) {}
      }

      if (!this.editMode) {
        this.messageSpinner = 'Cargando' + this.config.action;
        this.saveEvent(event);
      } else {
        /** si edit mode esta desactivado entonces verificar que se envie un null en video */
        this.messageSpinner = 'Editando' + this.config.action;
        this.editEvent(this.currentEvent.id, event);
      }
    };
    //
    ctrlEvent();
  }
  private editEvent(id: number, event: IEvent) {
    const subEditEvent = this.eventService
      .editEvent(id, event)
      .subscribe((res) => {
        this.ngxSpinner.hide();
        if (res.data.editEvent.resp) {
          this.currentEvent = res.data.editEvent.event;
          this.uploadImage(this.currentEvent.id);
          this.msg.success(`El ${this.config.action} ha sido actualizado`);
        }
      });
    this.subs.push(subEditEvent);
  }
  private saveEvent(event: IEvent): void {
    const subSaveEvent = this.eventService.addEvent(event).subscribe(
      (res) => {
        if (res.data.createEvent.resp) {
          const evenResp = res.data.createEvent.event;
          this.setValuesOnFormEvent(evenResp);
          this.uploadImage(evenResp.id);
          this.ngxSpinner.hide();
          // changue url
          this.msg.success(`${this.config.action} creado satisfactioriamente`);
          this.currentEvent = evenResp;
          this.editMode = true;
          this.router.navigate([], {
            queryParams: {
              edit: res.data.createEvent.event.id
            }
          });
        }
      },
      (err) => {
        this.ngxSpinner.hide();
      }
    );
    this.subs.push(subSaveEvent);
  }
  private getEvent(id: number) {
    const subGetEvent = this.eventService.getEvent(id).subscribe((resp) => {
      if (resp.data.event != null) {
        // fill categorie
        const categorie = this.categories.find(
          ({ id }) => id == resp.data.event.category_id
        );

        this.eventForm.patchValue({ categorie: categorie.id });

        this.setValuesOnFormEvent(resp.data.event);
        this.currentEvent = resp.data.event;
      } else {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: `Este ${this.config.action} no ha sido encontrado`
        });
        this.router.navigateByUrl('/dashboard');
      }
    });
    this.subs.push(subGetEvent);
  }
  /**
   * upload file
   */
  /*=============================================
  =           patch values in forms         =
  =============================================*/
  //  patch value in form
  private setValuesOnFormEvent(event: IEvent) {
    const urlVideo = event.video?.url;
    ///  reset values published
    this.optionsPublished = this.optionsPublished.map((el) =>
      el.value == Number(EventState[event.published])
        ? { ...el, checked: true }
        : el
    );

    const statateEvent =
      typeof event.published == 'number'
        ? event.published
        : EventState[event.published];
    // patch valuees in  principal form
    this.eventForm.patchValue({
      title: event.name,
      description: event.description,
      credits: event.credits
    });

    this.configForm.patchValue({
      optionPublished: this.optionsPublished,
      includeComment: event.includeComments,
      programDate:
        statateEvent == EventState.PROGRAM
          ? new Date(event.publishedDate)
          : null,
      programTime:
        statateEvent == EventState.PROGRAM
          ? new Date(event.publishedDate)
          : null,
      includeVideo: event.includeVideo
    });
    if (urlVideo?.length) {
      this.videosrc = this.sanitize.bypassSecurityTrustUrl(urlVideo);
    }
    if (!this.previewImage) {
      this.previewImage = this.utils.resolvePathImage(
        event.eventCover as string
      );
    }
  }

  /*=============================================
=            build Forms            =
=============================================*/

  private buildForm(): void {
    this.configForm = this.fb.group({
      includeComment: this.fb.control(false),
      programDate: this.fb.control(null),
      programTime: this.fb.control(null),
      includeVideo: this.fb.control(false),
      optionPublished: this.fb.control(this.optionsPublished)
    });
    this.eventForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      description: this.fb.control(null, [Validators.required]),
      categorie: this.fb.control(null, [
        Validators.required,
        MyCustomValidators.verifyCriteriaInArray('name', this.categories)
      ]),
      credits: this.fb.control(0, [Validators.required])
    });
  }
  /*=============================================
 =           vaidate image             
 =============================================*/
  actionServer = (info: any) => {
    const errors = [];
    // el formato de validacion debe serapararse en un archivo de configuracion
    const isJpgOrPng =
      info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    if (!isJpgOrPng) {
      errors.push('Este tipo de archivo no esta permitido');
    }
    getBase64(info.file, (image) => {
      const imagetest = new Image();
      imagetest.onload = () => {
        // validations image
        imagetest.width;

        if (imagetest.width <= 400) {
          errors.push('Esta image es muy pequeña');
        }

        if (info.size / 1024 / 1024 > 5) {
          errors.push('Excedio las 5mb por archivo');
        }
        if (errors.length == 0) {
          this.fileForUpload = info.file;
          this.previewImage = image;
        } else {
          this.msg.error(errors.pop());
        }
      };
      imagetest.src = URL.createObjectURL(info.file);
    });
    // launch errors
    if (errors.length > 0) {
      this.msg.error(errors.pop());
    }
    return of(null);
  };

  // upload image on server
  private uploadImage(id: any) {
    if (this.fileForUpload) {
      this.ngxSpinner.show();
      this.messageSpinner = 'Cargando Imagen';
      const subUpload = this.eventService
        .uploadFile(this.fileForUpload, id)
        .subscribe((res) => {
          //  build url image
          this.ngxSpinner.hide();
          this.previewImage = this.utils.resolvePathImage(
            res.data.addCoverEvent.path
          );
        });

      this.subs.push(subUpload);
      return;
    }
  }
}
