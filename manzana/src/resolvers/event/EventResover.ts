import { BootstrapComment } from "./../../modules/comments/entitites/BootrapComment";
import { EventService } from "./../services/Events.service";
import { EventState } from "./../../enums/Event.enums";
import { EntityManager, FindManyOptions } from "typeorm";
import { RolService } from "./../../utils/rol.uti";
import { User } from "./../../entity/User";
import { ERol } from "./../../enums/Auth.enums";
import { MODEEVENT } from "./../../globals/types";
import { SesionResponse } from "./../../types/events/response";
import { InputEvent } from "./../../types/events/Even.input";
import { GraphQLError } from "graphql";
import { createWriteStream, WriteStream } from "fs";
import { UtilFIle } from "./../../helpers/FileUtils";
import { FileResponse } from "./../../types/Response";
import { ManageCodes } from "./../../config/codes";
import { Event } from "./../../entity/events/Event";
import pathModule, { join } from "path";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import sharp from "sharp";
import {
  Mutation,
  Resolver,
  Arg,
  ID,
  Query,
  Int,
  ResolverInterface,
  Authorized,
  FieldResolver,
  Root,
} from "type-graphql";

import { EventResponse } from "../../types/events/response";
import { GraphQLUpload } from "graphql-upload";
import { Upload } from "../user/UserResolver";
import { CurrentUser } from "../../decorators/params/currentUser";
import { Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { In } from "typeorm";
import { isEqual } from "date-fns";
@Resolver((type) => Event)
@Service()
export class EventResolver {
  constructor(
    private rolService: RolService,
    @InjectManager() private manager: EntityManager,
    private eventService: EventService
  ) {}

  @Mutation((type) => EventResponse)
  @Authorized(ERol.ADMIN, ERol.CREATOR)
  async createEvent(@Arg("event") event: InputEvent): Promise<EventResponse> {
    const ev = Event.create(event);
    if (ev.includeComments) {
      const cb = await BootstrapComment.create().save();

      ev.id_comment = cb.id;
    }
    let eventBD: Event = await ev.save();

    eventBD = (await Event.findOne({ id: eventBD.id })) as any;

    return { resp: true, event: eventBD };
  }

  /*=============================================
  =            Edit Event            =
  =============================================*/
  @Mutation((type) => EventResponse)
  @Authorized(ERol.ADMIN, ERol.CREATOR)
  async editEvent(
    @Arg("id", () => Int) idEvent: number,
    @Arg("event") event: InputEvent
  ): Promise<EventResponse> {
    let eventBD = await Event.findOne({ id: idEvent });
    if (!eventBD) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(6)],
      };
    }

    const eventMerge = Event.merge(eventBD, event);

    const res = await Event.createQueryBuilder()
      .update()
      .set(eventMerge)
      .where("id = :id", { id: idEvent })
      .execute();

    if (res.affected && res.affected > 0) {
      return {
        resp: true,
        event: eventMerge,
      };
    }
    return {
      resp: true,
      errors: [ManageCodes.searchError(8)],
    };

    // error  bd send email
  }

  @Mutation(() => FileResponse)
  @Authorized()
  async addCoverEvent(
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Arg("idevent", (type) => Int) id: number
  ): Promise<FileResponse> {
    const eventBd = await Event.findOne({ id });

    if (!eventBd) {
      return { resp: false, errors: [ManageCodes.searchError(7)] };
    }
    UtilFIle.deleteFile(pathModule.resolve(`uploads/${eventBd.eventCover}`));
    const relativePath = `${process.env.DIRECTORYEVENT}/${uuid() + id}.webp`;
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
            await Event.update(id, { eventCover: relativePath });
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
  @Query((type) => Event, { nullable: true })
  @Authorized()
  async event(@Arg("id", (type) => ID) id: number) {
    const eventBd = await Event.findOne({ id });
    return eventBd ? eventBd : null;
  }

  @Query((type) => SesionResponse)
  @Authorized()
  async sesions(
    @Arg("idEvent", (type) => ID) id: number
  ): Promise<SesionResponse> {
    const event = await Event.findOne({ id: id });
    let sesions = await event?.sesions;
    if (!sesions?.length) {
      sesions = [];
    }
    if (event) {
      return {
        resp: true,
        sesions: sesions,
      };
    }
    return {
      resp: false,
      errors: [ManageCodes.searchError(6)],
    };
  }

  @Query((type) => [Event])
  async getEvents(@CurrentUser() user: Promise<User>) {
    const userBd = await user;
    let findOptions = {} as FindManyOptions<Event>;

    findOptions.order = { createEvent: "DESC" };

    findOptions.where = {
      published: In([EventState.PROGRAM, EventState.PUBLIC]),
    };

    const isAdmin = this.rolService.isRol(ERol.ADMIN, userBd.rol);
    const events = await Event.find(findOptions);
    return events.filter((event) => {
      if (event.published == EventState.PUBLIC) {
        return true;
      } else {
        if (isEqual(event.publishedDate, Date.now())) {
          // id ,
          this.eventService.changueStateEvent({
            id: event.id,
          });
          // changue estate -> published
          return true;
        } else {
          return false;
        }
      }
    });
  }
}
