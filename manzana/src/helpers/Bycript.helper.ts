import bycript, { hashSync } from "bcrypt";

export class BycriptHelper {
  static async hashPassword(planinText: string): Promise<string> {
    try {
      return await bycript.hash(planinText, Number(process.env.SALTPASSWORD));
    } catch (error) {
      throw new Error("generate hash Error Bycript");
    }
  }
  static async comparePassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    try {
      return await bycript.compare(password, hashPassword);
    } catch (err) {
      //   return false;
      throw new Error(err);
    }
  }
}
