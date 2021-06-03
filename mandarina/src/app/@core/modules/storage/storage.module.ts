import { NgModule } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [StorageService],
})
export class StorageModule {}
