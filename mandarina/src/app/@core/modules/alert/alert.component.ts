import { AlertService } from './alert.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <ng-container *ngIf="(alertService.getalerts | async).length > 0">
      <nz-alert
        *ngFor="let alert of alertService.getalerts | async"
        [nzBanner]="alert.isBanner || true"
        [nzType]="alert.type"
        [nzShowIcon]="alert.icon"
        [nzDescription]="alert.description || null"
        [nzMessage]="alert.message"
        [nzCloseable]="alert.closable || false"
      >
     
      </nz-alert>
    </ng-container>
  `,
  styleUrls: ['./alert.componenent.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent implements OnInit {
  viewref: ViewContainerRef;
  constructor(public alertService: AlertService) {}
  ngOnInit(): void {}
}
