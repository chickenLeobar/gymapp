import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { CREATE_SEDE, DELETE_SEDE, UPDATE_SEDE, GET_SEDES } from '../graphql';
import { ISede } from '../';
import { tap, pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class SedeService {
  constructor(private apollo: Apollo) {}
  // create
  public createSede(sede: Partial<ISede>) {
    console.log('pass create');

    return this.apollo
      .mutate({
        mutation: CREATE_SEDE,
        variables: {
          sede: sede
        }
      })
      .pipe(pluck('data', 'createSede'));
  }

  // delete
  public deleteSede(id: number) {
    return this.apollo
      .mutate({
        mutation: DELETE_SEDE,
        variables: {
          id: id
        }
      })
      .pipe(pluck('data', 'deleteSede')) as Observable<ISede>;
  }
  // update

  public updateSede(id: number, sede: Partial<ISede>) {
    delete sede.id;
    delete sede['__typename'];
    return this.apollo
      .mutate({
        mutation: UPDATE_SEDE,
        variables: {
          id: id,
          sede: sede
        }
      })
      .pipe(pluck('data', 'updateSede'));
  }

  // get sedes

  public getSedes(variables: { id?: number }) {
    return this.apollo
      .query({
        query: GET_SEDES,
        variables: variables
      })
      .pipe(pluck('data', 'sedes'));
  }
}
