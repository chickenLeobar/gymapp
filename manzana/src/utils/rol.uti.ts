import { ERol } from "./../enums/Auth.enums";
import { Service } from "typedi";

@Service()
export class RolService {
  isRol(rol: ERol, roles?: ERol[]) {
    if (!roles) {
      return false;
    }
    return roles.some((el) => el == rol);
  }
}
