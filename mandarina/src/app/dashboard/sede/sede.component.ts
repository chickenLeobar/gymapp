import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HandleSedeComponent } from './components/handle-sede/handle-sede.component';
import { SedeStoreService } from './services/sede.store';
@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SedeComponent implements OnInit {
  constructor(
    private _modalService: NzModalService,
    private _viewContainerRef: ViewContainerRef,
    private sedeStoreService: SedeStoreService
  ) {}

  ngOnInit(): void {
    // this.openHandleSede();
  }

  public vm$ = this.sedeStoreService.vm$;

  public actionCreate() {
    this.openHandleSede();
  }

  public openHandleSede() {
    this._modalService.create({
      nzContent: HandleSedeComponent,
      nzWidth: '600px',
      nzViewContainerRef: this._viewContainerRef
    });
  }
}
