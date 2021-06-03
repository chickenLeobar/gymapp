import {
  Component,
  OnInit,
  Input,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  VgApiService,
  VgFullscreenApiService,
  VgControlsHiddenService,
  VgStates,
} from '@videogular/ngx-videogular/core';
/**
 *  this  component its no own
 *  original :https://github.com/videogular/ngx-videogular/tree/master/libs/ngx-videogular/overlay-play/src
 */

@Component({
  selector: 'app-overlay-play',
  encapsulation: ViewEncapsulation.None,
  template: `<div
    class="vg-overlay-play"
    [class.native-fullscreen]="isNativeFullscreen"
    [class.controls-hidden]="areControlsHidden"
  >
    <div
      class="overlay-play-container"
      [class.vg-icon-play_arrow]="getState() !== 'playing'"
    >
      <img [src]="thumbnail" />
      <div class="icon">
        <ng-container *ngIf="loading">
          <ng-template #indicatorloading>
            <i nz-icon [nzType]="'sync'" [nzSpin]="true"></i>
          </ng-template>
          <nz-spin nzSimple [nzIndicator]="indicatorloading"></nz-spin>
        </ng-container>

        <i *ngIf="!loading" class="fas fa-play"></i>
      </div>
    </div>
  </div>`,
  styleUrls: ['./thumbnail.component.scss'],
})
export class ThumbnailComponent implements OnInit, OnDestroy {
  @Input() vgFor: string;
  /** thumnail  preview in pause  */
  @Input() thumbnail: string;
  elem: HTMLElement;
  target: any;
  loading = true;
  isNativeFullscreen = false;
  areControlsHidden = false;
  subscriptions: Subscription[] = [];

  @HostBinding('class.is-buffering') isBuffering = false;
  constructor(
    ref: ElementRef,
    public API: VgApiService,
    public fsAPI: VgFullscreenApiService,
    private controlsHidden: VgControlsHiddenService
  ) {
    this.elem = ref.nativeElement;
  }

  ngOnInit() {
    if (this.API.isPlayerReady) {
      this.onPlayerReady();
    } else {
      this.subscriptions.push(
        this.API.playerReadyEvent.subscribe(() => this.onPlayerReady())
      );
    }
  }

  onPlayerReady() {
    this.target = this.API.getMediaById(this.vgFor);
    this.API.getMediaById(this.vgFor).subscriptions.canPlay.subscribe((el) => {
      this.loading = false;
    });
    this.subscriptions.push(
      this.fsAPI.onChangeFullscreen.subscribe(
        this.onChangeFullscreen.bind(this)
      )
    );
    this.subscriptions.push(
      this.controlsHidden.isHidden.subscribe(this.onHideControls.bind(this))
    );
    this.subscriptions.push(
      this.target.subscriptions.bufferDetected.subscribe((isBuffering) =>
        this.onUpdateBuffer(isBuffering)
      )
    );
  }

  onUpdateBuffer(isBuffering) {
    this.isBuffering = isBuffering;
  }

  onChangeFullscreen(fsState: boolean) {
    if (this.fsAPI.nativeFullscreen) {
      this.isNativeFullscreen = fsState;
    }
  }

  onHideControls(hidden: boolean) {
    this.areControlsHidden = hidden;
  }

  @HostListener('click')
  onClick() {
    const state = this.getState();
    switch (state) {
      case VgStates.VG_PLAYING:
        this.target.pause();
        break;

      case VgStates.VG_PAUSED:
      case VgStates.VG_ENDED:
        this.target.play();
        break;
    }
  }

  getState() {
    let state = VgStates.VG_PAUSED;
    if (this.target) {
      if (this.target.state instanceof Array) {
        for (let i = 0, l = this.target.state.length; i < l; i++) {
          if (this.target.state[i] === VgStates.VG_PLAYING) {
            state = VgStates.VG_PLAYING;
            break;
          }
        }
      } else {
        state = this.target.state;
      }
    }

    return state;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
