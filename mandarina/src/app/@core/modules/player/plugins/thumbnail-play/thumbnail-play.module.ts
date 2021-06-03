import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
@NgModule({
  declarations: [ThumbnailComponent],
  imports: [CommonModule, NzSpinModule, NzIconModule],
  exports: [ThumbnailComponent],
})
export class ThumbnailPlayModule {}
