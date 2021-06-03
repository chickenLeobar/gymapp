import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [CheckboxComponent],
  imports: [CommonModule, NzCheckboxModule, FormsModule],
  exports: [CheckboxComponent],
  providers: [],
})
export class CustomCheckboxModule {}
