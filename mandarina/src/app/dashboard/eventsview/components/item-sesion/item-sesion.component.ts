import { UtilsService } from 'src/app/services/utils.service';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-sesion',
  template: `
    <nz-card nzHoverable>
      <div fxLayout fxLayoutGap="15px" class="container_sesion_item">
        <!-- <div class="image" fxFlex="40%">
          <img [src]="sesion.sesionCover" />
        </div> -->
        <div class="detail" fxFlex="60%">
          <h2 class="title font-italic">
            {{ sesion.nameSesion }}
          </h2>
          <span class="text-mute font-italic">
            {{ sesion.createdSesion | date: 'short' }}
          </span>
        </div>
      </div>
    </nz-card>
  `,
  styleUrls: ['./item-sesion.component.scss'],
  host: {
    '(click)': 'clickItem()'
  }
})
export class ItemSesionComponent implements OnInit {
  private source: Isesion;
  @Input('sesion') set sesion(ev: Isesion) {
    ev = {
      ...ev,
      sesionCover: this.utilService.resolveNormalPathImage(ev.sesionCover)
    };
    this.source = ev;
  }
  get sesion() {
    return this.source;
  }

  @Output() readonly selectItem = new EventEmitter<Isesion>();
  constructor(private utilService: UtilsService) {
    // this.sesion.sesionCover;
  }
  ngOnInit(): void {}
  public clickItem() {
    this.selectItem.emit(this.sesion);
  }
}
