import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatRippleModule } from '@angular/material/core';
@NgModule({
  declarations: [TitleComponent],
  imports: [CommonModule, NzIconModule, MatRippleModule],
  exports: [TitleComponent]
})
export class TitleModule {}
