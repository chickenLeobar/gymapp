import { Component, OnInit } from '@angular/core';
import { PlanStore } from './services/plan.store';
import { HandlePlanComponent } from './components/handle-plan/handle-plan.component';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  constructor(
    private _planStore: PlanStore,
    private _nzModalService: NzModalService
  ) {}

  ngOnInit(): void {}

  public vm$ = this._planStore.vm$;

  public openHandlePlan() {
    this._nzModalService.create({
      nzContent: HandlePlanComponent
    });
  }
}
