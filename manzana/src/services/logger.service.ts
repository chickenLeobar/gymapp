import { Service } from "typedi";
import pino from "../config/pino";

@Service()
export class Logger {
  public error(msg: string | any, ...args: any[]) {
    pino.error(msg, args);
  }
  public info(msg: string | any, ...args: any[]) {
    pino.info(msg, args);
  }
  public warn(msg: string | any, ...args: any[]) {
    pino.warn(msg, args);
  }
}
