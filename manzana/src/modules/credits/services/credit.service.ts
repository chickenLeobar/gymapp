import { RequestCreditView } from "./../views/requestCredit.view";
import { RequestCredit } from "./../entities/requestCredit";
import { Event } from "./../../../entity/events/Event";
import { User } from "./../../../entity/User";
import { HistorialCredit } from "./../entities/historialCredit";
import { EntityManager, FindManyOptions, Repository } from "typeorm";
import {
  InjectConnection,
  InjectManager,
  InjectRepository,
} from "typeorm-typedi-extensions";
import { Inject, Service } from "typedi";
import { CreditBootstrap } from "../entities/credit";
import { request } from "express";
@Service()
export class CreditService {
  constructor(
    @InjectRepository(CreditBootstrap)
    creditService: Repository<CreditBootstrap>,
    @InjectRepository(HistorialCredit)
    private historialSerice: Repository<HistorialCredit>,
    @InjectManager() private manager: EntityManager,
    @InjectRepository(RequestCredit)
    private requestService: Repository<RequestCredit>
  ) {}
  async addHistorialCredit(
    historial: Pick<HistorialCredit, "reason" | "credits" | "id_credit">
  ): Promise<HistorialCredit> {
    console.log("historial");
    console.log({ historial });

    const historialCreate = this.historialSerice.create(historial);
    return await historialCreate.save();
  }

  async getHistorialCredit({ idCredit }: { idCredit: string }) {
    const historial = await this.historialSerice.find({
      where: {
        id_credit: idCredit,
      },
      order: { emit: "ASC" },
    });
    return historial;
  }
  async getRequestCredits({ idCredit }: { idCredit: string }) {
    const requests = await this.requestService.find({
      where: { id_credit: idCredit },
      order: { created: "ASC" },
    });
    return requests;
  }

  /**
   *  peticiones de creditos que deben ser atendidas
   */
  async getRequestRequestforAttend({ idUser }: { idUser?: number }) {
    let findOption = {} as FindManyOptions<RequestCreditView>;
    if (idUser) {
      findOption.where = { id_responsable: idUser };
    }
    return this.manager.find<RequestCreditView>(RequestCreditView, findOption);
  }

  /**
   *
   * @param idEvent : id del evento
   * @param idUser : id del usuario
   * Esta funcion determina si un usuario dispone de los creditos
   * necesarios para afiliarse a un evento
   * @returns : [creditos del usuario , dispone de los creditos necesarios? , precio del evento en creditos]
   */
  async payEventWithCredits(
    idEvent: number,
    idUser: number
  ): Promise<
    [currentCredits: number, disponibleCredits: boolean, priceEvent: number]
  > {
    const userCredits = await this.manager
      .createQueryBuilder()
      .select("credit.currentCredits", "credits")
      .from(User, "user")
      .innerJoin("user.credit", "credit")
      .where("user.id = :idUser", { idUser: idUser })
      .getRawOne();

    const valueCreditsEvent = await this.manager
      .createQueryBuilder()
      .from(Event, "event")
      .select("event.credits", "credits")
      .where("event.id  = :idEvent", { idEvent: idEvent })
      .getRawOne();

    const disponibleCredits = valueCreditsEvent.credits <= userCredits.credits;

    return [userCredits.credits, disponibleCredits, valueCreditsEvent.credits];
  }
}
