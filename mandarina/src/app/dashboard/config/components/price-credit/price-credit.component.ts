import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, share } from 'rxjs/operators';
import { ItemMoney } from './../../../../@core/models/config.model';
import { PriceConfigService } from './../../services/price-config.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { symbols } from '@core/data/money';
@Component({
  selector: 'app-price-credit',
  template: `
    <form nz-form [formGroup]="adMoneyForm" (ngSubmit)="addPriceItem()">
      <nz-space nzDirection="horizontal">
        <!-- price credit -->
        <nz-space-item>
          <nz-form-control>
            <nz-form-label> Precio por credito </nz-form-label>
            <nz-input-number
              nzMin="0"
              formControlName="price"
            ></nz-input-number>
          </nz-form-control>
        </nz-space-item>
        <!-- money -->
        <nz-space-item style="width: 100px">
          <nz-form-control>
            <nz-select nzPlaceHolder="Moneda" formControlName="symbol">
              <nz-option
                [nzValue]="symbol"
                [nzLabel]="symbol"
                *ngFor="let symbol of symbols"
              ></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-space-item>
        <!-- addd -->
        <nz-space-item>
          <button type="submit" nz-button [disabled]="!adMoneyForm.valid">
            agregar
          </button>
        </nz-space-item>
      </nz-space>
    </form>
    <!-- list added -->
    <nz-divider nzText="Agregados"></nz-divider>
    <nz-list nzBordered>
      <nz-list-item *ngFor="let item of moneys$ | async">
        {{ item.price }} <b>{{ item.symbol }}</b>
        <ul nz-list-item-actions>
          <nz-list-item-action>
            <button
              nz-button
              nzDanger
              (click)="deleteMoney(item.symbol)"
              nzType="primary"
            >
              <i nz-icon nzType="delete" nzTheme="outline"></i>
            </button>
          </nz-list-item-action>
        </ul>
      </nz-list-item>
    </nz-list>
  `,
  styles: [],
  providers: []
})
export class PriceCreditComponent implements OnInit {
  moneys$: Observable<ItemMoney[]> = of([]);
  adMoneyForm: FormGroup;
  symbols = symbols;

  constructor(
    private priceServiceConfig: PriceConfigService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.adMoneyForm = this.fb.group({
      price: [0, Validators.required],
      symbol: [null, Validators.required]
    });
    this.priceServiceConfig.init();
    this.moneys$ = this.priceServiceConfig.moneyObs$;
  }
  deleteMoney(symbol: string) {
    this.priceServiceConfig.deleteMoney(symbol);
  }
  addPriceItem() {
    const value = this.adMoneyForm.value;
    this.priceServiceConfig.addPrice(value);
  }
}
