import { redis } from "../config/Redis";
import { v4 as uuid } from "uuid";
import { URL } from "url";
const HOSTFRONTEND = "http://localhost:4200";
import { FORGOT_PASSWORD, CONFIRMATION_PREFIX } from "../globals/prefixconst";
export class Utils {
  static generateCode(id: number, name: string) {
    const cad = name.charAt(0) + name.charAt(name.length - 1);
    return (id + this.getRam + cad + this.getRam).toLocaleLowerCase();
  }
  private static get getRam() {
    return Math.floor(Math.random() * 100 + 9);
  }
  public static async generateConfirmUrl(id: number) {
    const token = uuid();
    await redis.set(
      CONFIRMATION_PREFIX + token,
      String(id),
      "ex",
      60 * 60 * 24
    ); // expiration one day
    const url = new URL(HOSTFRONTEND + "/dashboard");
    url.searchParams.set("confirmation", token);
    return url.toString();
  }
}

export const removePrefix = (prefix: string, value: string) => {
  return value.replace(prefix, "");
};

export class UrlGenerate {
  public static async changuePasswordUrl(id: number) {
    const token = uuid();
    await redis.set(FORGOT_PASSWORD + token, String(id), "ex", 60 * 60 * 24);

    const url = new URL(HOSTFRONTEND + "/forgotpassword");
    url.searchParams.set("forgotpassword", token);
    return url.toString();
  }
}
