import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ElementRef, OnInit } from '@angular/core';
/**
 * INFORMATION TO TAKE INTO ACCOUNT
 * https://netbasal.com/beam-me-up-scotty-on-teleporting-templates-in-angular-a924f1a7798
 * https://stackblitz.com/angular/dgopggjpnld?file=src%2Fapp%2Fad-banner.component.ts
 * https://angular.io/api/core/ComponentFactoryResolver
 * https://angular.io/api/core/ViewContainerRef#createComponent
 */
import {
  NgModule,
  Input,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  AfterViewInit,
  ComponentFactoryResolver,
  HostBinding
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Directive } from '@angular/core';

import { Component, NgZone } from '@angular/core';
import _ from 'lodash';
// types
export type IOptionViewMore = {
  sizeCLose: number | string;
  sizeShow: number | string;
};

@Component({
  selector: 'view-more',
  template: `
    <div class="content">
      <ng-template #view></ng-template>
    </div>
    <div class="overlay"></div>
    <a class="view_btn" (click)="viewMore()"> {{ text }} </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./viewmore.component.scss']
})
export class ViewMoreComponent implements OnInit, AfterViewInit {
  @Input() public tpl: TemplateRef<any>;

  text = 'Ver más';
  textLess = 'Ver menos';
  public open = false;
  /**
   * SE INTRODCUE STATIC TRUE PARA PODER CREAR VISTAS DINAMICAS SOBRE LA MACHA
   * ASI SE PODRA OBTENER EL TEMPLATE REF EN NG ONINIT
   */

  public config: IOptionViewMore = { sizeCLose: 100, sizeShow: 150 };
  cloneOriginalElement: HTMLElement;
  originalElement: HTMLElement;
  @ViewChild('view', { static: true, read: ViewContainerRef })
  vc: ViewContainerRef;
  @HostBinding('style.--size') size: string = '50px';
  @HostBinding('style.--color') color: string = 'black';
  @HostBinding('style.--overlay') overlay: 'none' | 'block' = 'block';

  constructor(private el: ElementRef) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.vc.createEmbeddedView(this.tpl);
    this.originalElement = this.el.nativeElement as HTMLElement;
    this.size = this.getSizeVariable(this.config.sizeCLose);
  }
  viewMore() {
    this.open = !this.open;
    if (this.open) {
      this.text = 'Ver Menos';
    } else {
      this.text = 'Ver más';
    }
    this.overlay = this.overlay == 'block' ? 'none' : 'block';
    this.size =
      this.size == this.getSizeVariable(this.config.sizeCLose)
        ? this.getSizeVariable(this.config.sizeShow)
        : this.getSizeVariable(this.config.sizeCLose);
  }

  private getSizeVariable(size: number | string): string {
    let returnSize: string;
    if (_.isNumber(size)) {
      returnSize = size + 'px';
    } else {
      returnSize = size;
    }
    return returnSize;
  }
}

@Directive({
  selector: '[viewMore]'
})
export class ViewMoreDirective implements OnInit {
  @Input() viewMore: IOptionViewMore;
  constructor(
    private el: TemplateRef<any>,
    private viewRef: ViewContainerRef,
    private resolveFactory: ComponentFactoryResolver
  ) {}
  ngOnInit(): void {
    this.createComponent();
  }
  private createComponent() {
    this.viewRef.clear();
    const componentFactory = this.resolveFactory.resolveComponentFactory(
      ViewMoreComponent
    );
    const intanceComponent = this.viewRef.createComponent<ViewMoreComponent>(
      componentFactory
    );
    intanceComponent.instance.tpl = this.el;

    intanceComponent.instance.config = this.viewMore;
  }
}
@NgModule({
  declarations: [ViewMoreDirective],
  imports: [CommonModule],
  exports: [ViewMoreDirective]
})
export class ViewMoreModule {}
