import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CREATE_PLAN, DELETE_PLAN, GET_PLANS, UPDATE_PLAN } from '../graphql';
import { IPlan } from '../models';
@Injectable()
export class PlanService {
  constructor(private apollo: Apollo) {}
  // create

  public createPlan(plan: Partial<IPlan>) {
    return this.apollo
      .mutate({
        mutation: CREATE_PLAN,
        variables: {
          plan: plan
        }
      })
      .pipe(tap(console.log));
  }

  // update
  public updatePlan(id: number, plan: Partial<IPlan>) {
    return this.apollo
      .mutate({
        mutation: UPDATE_PLAN,
        variables: {
          plan: plan,
          id: id
        }
      })
      .pipe(tap(console.log));
  }
  // delete
  public deletePlan(id: number) {
    return this.apollo
      .mutate({
        mutation: DELETE_PLAN,
        variables: {
          id: id
        }
      })
      .pipe(tap(console.log));
  }
  // get plans

  public getPlans(variables: { id?: number }) {
    return this.apollo
      .query({
        query: GET_PLANS,
        variables
      })
      .pipe(tap(console.log));
  }
}
