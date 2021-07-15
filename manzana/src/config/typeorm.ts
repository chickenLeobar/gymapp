import { createConnection } from "typeorm";
import path from "path";
import Logger from "./pino";
export async function connect() {
  try {
    await createConnection({
      type: "postgres",
      host: "localhost",
      username: "postgres",
      database: "wellnesspro_BD",
      entities: [
        path.join(__dirname, "../entity/**/*.{ts,js}"),
        path.join(__dirname, "../modules/**/*.{ts,js}"),
        path.join(__dirname, "../controllers/**/*.{ts,js}"),
      ],
      subscribers: [path.join(__dirname, "../suscribers/**/*.{ts,js}")],
      password: "alfk3458",
      schema: "public",
      synchronize: true,
    }).catch((er) => console.log(er));
  } catch (err) {
    Logger.error("Database Error", err);
  }
}
