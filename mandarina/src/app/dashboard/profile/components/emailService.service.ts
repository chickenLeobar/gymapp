import { Router } from '@angular/router';
import { tap, pluck, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
const CONFIRMATION_URL = gql`
  mutation sendConfirmationUrl($email: String!) {
    sendConfirmEmail(email: $email)
  }
`;

const CHANGUE_EMAIL = gql`
  mutation changueEmail($email: String!, $id: Int!) {
    changueEmail(id: $id, email: $email) {
      resp
      token
      errors {
        code
        message
      }
    }
  }
`;

@Injectable()
export class EmailService {
  constructor(private apollo: Apollo, private router: Router) {}
  public sendConfirmationUrl(email: string) {
    return this.apollo
      .mutate({
        mutation: CONFIRMATION_URL,
        variables: {
          email,
        },
      })
      .pipe(tap(console.log));
  }
  public changueEmail(email: string, id: number) {
    const respForToken = (token: string) => {
      console.log(token);

      if (token) {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
        localStorage.setItem('token', token);
        // this.router.navigateByUrl('/dashboard');
        return true;
      }
      return false;
    };
    return this.apollo
      .mutate({
        mutation: CHANGUE_EMAIL,
        variables: {
          id: id,
          email: email,
        },
      })
      .pipe(
        pluck('data', 'changueEmail', 'token'),
        map(respForToken),
        tap(console.log)
      );
  }
}
