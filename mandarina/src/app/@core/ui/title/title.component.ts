import { isValidValue } from '@helpers/helpers';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Location } from '@angular/common';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'le-title',
  template: `
    <h1 class="title" [ngClass]="{ line_addon: lineAddon }">
      <ng-container *ngIf="leBack">
        <button
          class="btn_back p-1 mr-1"
          matRipple
          [matRippleColor]="'rgba(255, 255 , 255, 0.6)'"
          (click)="back()"
        >
          <i
            nz-icon
            *ngIf="!hasIcon; else customIcon"
            nzType="arrow-left"
            nzTheme="outline"
          ></i>
          <ng-template #customIcon>
            <ng-container *ngTemplateOutlet="icon"></ng-container>
          </ng-template>
        </button>
      </ng-container>
      {{ text }}
    </h1>
  `,
  styles: [``]
})
export class TitleComponent implements OnInit {
  @Input() text: string;
  @Input() @InputBoolean() lineAddon: boolean;
  @Input() @InputBoolean() leBack: boolean;
  @Input() icon: TemplateRef<NzSafeAny>;
  @Input() leCustomBackCallback: (...args: NzSafeAny[]) => void;
  constructor(private location: Location) {}
  ngOnInit(): void {}
  get hasIcon() {
    return isValidValue(this.icon);
  }
  back() {
    if (isValidValue(this.leCustomBackCallback)) {
      this.leCustomBackCallback();
    } else {
      this.location.back();
    }
  }
}
