import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, map, filter } from 'rxjs/operators';
@Component({
  selector: 'search-input',
  template: `
    <nz-input-group nzSuffixIcon="search">
      <input nz-input [placeholder]="placeHolder" [formControl]="control" />
    </nz-input-group>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ]
})
@UntilDestroy()
export class SearchInputComponent implements OnInit, ControlValueAccessor {
  private onChange: (value: string) => {};
  private onTouch: () => {};

  public control = new FormControl('');

  @Input() placeHolder: string = '';

  constructor() {}
  writeValue(obj: string): void {
    this.control.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(
        map((d: string) => d.trim()),
        debounceTime(90),
        untilDestroyed(this)
      )
      .subscribe(val => {
        if (this.onChange) {
          this.onChange(val);
        }
      });
  }
}
