import Redis from "ioredis";
import Logger from "./pino";

export const redis = new Redis();
redis.on("error", (err) => {
  console.error("Reis error");

  Logger.error({ error: err });
});
