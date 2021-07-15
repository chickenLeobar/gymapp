import { ISede } from './index';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HandleSedeComponent } from './components/handle-sede/handle-sede.component';
import { SedeStoreService } from './services/sede.store';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SedeComponent implements OnInit {
  control: FormControl = new FormControl('');

  constructor(
    private _modalService: NzModalService,
    private _viewContainerRef: ViewContainerRef,
    private sedeStoreService: SedeStoreService
  ) {}

  ngOnInit(): void {
    this.control.valueChanges.subscribe(d => {
      this.sedeStoreService.passFilters({
        query: d
      });
    });
  }

  public vm$ = this.sedeStoreService.vm$;

  public actionCreate() {
    this.openHandleSede();
  }

  public actionEdit(sede: ISede) {
    this.sedeStoreService.addSelectSede(sede);
    this.openHandleSede();
  }

  public actionDelete(sede: ISede) {
    this._modalService.confirm({
      nzContent: '¿Desea eliminar esta sede?',
      nzTitle: 'Advertencia',
      nzOnOk: () => {
        this.sedeStoreService.deleteSede(sede);
      }
    });
  }

  public openHandleSede() {
    this._modalService.create({
      nzContent: HandleSedeComponent,
      nzWidth: '600px',
      nzViewContainerRef: this._viewContainerRef
    });
  }
}
