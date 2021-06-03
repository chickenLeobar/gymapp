import { ChatuiService } from './../../services/chatui.service';
import { Portal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

const positionsBox: { [key: string]: { x: number; y: number } } = {
  desktop: {
    x: -85,
    y: 50
  },
  mobile: {
    x: -40,
    y: 10
  }
};
import {
  BreakPointCheck,
  checkBreakPoint,
  EBreakpoints
} from '@core/breakPointCheck/public-api';
import { MediaObserver } from '@angular/flex-layout';
@Component({
  selector: 'app-float',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss'],
  animations: []
})
@UntilDestroy()
@BreakPointCheck({ nameObserver: 'mediaObserver' })
export class FloatComponent implements OnInit {
  open = false;
  portal: Portal<any>;
  constructor(
    private uiChatService: ChatuiService,
    private mediaObserver: MediaObserver
  ) {}
  @ViewChild('vc', { read: ViewContainerRef, static: false })
  vc: ViewContainerRef;

  positionChat: { x: number; y: number } = positionsBox.desktop;

  public openEvent() {
    this.open = true;
    this.uiChatService.actionAnimation('card:open');
  }
  public closeEvent() {
    this.uiChatService.actionAnimation('card:close');
  }
  openPortal() {
    if (!this.portal) {
      import('../../components/chat-card/chat-card.component').then(
        ({ ChatCardComponent }) => {
          this.portal = new ComponentPortal(ChatCardComponent);
        }
      );
    }
  }
  ngOnInit(): void {
    // build portal
    this.openPortal();
    this.uiChatService.observeOpenChat$
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.open = true;
      });

    this.uiChatService.observeCloseChat$
      .pipe(untilDestroyed(this))
      .subscribe((_) => {
        this.open = false;
      });
  }

  @checkBreakPoint(EBreakpoints.xs)
  runInMobile() {
    this.positionChat = positionsBox.mobile;  }
  @checkBreakPoint(EBreakpoints.gtSm)
  resetChaguesOfMobile() {
    this.positionChat = positionsBox.desktop;
  }
}
