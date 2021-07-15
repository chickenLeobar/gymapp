import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';
import UI_MODULES from '../ui.modules';
import { LayoutModule } from '../../@theme/layout/layout.module';
import services from './services';
import { SearchInputModule } from '@core/ui/search-input';
import { HandlePlanComponent } from './components/handle-plan/handle-plan.component';
@NgModule({
  declarations: [PlanComponent, HandlePlanComponent],
  imports: [
    CommonModule,
    PlanRoutingModule,
    LayoutModule,
    ...UI_MODULES,
    SearchInputModule
  ],
  providers: [...services]
})
export class PlanModule {}
