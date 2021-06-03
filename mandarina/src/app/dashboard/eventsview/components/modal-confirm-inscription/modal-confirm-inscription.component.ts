import { MODEEVENT } from '@core/models/eventmodels/event.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export interface IModalData {
  text: string;
  userCredits: number;
  costCredits: number;
  prefix: string;
  nameEvent: string;
}

@Component({
  selector: 'modal-confirm-credits',
  template: `<div class="container_confirm">
    <h1 class="title line_addon">Detalle de registro</h1>
    <p class="paragraph" nz-typography>{{ data.text }}</p>
    <nz-descriptions nzTitle="Detalles" nzBordered>
      <nz-descriptions-item [nzTitle]="data.prefix" [nzSpan]="4">
        {{ data.nameEvent }}
      </nz-descriptions-item>
      <nz-descriptions-item nzTitle="Créditos Disponibles" [nzSpan]="4">
        {{ data.userCredits }}
      </nz-descriptions-item>

      <nz-descriptions-item [nzTitle]="priceProgramText" [nzSpan]="4">
        {{ data.costCredits }}
      </nz-descriptions-item>
    </nz-descriptions>
    <div
      class="w-100 my-4"
      fxLayoutGap="15px"
      fxLayout="row"
      fxLayoutAlign="center center"
    >
      <button
        nz-button
        class="m-2"
        (click)="actionButton(true)"
        nzType="primary"
      >
        Aceptar
      </button>
      <button
        nz-button
        class="m-2"
        (click)="actionButton(false)"
        nzType="primary"
        nzDanger
      >
        Cancelar
      </button>
    </div>
  </div> `,
  styleUrls: ['./modal-confirm-inscription.component.scss']
})
export class ModalConfirmInscriptionComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IModalData,
    private dialogRef: MatDialogRef<ModalConfirmInscriptionComponent>
  ) {}
  ngOnInit(): void {}
  actionButton(resp: boolean) {
    this.dialogRef.close(resp);
  }
  get priceProgramText() {
    return 'Costo del ' + this.data.prefix;
  }
}
// part module

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [ModalConfirmInscriptionComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzTypographyModule
  ],
  exports: [],
  providers: []
})
export class ModalConfirmModule {}
