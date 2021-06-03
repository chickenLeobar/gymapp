import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { FormsModule } from '@angular/forms';
import { EventService } from '../events/services/event.service';
import { CellComponentComponent } from './components/cell-component.component';

@NgModule({
  providers: [EventService],
  declarations: [AppsComponent, CalendarComponent, CellComponentComponent],
  imports: [CommonModule, AppsRoutingModule, NzCalendarModule, FormsModule],
})
export class AppsModule {}
