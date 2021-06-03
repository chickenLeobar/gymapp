import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeEventsComponent } from './me-events.component';

const routes: Routes = [{ path: ':type', component: MeEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeEventsRoutingModule {}
