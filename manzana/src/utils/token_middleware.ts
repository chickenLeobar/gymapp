import { Request, Response, NextFunction } from "express";
import Logger from "../config/pino";
export const handeErrorExpress = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // receive
  if ((err.name = "UnauthorizedError")) {
    // req.user = { valid: false };
    Logger.info("Petición no autorizada entro al sistema");
  }
  next();
};
