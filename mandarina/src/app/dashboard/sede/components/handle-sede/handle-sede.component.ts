import { ISede } from './../../index';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { SedeStoreService } from '../../services/sede.store';

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
      <button nz-button nzType="primary">
        Guardar
      </button>
    </form>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HandleSedeComponent implements OnInit {
  public options: FormlyFormOptions = {};

  public form: FormGroup = new FormGroup({});

  public fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Nombre',
        placeholder: 'Nombre',
        type: 'text'
      }
    },
    {
      key: 'direction',
      type: 'input',
      templateOptions: {
        label: 'Dirección',
        placeholder: 'Dirección'
      }
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Description'
      }
    }
  ];

  public model: NzSafeAny = {};

  constructor(private _store: SedeStoreService) {}

  public sendForm() {
    const sede = this.model as ISede;

    this._store.createSede({ sede });
  }

  ngOnInit(): void {}
}
