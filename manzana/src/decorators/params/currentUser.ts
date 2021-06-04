import { TokenExpiredError } from "./../../utils/errors/TokenExpired";
import { User } from "./../../entity/User";
import { Icontext } from "./../../models/context";
import { createParamDecorator } from "type-graphql";
import { getRepository } from "typeorm";
const { DISABLE_AUTH } = process.env;
export const CurrentUser = () => {
  return createParamDecorator<Icontext>(({ context }) => {
    const userRespsitory = getRepository(User);
    if (DISABLE_AUTH == "true") {
      return userRespsitory.findOne({ id: 5 });
    }
    if (!context.user) {
      throw new TokenExpiredError();
    }
    return userRespsitory.findOne({ id: context.user.id });
  });
};
