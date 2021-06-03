import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[chatBtnreverse]'
})
export class BtnreverseDirective {
  constructor() {}
  @HostBinding('class.chat-card_button_reverse') btn: boolean = true;
}
