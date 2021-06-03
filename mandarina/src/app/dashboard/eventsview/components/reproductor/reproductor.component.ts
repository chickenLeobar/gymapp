import { checkBreakPoint } from './../../../../@core/breakPointCheck/checkBreakPoint';
import { isValidValue } from './../../../../helpers/helpers';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { ZoneOutside } from '@delon/util';
import { PlyrMediaSource } from '@delon/abc/media';
import {
  BreakPointCheck,
  EBreakpoints
} from '@core/breakPointCheck/public-api';
import { PlyrComponent } from 'ngx-plyr';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'le-reproductor',
  template: `
    <plyr
      #player
      *ngIf="hasResource"
      [plyrPlaysInline]="true"
      class="player"
      [plyrPoster]="poster"
      [plyrSources]="[{ src: video, type: 'video/mp4' }]"
    ></plyr>
  `,
  styleUrls: [`./reproductor.scss`],
  host: {},
  changeDetection: ChangeDetectionStrategy.OnPush
})
@BreakPointCheck({ nameObserver: 'mediaObserver' })
export class ReproductorComponent implements OnInit {
  @Input() video: string;
  @Input() poster: string;
  _type: string;

  @ViewChild('player') player: PlyrComponent;
  @Input() set type(v: string) {
    if (v) {
      this._type = v;
    } else {
      this._type = 'video/mp4';
    }
  }
  get hasResource() {
    console.log(isValidValue(this.video));
    return isValidValue(this.video);
  }

  @HostBinding('style')
  stylesForContainer: CSSStyleDeclaration = {
    display: 'block',
    width: '100% !important'
  } as CSSStyleDeclaration;

  source: PlyrMediaSource[] = [];
  constructor(
    private mediaObserver: MediaObserver,
    private changueDetection: ChangeDetectorRef
  ) {}
  ngOnInit(): void {}
  ready() {}

  @ZoneOutside()
  runOutSide() {
    this.player.player.on('enterfullscreen', (plr) => {
      // console.log(plr);
      // console.log('enter full screen');
      // console.log(plr.target);
      // (plr.target as HTMLElement).style.transform = 'rotate(90deg)';
    });
  }

  @checkBreakPoint(EBreakpoints.xs)
  mobileBreakPoint() {
    // this.styleBuilder.applyStyleToElement(
    //   container,
    //   this.stylesForPlayer as NzSafeAny
    // );
    this.runOutSide();
    // console.log(this.player.player.play());
  }
}
