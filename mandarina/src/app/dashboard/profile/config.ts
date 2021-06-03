import { InjectionToken } from '@angular/core';

export interface ProfileConfig {
  defaultDescription: string;
}

export const PROFILECONFIG = new InjectionToken<ProfileConfig>(
  'profilecomponent.config'
);

export const DEFAULTCONFIGPROFILE: ProfileConfig = {
  defaultDescription: 'Descripción'
};
