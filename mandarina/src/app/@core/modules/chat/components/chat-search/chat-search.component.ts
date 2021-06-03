import {
  Component,
  forwardRef,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-chat-search',
  template: `
    <div class="chat-card-search">
      <mat-form-field appearance="legacy">
        <mat-label>Buscar</mat-label>
        <input
          [formControl]="input"
          matInput
          autocomplete="off"
          placeholder="Nombre del asesor, fecha "
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChatSearchComponent),
      multi: true
    }
  ]
})
export class ChatSearchComponent implements OnInit, ControlValueAccessor {
  input: FormControl = new FormControl('');
  constructor() {}
  private onChangue: (_: any) => void;
  private onTouched: () => void;

  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    this.onChangue = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {
    this.input.valueChanges.pipe(debounceTime(300)).subscribe((val) => {
      // console.log('changues');
      this.onChangue(val);
    });
  }
}
