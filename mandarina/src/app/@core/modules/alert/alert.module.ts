import { AlertComponent } from './alert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AlertService } from './alert.service';
@NgModule({
  declarations: [AlertComponent],
  exports: [AlertComponent],
  imports: [NzAlertModule, CommonModule],
  providers: [AlertService],
})
export class AlertModule {}
