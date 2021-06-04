import { UtilsJWt } from "./../../helpers/JwtUtils";
import { BycriptHelper } from "./../../helpers/Bycript.helper";
import { AuthResponse, NormalResponse } from "./../../types/Response";
import { redis } from "./../../config/Redis";
import { User } from "./../../entity/User";
import { ManageCodes } from "./../../config/codes";
import { Arg, Args, Mutation, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { UrlGenerate } from "../../helpers/helpers";
import { EmailHandle } from "../../helpers/nodemailer";
import { FORGOT_PASSWORD } from "../../globals/prefixconst";

@Resolver()
export class PasswordResolver {
  /*=============================================
  =            forgot Paswors            =
  =============================================*/

  @Mutation((type) => NormalResponse)
  async forgotPassword(@Arg("email") email: string): Promise<NormalResponse> {
    const userBd = await getRepository(User).findOne({ email });
    if (!userBd) {
      return {
        resp: false,
      };
    }
    const url = await UrlGenerate.changuePasswordUrl(userBd.id);
    EmailHandle.sendEmail(email, {
      name: "forgot_password",
      data: { link: url },
    });
    return {
      resp: true,
    };
  }

  @Mutation((type) => AuthResponse)
  async changuePassword(
    @Arg("token") token: string,
    @Arg("password") password: string
  ): Promise<AuthResponse> {
    const userID = await redis.get(FORGOT_PASSWORD + token);
    if (!userID) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(15)],
      };
    } else {
      // delete token
      await redis.del(FORGOT_PASSWORD + token);
    }
    const newPassword = await BycriptHelper.hashPassword(password);
    const updateResult = await getRepository(User).update(Number(userID), {
      password: newPassword,
    });

    if (updateResult?.affected && updateResult.affected > 0) {
      const userBd = await getRepository(User).findOne({ id: Number(userID) });
      if (!userBd) {
        return {
          resp: false,
        };
      }
      const token = UtilsJWt.getTokeOfUser(userBd);
      return {
        resp: true,
        token: token,
      };
    }
    return {
      resp: false,
    };
  }
}
