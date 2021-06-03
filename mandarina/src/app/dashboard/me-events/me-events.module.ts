import { EventsviewModule } from './../eventsview/eventsview.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeEventsRoutingModule } from './me-events-routing.module';
import { MeEventsComponent } from './me-events.component';
import { NgxMasonryModule } from 'ngx-masonry';
@NgModule({
  declarations: [MeEventsComponent],
  imports: [
    CommonModule,
    MeEventsRoutingModule,
    NgxMasonryModule,
    EventsviewModule
  ]
})
export class MeEventsModule {}
