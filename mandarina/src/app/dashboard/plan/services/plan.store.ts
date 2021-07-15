import { switchMap, tap } from 'rxjs/operators';
import { Observable, iif, defer } from 'rxjs';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { IPlan } from '../models';
import { PlanService } from './plan.service';
interface PlanState {
  plans: IPlan[];
}
@Injectable()
export class PlanStore extends ComponentStore<PlanState> {
  /*=============================================
    =            EFFECTS            =
    =============================================*/

  // get  plans

  public getPlans = this.effect((source: Observable<{ id?: number }>) => {
    return source.pipe(switchMap(par => this._planService.getPlans(par)));
  });

  // create and update operator
  private createAndUpdateOperator = (source: Observable<Partial<IPlan>>) => {
    return source.pipe(
      switchMap(plan =>
        iif(
          () => !plan?.id,
          defer(() => this._planService.createPlan(plan)),
          defer(() => this._planService.updatePlan(plan.id, plan))
        )
      ),
      tap(data => {
        console.log(data);
      })
    );
  };

  // create
  public createPlan = this.effect((source: Observable<Partial<IPlan>>) => {
    return source.pipe(this.createAndUpdateOperator);
  });
  // update
  public updatePlan = this.effect((source: Observable<Partial<IPlan>>) =>
    source.pipe(this.createAndUpdateOperator)
  );

  // delete
  public deletePlan = (source: Observable<{ id: number }>) => {
    return source.pipe(switchMap(({ id }) => this._planService.deletePlan(id)));
  };
  constructor(private _planService: PlanService) {
    super({
      plans: []
    });
  }

  /*=============================================
  =            SELECTORS            =
  =============================================*/

  public plans$ = this.select(state => state.plans);

  /*=============================================
  =            VIEW            =
  =============================================*/
  public vm$ = this.select(this.plans$, plans => {
    return {
      plans
    };
  });
}
