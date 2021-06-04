import "reflect-metadata";
import { config } from "dotenv";
config();
import { Defaultload } from "./utils/runDefault";
import { Server } from "./app";
import configStore from "./config/configstore";
import { greet } from "@gymapp/shared";
Server.getInstance;
console.log("greet :", greet);

Defaultload.crateDirectories([
  `uploads/${process.env.DIRECTORYEVENT}`,
  `uploads/${process.env.DIRECTORYSESION}`,
  `uploads/${configStore.get("directories.resource")}`,
]);
