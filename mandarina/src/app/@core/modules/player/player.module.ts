import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  defaultConfiguration,
  CONFIG_PLAYER,
  IOptionsVideoPlayer
} from './model';
import _ from 'lodash';
/**
 *
 *  dependecien player video
 *   documentation  : https://videogular.github.io/ngx-videogular/docs/modules/core/
 *
 */
import { VideoplayerComponent } from './components/videoplayer.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { ThumbnailPlayModule } from './plugins/thumbnail-play/thumbnail-play.module';
import { ResolveUrlPipeModule } from '@core/pipes/resolve-url.pipe';
@NgModule({
  declarations: [VideoplayerComponent],
  imports: [
    CommonModule,
    VgControlsModule,
    VgCoreModule,
    ThumbnailPlayModule,
    ResolveUrlPipeModule
  ],
  exports: [VideoplayerComponent]
})
export class PlayerModule {
  static forRoot(
    @Optional() configPlayer?: IOptionsVideoPlayer
  ): ModuleWithProviders<PlayerModule> {
    let configuration = {} as IOptionsVideoPlayer;
    if (configPlayer) {
      configuration = _.merge(defaultConfiguration, configPlayer);
    } else {
      configuration = defaultConfiguration;
    }
    return {
      ngModule: PlayerModule,
      providers: [
        {
          provide: CONFIG_PLAYER,
          useValue: configuration
        }
      ]
    };
  }
}
