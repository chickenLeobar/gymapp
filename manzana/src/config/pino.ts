import pino from "pino";
import { isDev } from "../globals/constants";
import path from "path";

const logger = pino(
  {
    level: isDev ? "info" : "debug",
    nestedKey: "payload",
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    customLevels: { foo: 35 },
  },
  pino.destination({ dest: path.resolve("logs/logs.log") })
);

export default logger;
