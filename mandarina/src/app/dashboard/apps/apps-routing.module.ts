import { CalendarComponent } from './pages/calendar/calendar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsComponent } from './apps.component';

const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    children: [{ path: 'calendar', component: CalendarComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
