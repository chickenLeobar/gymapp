import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media/media.component';
import { PlyrModule } from 'ngx-plyr';
@NgModule({
  declarations: [MediaComponent],
  imports: [CommonModule, PlyrModule]
})
export class PlayerModule {}
