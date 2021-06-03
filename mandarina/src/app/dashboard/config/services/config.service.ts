import { tap, pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Iconfig } from '@core/models/config.model';
import { gql, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
const GET_CONFIG = gql`
  query($path: String!) {
    getConfiguration(path: $path) {
      path
      value
    }
  }
`;

const UPDATE_CONFIG = gql`
  mutation($value: JSON!, $path: String!) {
    updateConfiguration(path: $path, value: $value) {
      path
      value
    }
  }
`;

@Injectable()
export class ConfigService {
  constructor(private apollo: Apollo) {}

  public getConfig(variables: { path: string }) {
    return this.apollo
      .query({ query: GET_CONFIG, variables: variables })
      .pipe(pluck('data', 'getConfiguration')) as Observable<Iconfig>;
  }

  public setConfig(variables: { path: string; value: NzSafeAny }) {
    return this.apollo
      .mutate({ mutation: UPDATE_CONFIG, variables: variables })
      .pipe(tap((el) => console.log(el)));
  }
}
