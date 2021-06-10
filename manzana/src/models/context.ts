import { User } from "./../entity/User";
import { Request } from "express";
export interface IuserToken extends Partial<User> {
  exp: number;
}
export interface Icontext {
  user?: IuserToken;
  req: Request;
}
