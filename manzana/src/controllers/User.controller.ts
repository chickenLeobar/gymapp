import { EProvider } from "./../enums/Auth.enums";
import { User } from "./../entity/User";
import { AbstractRepository, Entity, EntityRepository } from "typeorm";

@EntityRepository(User)
export class UserController extends AbstractRepository<User> {
  constructor() {
    super();
  }
  /**
   * - Email existe ? verifico provider ? verifico contraseña
   * -  Email  no exist e  ?  registro  user  con el provider
   * - Email existe pero el provider no coincide  ? genera un error y le digp que debe ingresar con su provider
   * -  *
   */

  verifyUser(email: string, provider: EProvider) {
    const user = this.repository.findOne({ email, provider });
    if (user) {
      return "REGISTER";
    }
    this.repository.createQueryBuilder("user").where("user.email");
  }
}
