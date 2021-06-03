import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  TemplateRef
} from '@angular/core';
import { InputNumber } from 'ng-zorro-antd/core/util';
@Component({
  selector: 'bagde-action-item',
  template: ` <div class="information__badges_badge" matRipple>
    <span>{{ count }}</span>
    <ng-content></ng-content>
  </div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class BagdeActionItemComponent implements OnInit {
  @Input() @InputNumber(0) count: number;

  @Input() icon: string | TemplateRef<NzSafeAny>;
  constructor() {}

  ngOnInit(): void {}

  get isTemplateRef() {
    return this.icon instanceof TemplateRef;
  }
}
