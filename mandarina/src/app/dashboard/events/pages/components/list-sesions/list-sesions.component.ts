import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Isesion } from '@core/models/eventmodels/sesion.model';

import {
  Component,
  OnInit,
  Output,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-list-sesions',
  templateUrl: './list-sesions.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSesionsComponent implements OnInit, OnChanges {
  @Input() sesions: Isesion[];
  @Output() clickSesionEvent = new EventEmitter<number>();
  options = {
    locale: es,
    addSuffix: true
  };
  @Input() callBackDelete: (id: NzSafeAny) => void;
  public titlecard = '';
  constructor(private changueDetection: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sesions']) {
      this.titlecard = `sesiones : ${this.sesions.length}`;
    }
  }

  ngOnInit(): void {}
  selectItem(id: number) {
    this.clickSesionEvent.emit(id);
  }

  deleteSesion(id: number) {
    this.callBackDelete(id);
    this.sesions = this.sesions.filter((s) => s.id !== id);
    this.changueDetection.markForCheck();
  }
}
