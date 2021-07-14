import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedeRoutingModule } from './sede-routing.module';
import { SedeComponent } from './sede.component';
import uiModules from '../ui.modules';
import { HandleSedeComponent } from './components/handle-sede/handle-sede.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';
import services from './services';

@NgModule({
  declarations: [SedeComponent, HandleSedeComponent],
  imports: [
    CommonModule,
    SedeRoutingModule,
    FormlyModule,
    ReactiveFormsModule,
    FormlyNgZorroAntdModule,
    ...uiModules
  ],
  providers: [...services]
})
export class SedeModule {}
