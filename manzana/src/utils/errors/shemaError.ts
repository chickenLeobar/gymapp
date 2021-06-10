import { ManageCodes } from "./../../config/codes";
import { ApolloError } from "apollo-server-express";
import { isNull } from "lodash";

export class StandarError extends ApolloError {
  constructor(numError?: number, message?: string) {
    let messageRes: string;
    if (numError || isNull(numError)) {
      const error = ManageCodes.searchError(numError);
      messageRes = error.message;
    } else {
      messageRes = message || "";
    }
    super(messageRes, "SCHEMA_ERRROR");
  }
}
