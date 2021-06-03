import { QueryRef } from 'apollo-angular';
import { pluck } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ItemMoney } from '@core/models/config.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
// price credit is array of
const PATH_CONFIG = 'priceCredits';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable()
@UntilDestroy()
export class PriceConfigService {
  // behaviors
  private subjectMoneys$ = new BehaviorSubject<ItemMoney[]>([]);

  // expose
  public moneyObs$ = this.subjectMoneys$.asObservable();
  // refQueries
  _refQuerieMoney: QueryRef<NzSafeAny>;

  constructor(
    private configService: ConfigService,
    private msg: NzMessageService
  ) {}

  init() {
    this.getPriceCredits()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.subjectMoneys$.next(data);
      });
  }

  public addPrice(item: ItemMoney) {
    const existItem = this.subjectMoneys$.value.some(
      ({ symbol }) => symbol == item.symbol
    );
    if (existItem) {
      // FIXME: lauch error here
      this.msg.error('Ya existe esta moneda');
      return;
    }
    this.subjectMoneys$.next([...this.subjectMoneys$.value, item]);
    this.updateData();
  }

  private getPriceCredits(): Observable<ItemMoney[]> {
    return this.configService
      .getConfig({ path: PATH_CONFIG })
      .pipe(pluck('value')) as Observable<ItemMoney[]>;
  }

  public deleteMoney(symbol: string) {
    let data = this.subjectMoneys$.value;
    data = data.filter((el) => el.symbol !== symbol);
    this.subjectMoneys$.next(data);
    this.updateData();
  }

  private updateData() {
    let data = this.subjectMoneys$.value;
    this.configService
      .setConfig({ path: PATH_CONFIG, value: data })
      .toPromise()
      .then(this.getDataOfQuery);
  }
  private getDataOfQuery(data: NzSafeAny) {
    this.subjectMoneys$.next(_.get(data, 'data', 'updateConfiguration'));
  }
}
