import { ApolloError } from "apollo-server-express";

export class TokenExpiredError extends ApolloError {
  constructor() {
    super("Token expired", "TOKEN_EXPIRED");
  }
}
