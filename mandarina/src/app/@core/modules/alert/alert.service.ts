import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IAlert } from './model.alert';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AlertService {
  private alerts: Map<string, IAlert> = new Map();
  private alertsObs = new BehaviorSubject<IAlert[]>(this.getArrayOfMap);
  constructor() {
    // this.addAlert();
  }
  private get getArrayOfMap() {
    return Array.from(this.alerts.values());
  }
  // add Alert
  public addAlert(alert: IAlert) {
    if (!alert.id) {
      alert.id = uuid();
    }
    this.alerts.set(alert.id, alert);
    this.alertsObs.next(this.getArrayOfMap);
  }
  //
  public get getalerts() {
    return this.alertsObs.asObservable();
  }
}
