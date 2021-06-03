import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { InputCssPixel } from 'ng-zorro-antd/core/util';
@Component({
  selector: 'badge-action',
  templateUrl: './bagdge-action.component.html',
  styleUrls: ['./bagdge-action.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BagdgeActionComponent implements OnInit {
  @Input() @InputCssPixel() widthBox: NzSafeAny = '500px';

  constructor() {}

  ngOnInit(): void {}
}
