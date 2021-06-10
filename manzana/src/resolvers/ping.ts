import { UtilsJWt } from "./../helpers/JwtUtils";
import { User } from "./../entity/User";
import { EntityManager } from "typeorm";
import { CurrentUser } from "./../decorators/params/currentUser";
import {
  Resolver,
  Query,
  Subscription,
  Args,
  Arg,
  Int,
  Authorized,
} from "type-graphql";
import { IuserToken } from "../models/context";
import { Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { ERol } from "../enums/Auth.enums";
@Resolver()
@Service()
export class PingResolver {
  constructor(@InjectManager() private manager: EntityManager) {}

  @Query((type) => String)
  @Authorized(ERol.ASESOR)
  async ping(@CurrentUser() user: IuserToken) {
    const userBd = await this.manager.findOne(User, { id: user.id });
    if (!userBd) {
      return null;
    }
    const roles = new Set<ERol>(userBd.rol);
    // roles?.add(ERol.ADMIN);
    // const resp = await this.manager.update(User, user.id, {
    //   rol: Array.from(roles),
    // });
    return "hello";
  }

  @Query((type) => String)
  async renewToken(@CurrentUser() user: IuserToken) {
    const userBd = await this.manager.findOne(User, { id: user.id });
    if (!userBd) {
      return null;
    }
    return UtilsJWt.getTokeOfUser(userBd);
  }
  // @Subscription((type) => Boolean, { topics: "Online" })
  // public online(@Arg("id", () => Int) id: number) {
  //   return true;
  // }
}
