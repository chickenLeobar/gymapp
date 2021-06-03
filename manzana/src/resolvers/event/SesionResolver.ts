import { GraphQLError } from "graphql";
import pathModule from "path";
import { UtilFIle } from "./../../helpers/FileUtils";
import { FileResponse } from "./../../types/Response";
import { SesionResponse } from "./../../types/events/response";
import { InputSesion } from "./../../types/events/Sesion.input";
import { ManageCodes } from "./../../config/codes";
import { Event } from "./../../entity/events/Event";
import { Sesion } from "./../../entity/events/Sesion";
import { Resolver, Arg, Mutation, ID, Query } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { Upload } from "../user/UserResolver";
import { createWriteStream } from "fs";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import { isNull } from "lodash";

@Resolver((type) => Sesion)
export class SesionResolver {
  /**  add sesion */
  @Mutation((type) => SesionResponse)
  async addSesion(
    @Arg("idEvent", (id) => ID) event: number,
    @Arg("sesion") sesion: InputSesion
  ): Promise<SesionResponse> {
    const seBD = Sesion.create(sesion);
    const evBd = await Event.findOne({ id: event });
    if (!evBd) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(6)],
      };
    }
    seBD.event = Promise.resolve(evBd);
    const bdSeson = await seBD.save();

    return {
      resp: true,
      sesion: bdSeson,
      sesions: await evBd.sesions,
    };
  }
  /** delete sesion */

  @Mutation((type) => SesionResponse)
  async deleteSesion(
    @Arg("idSesion", () => ID) idSesion: number
  ): Promise<SesionResponse> {
    const sesionBD = await Sesion.findOne(
      { id: idSesion },
      { relations: ["event"] }
    );
    const result = await Sesion.delete({ id: idSesion });
    if (result.affected && sesionBD) {
      return {
        resp: true,
        sesion: sesionBD,
        sesions: await (await sesionBD.event).sesions,
      };
    }
    return {
      resp: false,
      errors: [ManageCodes.searchError(12)],
    };
  }

  /** update sesion */
  @Mutation((type) => SesionResponse)
  async updateSesion(
    @Arg("idSesion", () => ID) idSesion: number,
    @Arg("sesion") sesion: InputSesion
  ): Promise<SesionResponse> {
    const sesionBD = await Sesion.findOne({ id: idSesion });
    // comprobate id resource

    if (!sesionBD) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(9)],
      };
    }
    if (isNull(sesion.id_resource)) {
      sesion.id_resource = sesionBD?.id_resource;
      console.log("reset sesion");
    }

    const sesionUpdate = Sesion.merge(sesionBD, sesion);

    // update sesion
    const res = await Sesion.createQueryBuilder("sesion")
      .update()
      .set(sesionUpdate)
      .where("id =  :id", { id: idSesion })
      .execute();

    if (res.affected && res.affected > 0) {
      // search Event
      const sesions = await (await sesionBD.event).sesions;
      return {
        resp: true,
        sesion: sesionUpdate,
        sesions: sesions,
      };
    } else {
      return {
        resp: false,
        errors: [ManageCodes.searchError(-1)],
      };
    }
  }
  /**  get sesion */
  @Query((type) => Sesion, { nullable: true })
  async sesion(@Arg("id", (type) => ID) id: number) {
    const sesionBd = await Sesion.findOne({ id });
    return sesionBd || null;
  }
  /** ad cover sesion */
  @Mutation(() => FileResponse)
  async addCoverSesion(
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Arg("idSesion", (type) => ID) id: number
  ): Promise<FileResponse> {
    const sesionBd = await Sesion.findOne({ id });
    if (!sesionBd) {
      return { resp: false, errors: [ManageCodes.searchError(7)] };
    }
    if (sesionBd.sesionCover)
      await UtilFIle.deleteFile(
        pathModule.resolve(`uploads/${sesionBd.sesionCover}`)
      );
    const relativePath = `${process.env.DIRECTORYSESION}/${uuid() + id}.webp`;
    const path = pathModule.resolve("uploads", `${relativePath}`);
    return new Promise(async (resolve, reject) => {
      const transform = sharp()
        .resize({ width: Number(process.env.WIDHTIMAGE) })
        .webp();
      try {
        createReadStream()
          .pipe(transform)
          .pipe(createWriteStream(path))
          .on("finish", async () => {
            await Sesion.update(id, { sesionCover: relativePath });
            return resolve({ resp: true, path: relativePath });
          })
          .on("error", (err) => {
            return reject({
              resp: false,
              errors: [ManageCodes.searchError(7)],
            });
          });
      } catch (error) {
        throw new GraphQLError("stream error");
      }
    });
  }
}
