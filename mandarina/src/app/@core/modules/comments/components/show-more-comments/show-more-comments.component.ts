import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import pluralize from 'pluralize';
@Component({
  selector: 'btn-more-comments',
  template: `
    <ng-template #btn>
      <a (click)="moreCommentsClick()">{{ label }}</a>
    </ng-template>
    <nz-divider *ngIf="label != null" [nzText]="btn"></nz-divider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class ShowMoreCommentsComponent implements OnInit {
  _moreComments: number;
  @Input() set moreComments(v: number) {
    this._moreComments = v;
    this.label = this.defaultLabel;
  }
  get moreComments() {
    return this._moreComments;
  }
  @Output() moreCommentsEvent = new EventEmitter<number>();

  isCollpse: boolean = false;
  public label: string;
  constructor() {}

  ngOnInit(): void {}
  moreCommentsClick() {
    if (!this.isCollpse) {
      this.label = 'Ocultar';
      this.isCollpse = true;
      this.moreCommentsEvent.emit(this.moreComments);
    } else {
      this.isCollpse = false;
      this.moreCommentsEvent.emit(-1);
      this.label = this.defaultLabel;
    }
  }

  get defaultLabel() {
    if (this.moreComments == 0) {
      return null;
    }
    return `Mostrar ${pluralize('comentario', this.moreComments, true)} más`;
  }
}
