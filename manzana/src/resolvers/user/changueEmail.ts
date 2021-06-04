import { UtilsJWt } from "./../../helpers/JwtUtils";
import { ManageCodes } from "./../../config/codes";
import { AuthResponse } from "./../../types/Response";
import { EmailHandle } from "./../../helpers/nodemailer";
import { Utils } from "./../../helpers/helpers";
import { User } from "./../../entity/User";
import { getRepository } from "typeorm";
import { redis } from "./../../config/Redis";
import { Resolver, Mutation, Arg, Int } from "type-graphql";
import { CONFIRMATION_PREFIX } from "../../globals/prefixconst";
@Resolver()
export class ResolveEmail {
  @Mutation((type) => Boolean, { description: "confirm  email of user" })
  async sendConfirmEmail(@Arg("email") email: string) {
    const user = await getRepository(User).findOne({ email });
    if (!user) {
      return false;
    }
    const url = await Utils.generateConfirmUrl(user.id);
    EmailHandle.sendEmail<{ name: string; link: string }>(user.email, {
      name: "confirm",
      data: { name: user.getCompleteName(), link: url },
    });
    return true;
  }

  /*=============================================
  =            changue email            =
  =============================================*/
  @Mutation((type) => AuthResponse)
  async changueEmail(
    @Arg("id", (type) => Int) id: number,
    @Arg("email") email: string
  ): Promise<AuthResponse> {
    const userbd = await getRepository(User).findOne({ id: id });
    if (!userbd) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(4)],
      };
    }
    // edit user
    const resp = await getRepository(User).update(userbd.id, {
      email: email,
      comfirmed: false,
    });

    if (resp?.affected) {
      // send confirmation email
      const url = await Utils.generateConfirmUrl(userbd.id);
      EmailHandle.sendEmail<{ name: string; link: string }>(userbd.email, {
        name: "confirm",
        data: { name: userbd.getCompleteName(), link: url },
      });
      return {
        resp: true,
        token: UtilsJWt.getTokeOfUser(userbd),
      };
    }
    return {
      resp: false,
      errors: [ManageCodes.searchError(-1)],
    };
  }

  /*=============================================
 =             confirm url            =
 =============================================*/
  @Mutation((type) => AuthResponse)
  async confirmUser(@Arg("token") token: string): Promise<AuthResponse> {
    const id = await redis.get(CONFIRMATION_PREFIX + token);
    if (!id) {
      return {
        resp: false,
      };
    }
    await getRepository(User).update(Number(id), {
      comfirmed: true,
    });
    let user = await getRepository(User).findOne({ id: Number(id) });

    if (!user) {
      return {
        resp: false,
      };
    }
    return {
      resp: true,
      token: UtilsJWt.getTokeOfUser(user),
    };
  }
}
