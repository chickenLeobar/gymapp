import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VimeoService } from './vimeo.service';
@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [VimeoService],
})
export class VimeoModule {}
