import { UtilsService } from './../../services/utils.service';
import { IResource } from '@models/eventmodels/resource.model';
import { tap, pluck, mergeMap, takeUntil } from 'rxjs/operators';
import { Icategorie, IcategorieView } from './model.categorie';
import { getBase64 } from 'src/app/helpers/helpers';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, Observable, from, concat, Subject } from 'rxjs';
import { CategorieService } from './categorie.service';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditComponent } from './components/modal-edit/modal-edit.component';
import { NzModalService } from 'ng-zorro-antd/modal';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ResourceService } from '@services/resource.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
})
export class CategorieComponent implements OnInit, OnDestroy {
  config = {
    minLength: 5,
    maxLength: 50,
  };

  private notifyUnsuscribe: Subject<void> = new Subject<void>();

  categories: Observable<Icategorie[]>;

  @ViewChild('formCategorie', { read: TemplateRef, static: false })
  tplEdit: TemplateRef<any>;

  categorieForm: FormGroup;
  fileForUpload: File;
  previewImage: string;
  positionTap: NzTabPosition = 'top';
  currentSelectCategorie: Icategorie = null;
  public editMode: boolean = false;
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    public categorieService: CategorieService,
    private matDialog: MatDialog,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private resourceService: ResourceService,
    private utils: UtilsService
  ) {
    this.categories = this.categorieService.getCategories();
  }
  ngOnDestroy(): void {
    this.notifyUnsuscribe.next();
    this.notifyUnsuscribe.complete();
  }
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
  ngOnInit(): void {
    this.categorieForm = this.fb.group({
      name: this.fb.control(null, [
        Validators.required,
        Validators.minLength(this.config.minLength),
        Validators.maxLength(this.config.maxLength),
      ]),
      description: this.fb.control(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  deleteCategorie() {
    this.modal.confirm(
      {
        nzTitle: '¿Esta seguro que desea eliminar esta categoria?',
        nzContent:
          'Esta acción borrara todos los eventos y/o programas vinculados a este',
        nzOkText: 'Si, eliminar',
        nzCancelText: 'cancelar',
        nzOnOk: () => {},
      },
      'warning'
    );
  }
  /*=============================================
 =            DOM EVENTS            =
 =============================================*/
  sendCategorie() {
    const obs = [];
    // this.resourceService.uploadlocalResource(this.fileForUpload).subscribe();
    if (this.categorieForm.valid) {
      let fileObs: Observable<any>;
      if (this.fileForUpload) {
        fileObs = this.resourceService.uploadlocalResource(this.fileForUpload);
      }
      let categorie = this.categorieForm.value as Icategorie;
      if (!this.editMode && this.currentSelectCategorie == null) {
        if (fileObs) {
          fileObs = fileObs.pipe(
            mergeMap((res) =>
              // create resource in the server
              from(
                this.resourceService.createResource({
                  key: res.key,
                  instace: res.instance,
                })
              ).pipe(
                pluck('data', 'createResource'),
                tap((res) => {
                  categorie.id_image = res.id;
                })
              )
            )
          );
          // add obs in the cole
          obs.push(fileObs);
        }
        /// create categorie
        const createCategorie = this.categorieService
          .createCategorie(categorie)
          .pipe(
            tap((el) => {
              this.currentSelectCategorie = el;
              this.patchValuesInForm(el);
              this.editMode = true;
              this.notification.success(
                'Categoria Agregada',
                'se ha agregado una nueva catgoria'
              );
            })
          );

        obs.push(createCategorie);
        // concat obs
      } else {
        if (fileObs) {
          console.log('enter here');

          fileObs = fileObs.pipe(
            mergeMap((res, _) => {
              console.log('enter here');
              return from(
                this.resourceService.editResource(
                  {
                    key: res.key,
                    instace: res.instance,
                  },
                  Number(this.currentSelectCategorie.image.id)
                )
              );
            })
          );
          obs.push(fileObs);
        }

        obs.push(
          this.categorieService
            .editCategorie(this.currentSelectCategorie.id, categorie)
            .pipe(
              tap((data) => {
                this.msg.success('Categoria editada correctamente');
                this.resetForm();
              })
            )
        );
        // edit categorie
      }
      // execute
      concat(...obs)
        .pipe(takeUntil(this.notifyUnsuscribe))
        .subscribe();
    }
  }

  private patchValuesInForm(categorie: Icategorie) {
    if (categorie?.image?.url)
      this.previewImage = this.utils.resolvePathImage(
        categorie.image.url
      ) as string;
    this.categorieForm.patchValue(categorie);
  }
  private resetForm() {
    this.categorieForm.reset();
    this.currentSelectCategorie = null;
    this.previewImage = null;
  }
  viewOptionsTable(categorie: Icategorie) {
    // this.categorieService.getCategories().
    if (this.tplEdit) {
      this.currentSelectCategorie = categorie;
      this.patchValuesInForm(categorie);
      const ref = this.matDialog.open(ModalEditComponent, {
        width: '700px',
        data: { tpl: this.tplEdit, context: { $implicit: true } },
      });
      ref.afterClosed().subscribe(() => {
        this.resetForm();

        this.currentSelectCategorie = null;
        this.editMode = false;
      });
    }
  }
}
