import { RolService } from './../../services/rol.service';
import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  UrlTree,
  Route,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private rolService: RolService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const { roles } = route.data;

    if (!roles) {
      return false;
    }
    return this.rolService.checkRoles(roles);
  }

  private processRoles(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const roles = route.data.roles;

    if (!roles) {
      return false;
    }
    return this.rolService.checkRoles(roles);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    console.log('child');
    return this.processRoles(childRoute, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('fa');

    return this.processRoles(route, state);
  }
}
