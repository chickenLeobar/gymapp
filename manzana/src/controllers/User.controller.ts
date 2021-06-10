import { EProvider } from "./../enums/Auth.enums";
import { User } from "./../entity/User";
import { AbstractRepository, Entity, EntityRepository } from "typeorm";

@EntityRepository(User)
export class UserController extends AbstractRepository<User> {
  constructor() {
    super();
  }

  async verifyUser(email: string, provider: EProvider) {
    const user = await this.repository.findOne({ email, provider });
    if (user) {
      return "REGISTER";
    }
    this.repository.createQueryBuilder("user").where("user.email");
  }
}
