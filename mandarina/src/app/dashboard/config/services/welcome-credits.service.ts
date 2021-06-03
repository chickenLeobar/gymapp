import { IwelcomeCreditsItem } from './../../../@core/models/config.model';
import { tap, pluck, map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IwelcomeCreditsValue } from '@core/models/config.model';
const PATH_CONFIG = 'defaultCredits';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzMessageService } from 'ng-zorro-antd/message';
@Injectable()
@UntilDestroy()
export class WelcomeCreditsService {
  private $subjectWelcomeCredits = new BehaviorSubject<IwelcomeCreditsValue>(
    {} as IwelcomeCreditsValue
  );
  constructor(
    private configService: ConfigService,
    private msgService: NzMessageService
  ) {}

  init() {
    this.configService
      .getConfig({ path: PATH_CONFIG })
      .pipe(
        pluck('value'),
        untilDestroyed(this),
        map(this.addIdsIndata),
        tap((el: IwelcomeCreditsValue) => this.$subjectWelcomeCredits.next(el))
      )
      .subscribe();
  }

  private addIdsIndata(value: IwelcomeCreditsValue) {
    const data = value.data;
    const newData = data.map((el, i) => ({ ...el, id: i }));
    return {
      ...value,
      data: newData
    };
  }

  getWelcomeCreditsConfig(): Observable<IwelcomeCreditsValue> {
    return this.$subjectWelcomeCredits.asObservable();
  }

  get items() {
    return this.$subjectWelcomeCredits.value.data;
  }
  set items(data: IwelcomeCreditsItem[]) {
    const oldData = this.$subjectWelcomeCredits.value;
    const newData = { ...oldData, data: data };
    this.$subjectWelcomeCredits.next(newData);
    this.configService
      .setConfig({ path: PATH_CONFIG, value: newData })
      .toPromise()
      .then((res) => {
        this.msgService.success('Editado correctamente');
      });
  }
  public addItem(item: IwelcomeCreditsItem) {
    let items = this.items;
    const newItems = [
      ...items,
      { ...item, created: new Date(), id: items.length }
    ];
    this.items = newItems;
  }
  public removeItem(idItem: number) {
    let items = this.items;
    this.items = items.filter(({ id }) => id != idItem);
  }

  public updateItem(id: number, item: IwelcomeCreditsItem) {
    let items = this.items;
    const index = items.findIndex(({ id: el }) => id == el);
    items.splice(index, 1, item);
    this.items = items;
  }
}
