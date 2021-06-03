import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
@NgModule({
  declarations: [OverlayComponent],
  imports: [CommonModule, OverlayModule],
  exports: [OverlayComponent]
})
export class OverlayHoverModule {}
