import { ConfigService } from "./../modules/configuration/configService";
import { ERol } from "./../enums/Auth.enums";
import * as fs from "fs";
import path from "path";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import chalk from "chalk";
import { Container } from "typedi";
export class Defaultload {
  static crateDirectories(arr: string[]) {
    arr.forEach((dir) => {
      const resPath = path.resolve(dir);
      if (!fs.existsSync(resPath)) {
        fs.mkdirSync(resPath);
      }
    });
  }

  static fillConfigurations() {
    const configService = Container.get(ConfigService);
    configService.saveAndUpdateConfiguration();
  }

  static async createUserRoot() {
    const users = await getRepository(User).find({});
    if (users.length === 0) {
      const userRoot = getRepository(User).create({
        email: "admin@gmail.com",
        password: "admin",
        name: "root",
        lastName: "root",
      });
      const userRootBD = await getRepository(User).save(userRoot);
      console.log(
        chalk.blue(`User root created with code : ${userRootBD.code}`)
      );
    }
  }
}
