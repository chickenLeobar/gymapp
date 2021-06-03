import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  HostBinding,
} from '@angular/core';
import { TypeNotification } from './model.notification';

const icons = new Map<TypeNotification, { icon: string[]; class?: string }>([
  ['REFER', { icon: ['fas', 'fa-user-plus'], class: 'refer' }],
  ['EVENT', { icon: ['fas', 'fa-calendar-week'], class: 'event' }],
  ['NORMAL', { icon: ['fas', 'fa-bullhorn'], class: 'normal' }],
]);

@Directive({
  selector: '[appChangueIcon]',
})
export class ChangueIconDirective implements OnInit {
  @Input()
  appChangueIcon: TypeNotification;

  constructor(private el: ElementRef<HTMLElement>, private render: Renderer2) {}
  ngOnInit(): void {
    const container = this.el.nativeElement;
    const meta = this.getMetadata;
    container.classList.add(meta.class);
    const i = this.render.createElement('i') as HTMLElement;
    i.classList.add(...meta.icon);
    this.render.appendChild(this.el.nativeElement, i);
  }
  private get getMetadata() {
    return icons.get(this.appChangueIcon);
  }
}
