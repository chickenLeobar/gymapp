import { Notification } from "./../modules/notifications/notifications.entity";
import { NotificationService } from "./../modules/notifications/notification.service";
import { ManageCodes } from "./../config/codes";
import { AuthResponse } from "../types/Response";
import { EProvider } from "./../enums/Auth.enums";
import { UtilsJWt } from "./../helpers/JwtUtils";
import { getRepository } from "typeorm";
import { User } from "./../entity/User";
import { Repository } from "typeorm";
import { InputUser } from "../types/User";
import { SignInInput } from "../types/User";
import {
  Arg,
  Mutation,
  Publisher,
  Resolver,
  PubSub,
  UseMiddleware,
} from "type-graphql";
import { BycriptHelper } from "../helpers/Bycript.helper";
import { Inject, Service } from "typedi";
import { OAuthService } from "./services/Oauth.service";

@Resolver()
@Service()
export class Oauth {
  constructor(private serviceOauth: OAuthService) {}

  get repository(): Repository<User> {
    return getRepository(User);
  }
  /**
   * TODO:
   *  [ ]  separar este query en otro servicio
   *  [ ] Algoritmo de eliminacion de noticacione
   */
  @Mutation((type) => AuthResponse)
  async signUp(
    @Arg("user") user: InputUser,
    @Arg("provider", (type) => EProvider, { nullable: true })
    provider: EProvider = EProvider.EMAIL
  ): Promise<AuthResponse> {
    if (await this.repository.findOne({ email: user.email })) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(1)],
      };
    }
    if (provider == EProvider.EMAIL)
      user.password = await BycriptHelper.hashPassword(user.password);
    const newUser = this.repository.create(user);
    newUser.provider = provider;
    // add id referreal
    const sponsor = await this.repository.findOne({ code: user.sponsor });
    if (!sponsor) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(14)],
      };
    }
    const useBd = await this.repository.save(newUser);
    await this.serviceOauth.notifyNewReferreal(useBd.name, sponsor.id);
    return {
      resp: true,
      token: UtilsJWt.getTokeOfUser(useBd),
    };
  }

  // this code could improve
  @Mutation((type) => AuthResponse)
  async sigIn(@Arg("user") user: SignInInput): Promise<AuthResponse> {
    const userBd = await this.repository.findOne({ email: user.email });
    /// user not found
    if (!userBd) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(2)],
      };
    }
    const matChProvider = userBd.provider === user.provider;

    if (!matChProvider) {
      let error = ManageCodes.searchError(3);
      return {
        resp: false,
        errors: [{ ...error, message: `${error.message} ${userBd.provider}` }],
      };
    }
    // password not match
    if (user.provider === EProvider.EMAIL) {
      const passworMatch = await BycriptHelper.comparePassword(
        user.password,
        userBd.password
      );
      if (!passworMatch) {
        return {
          resp: false,
          errors: [ManageCodes.searchError(2)],
        };
      }
    }
    /// ok sign in
    return {
      resp: true,
      token: UtilsJWt.getTokeOfUser(userBd),
    };
  }
}
