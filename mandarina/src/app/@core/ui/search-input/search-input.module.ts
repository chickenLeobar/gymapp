import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
const COMPONENTS = [SearchInputComponent];
@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, NzInputModule, NzFormModule, ReactiveFormsModule],
  exports: COMPONENTS,
  providers: []
})
export class SearchInputModule {}
