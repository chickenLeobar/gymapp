import { Isesion } from '@core/models/eventmodels/sesion.model';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cell-component',
  template: `<li *ngFor="let item of currentsesions">
    <span
      >{{ item.nameSesion }} {{ item.startSesion | date: 'shortTime' }}
    </span>
  </li> `,
  styles: [],
})
export class CellComponentComponent implements OnInit {
  constructor() {}
  currentsesions: Isesion[];
  @Input('event')
  public set value(sesions: Isesion[]) {
    this.currentsesions = sesions;
  }
  ngOnInit(): void {}
}
