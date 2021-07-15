import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedeRoutingModule } from './sede-routing.module';
import { SedeComponent } from './sede.component';
import uiModules from '../ui.modules';
import { HandleSedeComponent } from './components/handle-sede/handle-sede.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchInputModule } from '@core/ui/search-input';
import services from './services';
import { LoadingModule } from '@delon/abc/loading';

@NgModule({
  declarations: [SedeComponent, HandleSedeComponent],
  imports: [
    CommonModule,
    SedeRoutingModule,
    FormlyModule,
    ReactiveFormsModule,
    FormlyNgZorroAntdModule,
    SearchInputModule,
    ...uiModules,
    LoadingModule
  ],
  providers: [...services]
})
export class SedeModule {}
