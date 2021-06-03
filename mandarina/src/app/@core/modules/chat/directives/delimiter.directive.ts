import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
@Directive({
  selector: '[delimiter]'
})
export class DelimiterDirective {
  constructor(private el: ElementRef) {
    fromEvent(el.nativeElement as HTMLInputElement, 'input').subscribe((el) => {
      const char = (el as any).data;
      const value = (el.target as any).value as string;
      if (value.length == 1) {
        if (char == ' ') {
          (el.target as any).value = (el.target as any).value.trim();
        }
      }
    });
  }
}
