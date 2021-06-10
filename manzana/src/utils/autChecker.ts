import { InsufficientRolesError } from "./errors/UnauthorizedError";
import { TokenExpiredError } from "./errors/TokenExpired";
import { User } from "./../entity/User";
import { ERol } from "./../enums/Auth.enums";
import { GraphQLError } from "graphql";
import { Icontext } from "./../models/context";
import { AuthChecker } from "type-graphql";
import { getRepository } from "typeorm";
const { DISABLE_AUTH } = process.env;
export const authChecker: AuthChecker<Icontext, ERol> = async (
  { args, root, context },
  roles
) => {
  if (DISABLE_AUTH == "true") {
    return true;
  }

  if (roles.length == 0) {
    roles = [...roles, ERol.USER];
  }

  // user not found
  if (!context?.user) {
    throw new TokenExpiredError();
  }
  const userBd = await getRepository(User).findOne({ id: context.user.id });
  if (!userBd) {
    throw new GraphQLError("User not found");
  }
  const rolesUser = new Set<ERol>(userBd.rol);
  // if adminstrator = all permission
  if (rolesUser.has(ERol.ADMIN)) {
    return true;
  }
  // match roles
  const matchsRoles = roles.filter((rol) => {
    return rolesUser.has(rol);
  });

  if (matchsRoles.length > 0) {
    return true;
  }
  throw new InsufficientRolesError(roles);
};
