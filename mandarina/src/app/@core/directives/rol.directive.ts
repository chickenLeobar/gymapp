import { ERol, RolService } from '../../services/rol.service';
import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
@Directive({
  selector: '[visibleRole]'
})
export class VisibleDirectiveRol implements OnInit, OnChanges {
  private _roles: ERol[];

  @Input('visibleRole') set roles(v: ERol[]) {
    this._roles = coerceArray(v);
  }

  get roles() {
    return this._roles;
  }

  _templateRef: TemplateRef<any>;
  constructor(
    private rolService: RolService,
    private vieRef: ViewContainerRef,
    private templateRef: TemplateRef<NzSafeAny>
  ) {
    this._templateRef = this.templateRef;
  }
  ngOnChanges(changes: SimpleChanges): void {}
  private async recreateView() {
    const resp = await this.rolService.checkRoles(this.roles);
    this.vieRef.clear();
    if (resp) {
      this.vieRef.createEmbeddedView(this._templateRef);
    }
  }
  ngOnInit() {
    this.recreateView();
  }
}

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [VisibleDirectiveRol],
  exports: [VisibleDirectiveRol],
  providers: []
})
export class roleModule {}
