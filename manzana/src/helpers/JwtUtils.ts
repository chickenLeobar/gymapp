import { User } from "./../entity/User";
import jwt, { DecodeOptions, SignOptions } from "jsonwebtoken";
import _ from "lodash";
export class UtilsJWt {
  static getTokeOfUser(user: User): string {
    try {
      const newUser = _.omit(user, ["password"]);
      const token = jwt.sign(newUser, process.env.SECRETTOKEN || "", {
        expiresIn: "2d",
      } as SignOptions);
      return token;
    } catch (error) {
      throw Error("erro in generateToken" + error);
    }
    //    return Token;
  }
  static getUserToke(token: string): User {
    try {
      const data = jwt.verify(token, process.env.SECRETTOKEN || "");
      return data as User;
    } catch (error) {
      throw Error(error);
    }
  }
}
