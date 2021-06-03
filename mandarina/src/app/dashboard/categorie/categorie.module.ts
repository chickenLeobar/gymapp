import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategorieRoutingModule } from './categorie-routing.module';
import { CategorieComponent } from './categorie.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CategorieService } from './categorie.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalEditComponent } from './components/modal-edit/modal-edit.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

const deps = [
  NzDropDownModule,
  NzTabsModule,
  NzFormModule,
  MatDialogModule,
  NzInputModule,
  NzUploadModule,
  NzMessageModule,
  NzModalModule,
  NzTableModule,
  NzButtonModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  NzNotificationModule,
];

@NgModule({
  declarations: [CategorieComponent, ModalEditComponent],
  imports: [
    CommonModule,
    CategorieRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...deps,
  ],
  providers: [CategorieService],
})
export class CategorieModule {}
