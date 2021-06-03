import { UserService } from './services/user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CtrlusersRoutingModule } from './ctrlusers-routing.module';
import { CtrlusersComponent } from './ctrlusers.component';
import { UsersComponent } from './users/users.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatChipsModule } from '@angular/material/chips';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserModalComponent } from './modals/user-modal/user-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RoleCheckComponent } from './components/role-check/role-check.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { roleModule as RolDirectiveModule } from '@core/directives/rol.directive';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { UsersModalComponent } from './modals/users-modal/users-modal.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { RequestCreditsComponent } from './request-credits/request-credits.component';
import { CreditsreportService } from './services/creditsreport.service';
const zorro = [
  NzCheckboxModule,
  NzTableModule,
  NzTagModule,
  NzTypographyModule,
  NzIconModule,
  NzButtonModule,
  NzGridModule,
  FlexLayoutModule,
  NzDescriptionsModule,
  NzBadgeModule,
  NzSwitchModule,
  NzDividerModule,
  NzSpaceModule,
  NzModalModule,
  NzInputNumberModule,
  NzInputModule,
  NzMessageModule,
  NzFormModule
];

const me = [RolDirectiveModule];

const material = [MatChipsModule, MatDialogModule];

@NgModule({
  declarations: [
    CtrlusersComponent,
    UsersComponent,
    UserModalComponent,
    RoleCheckComponent,
    UsersModalComponent,
    RequestCreditsComponent
  ],
  imports: [
    CommonModule,
    CtrlusersRoutingModule,
    ...zorro,
    ...material,
    ...me,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, CreditsreportService]
})
export class CtrlusersModule {}
