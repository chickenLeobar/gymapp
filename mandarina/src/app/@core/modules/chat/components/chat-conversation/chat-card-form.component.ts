import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  forwardRef
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl
} from '@angular/forms';
import { sanitizeValueString } from '@helpers/MediumHelpers';
@Component({
  selector: 'app-chat-card-form',
  template: `
    <div class="chat-card_form">
      <div class="input">
        <textarea
          delimiter
          class="box"
          placeholder="Mensaje.."
          nz-input
          [formControl]="text"
          nzBorderless
          name=""
          (keyup.enter)="sendValue()"
          id=""
        ></textarea>
        <button class="send_button" (click)="sendValue()">
          <i nz-icon nzType="send" nzTheme="outline"></i>
        </button>
      </div>
      <div class="chat-card_form_actions">
        <button>
          <i class="fas fa-image"></i>
        </button>
        <button>
          <i class="far fa-grin-alt"></i>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChatCardFormComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatCardFormComponent implements OnInit, ControlValueAccessor {
  constructor() {}
  text: FormControl = new FormControl('');
  private onChangue: (_: any) => void;
  private onTouched: () => void;
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {
    this.onChangue = fn;
  }
  registerOnTouched(fn: any): void {
    this.registerOnTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
  sendValue() {
    const [resp, value] = sanitizeValueString(this.text.value);
    this.text.setValue('');
    if (resp) {
      this.onChangue(value);
    }
  }
  ngOnInit(): void {}
}
