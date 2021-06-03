import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  forwardRef,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { CheckBoxInterface } from './mode';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 *
 *  build module using value accesor:
 * article : https://www.tsmean.com/articles/angular/angular-control-value-accessor-example/
 *
 */

@Component({
  selector: 'app-checkbox',
  template: `
    <nz-checkbox-group
      [nzDisabled]="disabled"
      [(ngModel)]="items"
      name="items"
      (ngModelChange)="changueCheckbox($event)"
    ></nz-checkbox-group>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/** este componente le da una funcion más a los checkbox de la libreria ng desing ant
 *
 * entrega el resultado de un solo checkbox
 */
export class CheckboxComponent
  implements OnInit, ControlValueAccessor, AfterViewInit {
  items: CheckBoxInterface[];
  disabled: boolean = false;
  private currentItem: CheckBoxInterface;
  private onChangue: (_: any) => void;
  private onTouched: () => void;
  constructor(private changueDetection: ChangeDetectorRef) {}
  ngAfterViewInit(): void {}
  writeValue(obj: any): void {
    this.items = obj;
    /** marca que este componente vuelva a ser renderizado:
     * documentation : https://angular.io/api/core/ChangeDetectorRef#markForCheck
     *
     */
    this.changueDetection.markForCheck();
    if (this.onChangue) {
      this.onChangue(this.items.find(({ checked }) => checked).value);
    }
  }
  registerOnChange(fn: any): void {
    this.onChangue = fn;
  }
  changueCheckbox(items: CheckBoxInterface[]) {
    const result = this.publishedChangue(items);
    if (result) {
      this.onChangue(result.value);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    // this.publishedChangue(this.items);
  }
  public publishedChangue(arr: CheckBoxInterface[]) {
    this.onTouched();
    const val = arr.find(
      (item) =>
        item.checked && item.checked === true && this.currentItem !== item
    );
    this.currentItem = val;

    if (!val) return;
    this.items = this.items.map((ite) => {
      ite.checked = ite.value === val.value ? true : false;
      return ite;
    });
    return val;
  }
}
