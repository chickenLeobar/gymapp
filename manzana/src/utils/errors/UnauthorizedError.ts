import { ERol } from "./../../enums/Auth.enums";
import { ApolloError } from "apollo-server-express";

export class InsufficientRolesError extends ApolloError {
  constructor(roles: ERol[]) {
    super(
      `The following roles are required : ${roles.join("-")}`,
      "INSUFFICIENT_ROLES"
    );
  }
}
