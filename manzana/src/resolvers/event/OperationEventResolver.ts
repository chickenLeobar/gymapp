import { ERol } from "./../../enums/Auth.enums";
import { CreditService } from "./../../modules/credits/services/credit.service";
import { ArgsEvents } from "./../../types/events/event.args";
import { User } from "./../../entity/User";
import { Event } from "./../../entity/events/Event";
import { ManageCodes } from "./../../config/codes";
import {
  DetailEventAllResponse,
  DetailEventResponse,
} from "./../../types/events/response";
import { DetailEvent } from "./../../entity/events/DetailEvent";
import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  Args,
  Authorized,
} from "type-graphql";
import { getConnection, getRepository } from "typeorm";
import { Service } from "typedi";
@Resolver()
@Service()
export class OperationResolverEvent {
  /*=============================================
  =            operations            =
  =============================================*/
  /* asssist event */
  constructor(private creditsService: CreditService) {}

  @Mutation((type) => DetailEventResponse)
  async attendEvent(
    @Arg("idUser", (type) => Int) idUser: number,
    @Arg("idEvent", (type) => Int) idEvent: number
  ): Promise<DetailEventResponse> {
    const [userCredits, disponibleCredits, difference] =
      await this.creditsService.payEventWithCredits(idEvent, idUser);

    if (!disponibleCredits) {
      return {
        resp: false,
        errors: [ManageCodes.searchError(18, { difference: difference })],
      };
    }
    const detailRepository = getRepository(DetailEvent);
    // afilia al usuario a un evento
    const newDetailAttend = detailRepository.create({
      id_event: idEvent,
      id_user: idUser,
    });
    try {
      const respRepository = await detailRepository.save(newDetailAttend);
      if (!respRepository.entryTime) {
        return {
          resp: false,
          errors: [ManageCodes.searchError(10)],
        };
      }
      return {
        resp: true,
        timeAttend: respRepository.entryTime,
      };
    } catch (error) {
      return {
        resp: false,
        errors: [],
      };
    }
  }

  /*=============================================
  =            Get events            =
  =============================================*/

  /*=============================================
  =          Todos los eventos o programas  -> User           =
  =============================================*/

  /**
   *
   * @param param0
   * @returns
   * lista  los eventos de un usuario dado el modo de evento
   */
  @Query((type) => DetailEventAllResponse)
  async getEventsOfUser(
    @Args() { idUser, mode }: ArgsEvents
  ): Promise<DetailEventAllResponse> {
    const reso = (await getRepository(User)
      .createQueryBuilder("user")
      .innerJoin("user.detailEvents", "detail")
      .innerJoin("detail.event", "event")
      .where("user.id = :id and event.modeEvent = :mode", {
        id: idUser,
        mode: mode,
      })
      .select(["event.*"])
      .getRawMany()) as Event[];
    return {
      resp: true,
      events: reso,
    };
  }

  /**
   *
   * @param idUser
   * @param idEvent
   * @returns
   * Pregunta se esta registrado a un evento
   */
  @Query((type) => DetailEventResponse)
  async isRegisterEvent(
    @Arg("idUser", (type) => Int) idUser: number,
    @Arg("idEvent", (type) => Int) idEvent: number
  ): Promise<DetailEventResponse> {
    const detailRepository = getRepository(DetailEvent);
    const response = await detailRepository.findOne({
      id_event: idEvent,
      id_user: idUser,
    });
    if (response) {
      return {
        resp: true,
        timeAttend: response.entryTime,
      };
    }
    return {
      resp: false,
    };
  }
}
