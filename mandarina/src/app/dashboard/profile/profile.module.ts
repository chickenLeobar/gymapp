import { PROFILECONFIG, DEFAULTCONFIGPROFILE } from './config';

import { JwtService } from './../../services/jwt.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileService } from './services/profile.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/*=============================================
=            pipes            =
=============================================*/

import { ImageresolvePipe } from '@core/pipes/imageresolve.pipe';
import { ReferrealsComponent } from './pages/referreals/referreals.component';
import { ProfileComponent as ProfilePageComponent } from './pages/profile/profile.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ChangueEmailComponent } from './components/changue-email.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { HandleCreditsComponent } from './components/handle-credits/handle-credits.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { StateRequestsPipe } from './components/handle-credits/state-requests.pipe';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { roleModule } from '@core/directives/rol.directive';
const zorro = [
  NzTabsModule,
  NzButtonModule,
  NzCardModule,
  NzInputModule,
  NzUploadModule,
  NzIconModule,
  NzDatePickerModule,
  NzTableModule,
  NzCollapseModule,
  NzFormModule,
  NzDescriptionsModule,
  NzModalModule,
  NzInputNumberModule,
  NzTypographyModule
];
const me = [roleModule];
const material = [MatFormFieldModule, MatInputModule];
@NgModule({
  declarations: [
    ProfileComponent,
    ImageresolvePipe,
    ReferrealsComponent,
    ProfilePageComponent,
    ChangueEmailComponent,
    HandleCreditsComponent,
    StateRequestsPipe
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ProfileRoutingModule,
    ...me,
    ...zorro,
    FormsModule,
    ...material,
    NzDividerModule,
    ReactiveFormsModule
  ],
  providers: [
    ProfileService,
    JwtService,
    { provide: PROFILECONFIG, useValue: DEFAULTCONFIGPROFILE }
  ]
})
export class ProfileModule {}
