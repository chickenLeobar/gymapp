import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListeventsComponent } from './pages/listevents/listevents.component';

import { EventsviewComponent } from './eventsview.component';
import { DisplayeventComponent } from './pages/displayevent/displayevent.component';
import { DisplaySesionComponent } from './pages/display-sesion/display-sesion.component';
const routes: Routes = [
  {
    path: '',
    component: EventsviewComponent,
    children: [
      { path: 'explorer', component: ListeventsComponent },
      {
        path: 'event/:id',
        component: DisplayeventComponent,
      },
      {
        path: 'event/:id/:sesion',
        component: DisplaySesionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsviewRoutingModule {}
