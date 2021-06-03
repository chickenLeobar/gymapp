import { ProfileService } from './../dashboard/profile/services/profile.service';
import { IUser } from './../@core/models/User';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(
    private _jwt: JwtHelperService,
    private router: Router,
    private apollo: Apollo
  ) {}
  getUserOfToken(): IUser {
    if (!this.isTokenValid()) {
      this.router.navigateByUrl('/login');
      return null;
    } else {
      return this._jwt.decodeToken<IUser>();
    }
  }
  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return !this._jwt.isTokenExpired();
  }
  async logout() {
    await this.apollo.client.resetStore();
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    this.router.navigateByUrl('/login');
  }
}
