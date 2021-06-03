import { Router } from '@angular/router';
import { map, tap, pluck } from 'rxjs/operators';
import { IoauthResponse } from '../../@core/models/reponses/authResponse';
import { IUser } from './../../@core/models/User';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { Observable } from 'rxjs';
const SING_IN = gql`
  mutation signIn($userSignIn: SignInInput!) {
    sigIn(user: $userSignIn) {
      resp
      token
      errors {
        code
        message
      }
    }
  }
`;
const SING_UP = gql`
  mutation signUp($user: InputUser!, $provider: Provider) {
    signUp(user: $user, provider: $provider) {
      resp
      errors {
        message
        code
      }
      token
    }
  }
`;

const CHANGUE_PASSWORD = gql`
  mutation changuePassword($password: String!, $token: String!) {
    changuePassword(password: $password, token: $token) {
      resp
      errors {
        code
        message
      }
      token
    }
  }
`;
const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      resp
      errors {
        code
        message
      }
    }
  }
`;

@Injectable()
export class AuthService {
  constructor(private apollo: Apollo, private router: Router) {}
  public sigIn(
    email: string,
    password: string,
    provider: string = 'email'
  ): Observable<IoauthResponse> {
    return this.apollo
      .mutate({
        mutation: SING_IN,
        variables: {
          userSignIn: { email, password, provider: provider.toUpperCase() },
        },
      })
      .pipe(map((data: any) => data.data.sigIn));
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  public forgotPassword(email: string) {
    return this.apollo
      .mutate({
        mutation: FORGOT_PASSWORD,
        variables: {
          email,
        },
      })
      .pipe(pluck('data', 'forgotPassword'), tap(console.log));
  }
  public signUp(user: IUser, provider = 'email'): Observable<IoauthResponse> {
    return this.apollo
      .mutate({
        mutation: SING_UP,
        variables: {
          user: user,
          provider: provider.toUpperCase(),
        },
      })
      .pipe(map((data: any) => data.data.signUp));
  }
  public changuePassword(password: string, token: string) {
    const respForToken = (token: string) => {
      if (token) {
        if (localStorage.getItem('token')) {
          localStorage.removeItem('token');
        }
        localStorage.setItem('token', token);
        this.router.navigateByUrl('/dashboard');
        return true;
      }
      return false;
    };
    return this.apollo
      .mutate({
        mutation: CHANGUE_PASSWORD,
        variables: {
          password,
          token,
        },
      })
      .pipe(pluck('data', 'changuePassword', 'token'), map(respForToken));
  }
}
