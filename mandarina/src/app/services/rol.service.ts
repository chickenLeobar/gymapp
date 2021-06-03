import { ProfileService } from '../dashboard/profile/services/profile.service';
import { Injectable } from '@angular/core';
export enum ERol {
  ADMIN = 'ADMIN',
  ASESOR = 'ASESOR',
  USER = 'USER',
  CREATOR = 'CREATOR'
}

@Injectable({
  providedIn: 'root'
})
export class RolService {
  constructor(private profileService: ProfileService) {}
  //ckeckerRoles

  async isRol(rol: ERol) {
    const user = await this.profileService.onlyUser();
    const rolesUser = new Set(user.rol);
    return rolesUser.has(rol);
  }

  async isOnlyRol(rol: ERol) {
    const user = await this.profileService.onlyUser();
    return user.rol.every((el) => el == rol);
  }

  async checkRoles(roles: ERol[]) {
    const user = await this.profileService.onlyUser();
    const rolesUser = new Set(user.rol);
    const matchesRol = roles.filter((rol) => rolesUser.has(rol));
    return matchesRol.length > 0;
  }
}
