import { ERol } from "./../../../enums/Auth.enums";
import { Arg, Authorized, ID, Int, Mutation } from "type-graphql";
import { Query } from "type-graphql";
import { UserViewCtrl } from "../views/userView";
import { Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { EntityManager, Equal, Not } from "typeorm";
import { User } from "../../../entity/User";
import { Logger } from "../../../services/logger.service";
@Resolver()
@Service()
export class UserViewResolver {
  constructor(
    private logger: Logger,
    @InjectManager() private manager: EntityManager
  ) {}
  @Query((type) => [UserViewCtrl])
  @Authorized(ERol.ADMIN, ERol.ASESOR)
  users(@Arg("idUser", (type) => ID) id: number) {
    /// logic with id
    return this.manager.find<UserViewCtrl>(UserViewCtrl, {
      where: { id: Not(Equal(id)) },
    });
  }

  // suspend account
  @Authorized(ERol.ADMIN)
  @Mutation((type) => Boolean)
  async suspendAccount(
    @Arg("idUser", (type) => ID) idUser: number,
    @Arg("state", (type) => Boolean) state: boolean
  ) {
    const resp = await this.manager.update<User>(User, idUser, {
      suspended: state,
    });
    this.logger.info({
      msg: "Se ha hecho cambios en el estado de una cuenta",
      id: idUser,
      state: state,
    });

    return true;
  }

  //manipulate credits

  // update roles
  @Mutation((type) => [ERol])
  @Authorized(ERol.ADMIN)
  async updateRoles(
    @Arg("idUser", (type) => Int) idUser: number,
    @Arg("roles", (type) => [ERol]) roles: ERol[]
  ) {
    await this.manager.update<User>(User, idUser, { rol: roles });

    return roles;
  }
}
