import { pluck, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Data } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { MODEEVENT } from '@core/models/eventmodels/event.model';
export interface IconfigAction {
  action?: string;
  type?: MODEEVENT;
  isProgram?: boolean;
}

export const ICONFIG_ACTION = new InjectionToken<IconfigAction>('');

export const configEvent: IconfigAction = {
  action: 'Evento',
  type: 'EVENT',
  isProgram: false,
};
export const configProgram: IconfigAction = {
  action: 'Programa',
  type: 'PROGRAM',
  isProgram: false,
};
export let configResolveFactory = (activateRoute: ActivatedRoute) => {
  let config = configEvent;
  if (activateRoute.snapshot.data.type === 'program') {
    config = configProgram;
  }
  return config;
};

export const configResolverFactoryWithParams = (
  activatedRoute: ActivatedRoute
): Observable<IconfigAction> => {
  const valueteConfig = (type) => {
    const isEvent = type === 'event';
    return isEvent ? configEvent : configProgram;
  };
  return activatedRoute.params.pipe(pluck('type'), map(valueteConfig));
};
