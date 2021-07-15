import { switchMapTo, tap, startWith, map } from 'rxjs/operators';
import { ISede } from './../../index';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { SedeStoreService } from '../../services/sede.store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { combineLatest, merge } from 'rxjs';

@Component({
  selector: 'app-handle-sede',
  template: `
    <form
      nz-form
      [formGroup]="form"
      nzLayout="vertical"
      (ngSubmit)="sendForm()"
    >
      <formly-form
        [fields]="fields"
        [options]="options"
        [model]="model"
        [form]="form"
      >
      </formly-form>

      <button [disabled]="buttonDisable" nz-button nzType="primary">
        {{ isEdit ? 'Guardar Cambios' : 'Guardar' }}
      </button>
    </form>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class HandleSedeComponent implements OnInit {
  public options: FormlyFormOptions = {};

  public form: FormGroup = new FormGroup({});

  public buttonDisable = false;

  public currentSede: ISede | null = null;

  public fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Nombre',
        placeholder: 'Nombre',
        type: 'text',
        required: true
      }
    },
    {
      key: 'direction',
      type: 'input',
      templateOptions: {
        label: 'Dirección',
        placeholder: 'Dirección',
        required: true
      }
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Description',
        required: true
      }
    }
  ];

  public model: NzSafeAny = {};

  constructor(
    private _store: SedeStoreService,
    private _messageService: NzMessageService,
    private modalRef: NzModalRef
  ) {
    // this.modalRef.afterClose.subscribe(d => {
    //   this.model = {};
    //   this.currentSede = null;
    //   console.log('modal has been closed');
    // });
  }

  public get isEdit() {
    return this.currentSede != null;
  }
  public sendForm() {
    if (this.form.invalid) {
      this._messageService.error('Existen campos invalidos');
      return;
    } else {
      let sede = this.form.value as ISede;
      if (!this.isEdit) {
        this._store.createSede({ sede });
      } else {
        sede = {
          ...this.currentSede,
          ...sede
        };
        this._store.updateSede({ sede });
      }
    }
  }

  ngOnInit(): void {
    this.listenSelectedSede();

    this.form.statusChanges
      .pipe(
        map(d => {
          return d !== 'VALID' || !this.form.dirty;
        }),
        tap(d => {
          this.buttonDisable = d;
        })
      )
      .subscribe();
  }

  private listenSelectedSede() {
    const selectSede$ = this._store.selectSede$.pipe(
      tap(sede => {
        if (!!sede) {
          this.model = sede;
          this.currentSede = sede;
        }
      })
    );
    merge(
      selectSede$,
      this.modalRef.afterClose.pipe(
        tap(() => {
          if (this.currentSede) {
            this.model = {};
            this.currentSede = null;
            this._store.patchState({
              selectedSede: null
            });
          }
        })
      )
    )
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}
