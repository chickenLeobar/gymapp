import { InjectionToken } from '@angular/core';
export interface IOptionsVideoPlayer {
  width?: number | string;
  height?: number | string;
}

export const CONFIG_PLAYER = new InjectionToken<IOptionsVideoPlayer>(
  'configurationplayer'
);

export const defaultConfiguration: IOptionsVideoPlayer = {
  width: 700,
  height: 500,
};
