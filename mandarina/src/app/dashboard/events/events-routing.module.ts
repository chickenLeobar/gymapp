import { HandlesesionComponent } from './pages/handlesesion/handlesesion.component';
import { HandleeventComponent } from './pages/handleevent/handleevent.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsComponent } from './events.component';
import { ListeventsComponent } from './pages/listevents/listevents.component';

const routesChildren: Routes = [
  { path: 'event', component: HandleeventComponent },
  {
    path: 'program',
    component: HandleeventComponent,
    data: { type: 'program' },
  },
  { path: 'sesion/:id', component: HandlesesionComponent },
  { path: 'list/:type', component: ListeventsComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'event' },
];

const routes: Routes = [
  { path: '', component: EventsComponent, children: routesChildren },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
