import { redis } from "../config/Redis";
import { removePrefix } from "../helpers/helpers";
export class RedisUtls {
  /**
   *
   * @param prefix:
   * retorna todos los valores  ligador a un prefijo
   * Example :
   * online:1
   * online:2
   * res -> [1 , 2] -> Redis
   */
  static getListDataToPrefix(prefix: string): Promise<any[]> {
    let resp: any[] = [];
    return new Promise((resolve, reject) => {
      const stream = redis
        .scanStream({ match: prefix + "*" })
        .on("data", (data) => {
          resp.push(...data);
        })
        .on("end", () => {
          const dataB = resp.map((val) => removePrefix(prefix, val));
          resolve(dataB);
          stream.pause();
        });
    });
  }
}
