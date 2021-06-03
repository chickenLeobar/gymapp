import {
  debounceTime,
  filter,
  switchMap,
  startWith,
  share,
  switchMapTo,
  takeUntil,
  tap
} from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit
} from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { fromEvent, Subject } from 'rxjs';
import { gsap } from 'gsap';
import { InputBoolean } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'app-overlay',
  template: `<ng-template
    cdkConnectedOverlay
    [cdkConnectedOverlayOrigin]="origin"
    [cdkConnectedOverlayOpen]="isOpen"
    [cdkConnectedOverlayOffsetX]="position?.x || 0"
    [cdkConnectedOverlayOffsetY]="position?.y || 0"
  >
    <div #parent [class]="classParent">
      <ng-content #content></ng-content>
    </div>
  </ng-template> `,
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() origin: CdkOverlayOrigin;

  @Input()
  @InputBoolean()
  isOpen: boolean = false;

  @ViewChild('parent', { static: false }) dialog: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output()
  $open = new EventEmitter<void>();
  @Output() $close = new EventEmitter<void>();
  private sensibility = 200;
  private $destroy = new Subject<void>();
  @Input() position: { x?: number; y?: number };
  @Input() classParent: string = '';
  @Input() @InputBoolean() fixedOverlay: boolean = false;
  constructor(private changueDetection: ChangeDetectorRef) {}
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
  ngOnInit(): void {
    const originElement = this.origin.elementRef.nativeElement as HTMLElement;
    const $open = fromEvent(originElement, 'mouseenter').pipe(
      filter((_) => this.isOpen == false),
      switchMap((event) => {
        return fromEvent(document, 'mousemove').pipe(
          startWith(event),
          filter((_) => this.isOpen == false),
          debounceTime(this.sensibility),
          filter((el) => {
            return (
              el['target'] == originElement ||
              originElement.contains(el['target'] as HTMLElement)
            );
          })
        );
      }),
      share()
    );
    $open.subscribe((_) => this.channgueState(true));
    const $close = fromEvent(document, 'mousemove').pipe(
      filter((_) => this.isOpen == true && this.fixedOverlay == false),
      debounceTime(this.sensibility + 300),
      filter((event) =>
        this.isOutSideElement(originElement, this.dialog?.nativeElement, event)
      )
    );
    $open.pipe(takeUntil(this.$destroy), switchMapTo($close)).subscribe((_) => {
      this.channgueState(false);
    });
  }

  private dispatchResizeEvent(state: boolean) {
    const timeOut = setTimeout(() => {
      if (window && state) {
        window.dispatchEvent(new Event('resize'));
      }
      clearTimeout(timeOut);
    }, 100);
  }
  private closeAnimation(callback: () => void) {
    const element = this.dialog.nativeElement as HTMLElement;
    const line = gsap.to(element, {
      opacity: 0,
      scale: 0.7,
      onComplete: () => callback()
    });
    line.invalidate().restart();
  }

  private channgueState(state: boolean) {
    // necesary for refresh slides and naviga  tions
    this.dispatchResizeEvent(state);
    if (state == false) {
      this.closeAnimation(() => {
        this.isOpen = false;
      });
    } else {
      this.isOpen = true;
      console.log('clock');

      if (this.dialog) {
        gsap.set(this.dialog.nativeElement, { opacity: 1, scale: 1 });
      }
    }
    this.changueDetection.markForCheck();
    this.isOpen ? this.$open.emit() : this.$close.emit();
  }
  private isOutSideElement(
    elementOrigin: HTMLElement,
    dialog: HTMLElement,
    event: Event
  ) {
    return !(
      elementOrigin.contains(event['target'] as HTMLElement) ||
      dialog?.contains(event['target'] as HTMLElement)
    );
  }
}
