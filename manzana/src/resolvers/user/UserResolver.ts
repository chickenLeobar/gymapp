import { StandarError } from "./../../utils/errors/shemaError";
import { ERol } from "./../../enums/Auth.enums";
import { UserViewCtrl } from "../../modules/usersReport/views/userView";
import { Logger } from "../../services/logger.service";
import { MODEEVENT } from "../../globals/types";
import { UtilFIle } from "../../helpers/FileUtils";
import { FileResponse } from "../../types/Response";
import { ManageCodes } from "../../config/codes";
import { InputEditUser } from "../../types/User";
import pathModule, { join } from "path";
import { InputUser } from "../../types/User";
import { User } from "../../entity/User";
import { v4 as uuid } from "uuid";
import path from "path";
import sharp from "sharp";
import {
  Arg,
  ID,
  Mutation,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Query,
  Root,
  Int,
  Authorized,
} from "type-graphql";
import { getRepository, Repository, Not, Raw, EntityManager } from "typeorm";
import { GraphQLUpload } from "graphql-upload";
// import moduleName from 'gr'
import { createWriteStream } from "fs";
import { Stream } from "stream";
export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

import { UserResponse } from "../../types/Response";
import { GraphQLError } from "graphql";
import { Service } from "typedi";
import { InjectManager, InjectRepository } from "typeorm-typedi-extensions";
@Resolver((type) => User)
@Service()
export class UserResolver implements ResolverInterface<User> {
  get getRepo(): Repository<User> {
    return getRepository(User);
  }
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private logger: Logger,
    @InjectManager() private manager: EntityManager
  ) {}
  /*=============================================
  =            get user           =
  =============================================*/

  @Query((type) => UserResponse)
  async getUser(@Arg("id", (type) => ID) id: number): Promise<UserResponse> {
    const user = await this.getRepo.findOne({ id: id });
    if (!user) {
      throw new StandarError(undefined, "Usuario no encontrado");
    }
    return { resp: true, user: user };
  }

  // @Mutation((type) => User, { nullable: true })
  // async createUser(@Arg("user") user: InputUser) {
  //   const newUser = this.getRepo.create(user);
  //   const sponsor = await this.getRepo.findOne({ code: user.sponsor });
  //   if (!sponsor) {
  //     return null;
  //   }
  //   const bdUser = await this.getRepo.save(newUser);
  //   return bdUser;
  // }

  @Mutation((type) => UserResponse)
  async editUser(
    @Arg("user") user: InputEditUser,
    @Arg("id", (type) => ID) id: number
  ): Promise<UserResponse> {
    const userbd = await this.getRepo.findOne({ id });

    if (!userbd) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(4)],
      };
    }

    const userUpdate = this.getRepo.merge(userbd, user);

    try {
      const resp = await this.getRepo.update(id, user);
      this.logger.info("Usuario editado", { newUser: userUpdate });
      return {
        resp: true,
        user: userUpdate,
      };
    } catch (error) {
      throw new GraphQLError("Update user error");
    }
  }
  /*=============================================
   =            upload image for profile user            =
   =============================================*/
  @Mutation(() => FileResponse)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Arg("id", (type) => Int) id: number
  ): Promise<FileResponse> {
    const userBd = await this.getRepo.findOne({ id });
    if (!userBd) {
      return { resp: false, errors: [ManageCodes.searchError(5)] };
    }
    UtilFIle.deleteFile(pathModule.resolve(`uploads/${userBd.image}`));

    const relativePath = `profiles/${uuid() + id}.webp`;
    const path = pathModule.resolve("uploads", `${relativePath}`);
    return new Promise(async (resolve, reject) => {
      const transform = sharp().resize({ width: 800 }).webp();
      try {
        createReadStream()
          .pipe(transform)
          .pipe(createWriteStream(path))
          .on("finish", async () => {
            await this.getRepo.update(id, { image: relativePath });
            return resolve({ resp: true, path: relativePath });
          })
          .on("error", (err) => {
            return reject({
              resp: false,
              errors: [ManageCodes.searchError(5)],
            });
          });
      } catch (error) {
        throw new GraphQLError("stream error");
      }
    });
  }

  /*=============================================
  =            delete password            =
  =============================================*/
  @FieldResolver((type) => String)
  password(): string {
    return "";
  }

  @FieldResolver((type) => String, { nullable: true })
  image(@Root() user: User) {
    return user.image !== null &&
      UtilFIle.existFile(path.resolve("uploads/" + user.image))
      ? user.image
      : null;
  }

  /*=============================================
=            referreals            =
=============================================*/

  @FieldResolver()
  async referreals(@Root() user: User): Promise<User[]> {
    const respdb = await this.getRepo.find({
      where: {
        sponsor: Raw((alias) => `${alias} is not null AND ${alias} = :id`, {
          id: user.code,
        }),
      },
      order: { create: "DESC" },
    });
    return respdb;
  }

  /*=============================================
  =            Field Resolvers            =
  =============================================*/
  @FieldResolver()
  async eventsCreated(
    @Root() user: User,
    @Arg("mode", (type) => String, { nullable: true }) mode: MODEEVENT = "EVENT"
  ) {
    return (await user.eventsCreated).filter(
      ({ modeEvent }) => modeEvent == mode
    );
  }
}
