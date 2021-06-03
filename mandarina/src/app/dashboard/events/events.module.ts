import { SesionService } from './services/sesion.service';
import { EventService } from './services/event.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { HandleeventComponent } from './pages/handleevent/handleevent.component';
import { HandlesesionComponent } from './pages/handlesesion/handlesesion.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { DateFnsModule } from 'ngx-date-fns';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ListSesionsComponent } from './pages/components/list-sesions/list-sesions.component';
import { ListeventsComponent } from './pages/listevents/listevents.component';
import { CustomCheckboxModule } from '@core/modules/custom-checkbox/custom-checkbox.module';
import { PlayerModule } from '@core/modules/player/player.module';
import { CloudinaryModule } from '@core/modules/cloudinary/cloudinary.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { MediaModule } from '@delon/abc/media';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { MatIconModule } from '@angular/material/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { LoadingModule } from '@delon/abc/loading';
/*
   Embed video in html : 
   NPM :  https://www.npmjs.com/package/ngx-embed-video

   
/**
 *
 * control space in inputs
 *  documentation : https://ng.ant.design/components/space/en#nz-space
 */
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { StorageModule } from '@core/modules/storage/storage.module';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { TitleModule } from '@core/ui/title/title.module';
const zorro = [
  NzSpaceModule,
  NzSliderModule,
  NzTagModule,
  NzMenuModule,
  NzModalModule,
  NzButtonModule,
  NzUploadModule,
  NzMessageModule,
  NzListModule,
  NzCardModule,
  NzCheckboxModule,
  NzAutocompleteModule,
  NzFormModule,
  NzSwitchModule,
  NzDatePickerModule,
  NzInputModule,
  NzTimePickerModule,
  NzProgressModule,
  NzTableModule,
  NzBadgeModule,
  NzDividerModule,
  NzInputNumberModule,
  MediaModule,
  NzDropDownModule,
  LoadingModule
];

const me = [TitleModule];
const material = [MatIconModule];
@NgModule({
  declarations: [
    EventsComponent,
    HandleeventComponent,
    HandlesesionComponent,
    ListSesionsComponent,
    ListeventsComponent
  ],
  imports: [
    FlexLayoutModule,
    StorageModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    DateFnsModule.forRoot(),
    CommonModule,
    NgxSpinnerModule,
    EventsRoutingModule,
    CustomCheckboxModule,
    PlayerModule.forRoot(),
    CloudinaryModule,
    zorro,
    material,
    me
  ],
  providers: [EventService, SesionService]
})
export class EventsModule {}
