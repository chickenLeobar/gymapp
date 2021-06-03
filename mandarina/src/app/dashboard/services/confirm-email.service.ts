import { tap, pluck, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { Apollo } from 'apollo-angular';
const CONFIRM_USER = gql`
  mutation confirmUser($token: String!) {
    confirmUser(token: $token) {
      resp
      errors {
        code
        message
      }
      token
    }
  }
`;

@Injectable()
export class ConfirmEmailService {
  constructor(private apollo: Apollo) {}
  public confirmUser(token: string) {
    const respForToken = (token: string) => {
      if (token) {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
        localStorage.setItem('token', token);
        return true;
      }
      return false;
    };
    return this.apollo
      .mutate({ mutation: CONFIRM_USER, variables: { token } })
      .pipe(pluck('data', 'confirmUser', 'token'), map(respForToken));
  }
}
