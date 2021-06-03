import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { WelcomeCreditsService } from '../../services/welcome-credits.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IwelcomeCreditsValue } from '@core/models/config.model';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-welcome-credits',
  template: `
    <ng-template #tplCreditForm>
      <!-- <h3 class="title line_addon">Aplicar Creditos</h3> -->
      <form
        action=""
        nz-form
        nzNoColon
        [formGroup]="formAddItem"
        (ngSubmit)="addItem()"
        nzLayout="horizontal"
      >
        <nz-form-item nzRequired>
          <nz-form-control>
            <nz-form-label> Creditos </nz-form-label>
            <nz-input-number nzMin="0" formControlName="credits">
            </nz-input-number>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item nzRequired>
          <nz-form-control>
            <nz-form-label nzFor="reason"> Razón </nz-form-label>
            <textarea
              formControlName="reason"
              name=""
              id="reason"
              nz-input
              cols="10"
              nzSize="small"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
        <nz-space>
          <nz-space-item>
            <button
              nz-button
              type="button"
              nzType="primary"
              nzDanger
              (click)="closeExpansion()"
            >
              Cancelar
            </button>
          </nz-space-item>
          <nz-space-item>
            <button
              nz-button
              type="submit"
              [disabled]="!formAddItem.valid"
              nzType="primary"
            >
              Agregar
            </button>
          </nz-space-item>
        </nz-space>
      </form>
    </ng-template>

    <div nz-row nzJustify="center" nzGutter="15">
      <!-- add credit -->
      <div nz-col nzSpan="15">
        <p nz-typography>
          {{ data.info.description }}
        </p>
        <!-- ADD  -->
        <nz-divider></nz-divider>
        <!-- accordion -->
        <mat-accordion>
          <mat-expansion-panel
            [expanded]="expanseForm"
            (opened)="expanseForm = true"
          >
            <mat-expansion-panel-header>
              Agregar creditos
            </mat-expansion-panel-header>
            <ng-container *ngTemplateOutlet="tplCreditForm"></ng-container>
          </mat-expansion-panel>
        </mat-accordion>
        <nz-divider nzText="Agregados"></nz-divider>
        <nz-table #tableData [nzData]="data.data">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Creditos</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of tableData.data">
              <td>
                {{ item.reason }}
              </td>
              <td>{{ item.credits }}</td>
              <td>20/50/20</td>
              <td>
                <button nz-button nzDanger (click)="onDelete(item.id)">
                  <i nz-icon nzType="delete" nzTheme="outline"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </div>
      <ng-template #description let-labels>
        <!-- details -->
        <nz-descriptions nzTitle="Etiquetas" nzBordered nzLayout="vertical">
          <nz-descriptions-item
            nzSpan="4"
            [nzTitle]="item.label"
            *ngFor="let item of labels"
          >
            {{ item.description }}
          </nz-descriptions-item>
        </nz-descriptions>
      </ng-template>

      <div nz-col nzSpan="7">
        <ng-container
          *ngTemplateOutlet="
            description;
            context: { $implicit: data.info.labels }
          "
        ></ng-container>
      </div>
    </div>
  `,
  styles: []
})
@UntilDestroy()
export class WelcomeCreditsComponent implements OnInit {
  @ViewChild('tplCreditForm', { read: TemplateRef })
  tplCreditFormAdd: TemplateRef<NzSafeAny>;

  expanseForm = false;

  data: IwelcomeCreditsValue;

  formAddItem: FormGroup;
  constructor(
    private modalService: NzModalService,
    private welcomeConfig: WelcomeCreditsService,
    private fb: FormBuilder
  ) {
    this.welcomeConfig.init();
  }

  ngOnInit(): void {
    this.formAddItem = this.fb.group({
      credits: [0, Validators.required],
      reason: [null, Validators.required]
    });

    this.welcomeConfig
      .getWelcomeCreditsConfig()
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.data = data));
  }

  closeExpansion() {
    this.expanseForm = false;
  }
  onDelete(id: number) {
    this.welcomeConfig.removeItem(id);
  }
  addItem() {
    const value = this.formAddItem.value;
    this.welcomeConfig.addItem(value);
    this.formAddItem.reset();
    this.expanseForm = false;
  }
}
