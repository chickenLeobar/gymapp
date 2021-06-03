import { InjectionToken } from '@angular/core';
import { IconConfig } from 'ng-zorro-antd/core/config';
export interface IconfigAuth {
  widhtInput?: 24;
  test?: string;
  imageForLogin?: string;
  imageForRegister?: string;
  timePrevent?: number;
}
export const CONFIGAUTH = new InjectionToken<IconfigAuth>(
  'config.auth.component'
);
export const IdatConfigAuth: IconfigAuth = {
  test: 'hello',
  imageForLogin: 'assets/img/bg_login.jpg',
  imageForRegister: 'assets/img/imageRegiter.jpg',
  timePrevent: 30
};
