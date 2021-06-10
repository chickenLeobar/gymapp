import { StandarError } from "./../../../utils/errors/shemaError";
import { RequestCreditView } from "./../views/requestCredit.view";
import { RolService } from "./../../../utils/rol.uti";
import { IuserToken } from "./../../../models/context";
import { RequestCredit } from "./../entities/requestCredit";
import { User } from "./../../../entity/User";
import { ERol } from "./../../../enums/Auth.enums";
import { CreditBootstrap } from "./../entities/credit";
import { HistorialCredit } from "./../entities/historialCredit";
import { CreditService } from "./../services/credit.service";

import { Service } from "typedi";
import { InputRequest } from "./../types/inputRequestCredits";
import {
  Arg,
  Authorized,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import format from "string-template";
import configStore from "../../../config/configstore";
import { InjectManager } from "typeorm-typedi-extensions";
import { EntityManager } from "typeorm";
@Resolver()
@Service()
export class TransactionResolver {
  constructor(
    private creditService: CreditService,
    @InjectManager() private manager: EntityManager,
    private rolService: RolService
  ) {}
  @Mutation((type) => RequestCredit)
  async requesCredits(@Arg("input") request: InputRequest) {
    /**
     * FIXME: aque no deberia ir  siempre 3 como id del respomsable
     */

    const requestCreaated = RequestCredit.create({
      ...request,
      id_responsable: 3,
    });

    const dbRequest = await requestCreaated.save();
    console.log("request create");
    console.log(dbRequest);

    return dbRequest;
  }

  // GET REQUEST CREDITS
  @Query((type) => [RequestCreditView], {
    description: "list all request for attend",
  })
  async getRequestRequestforAttend(
    @Arg("idUser", (type) => Int) idUser: number
  ) {
    const user = await this.manager.findOne(User, { id: idUser });
    if (!user) {
      throw new StandarError(19);
    }
    const isAdmin = this.rolService.isRol(ERol.ADMIN, user?.rol);
    return this.creditService.getRequestRequestforAttend(
      isAdmin ? {} : { idUser: idUser }
    );
  }
  @Query((type) => [RequestCredit])
  @Authorized()
  async getRequestCredits(@Arg("idCredit", (type) => ID) idCredit: string) {
    return this.creditService.getRequestCredits({ idCredit: idCredit });
  }

  @Query((type) => [HistorialCredit])
  async historialCredits(@Arg("idCredit", (type) => ID) idCredit: string) {
    return this.creditService.getHistorialCredit({ idCredit });
  }

  // hadle credits
  @Mutation((type) => Boolean)
  @Authorized(ERol.ADMIN)
  async addReferrealCredits(
    @Arg("idCredit", (type) => ID) idCredit: string,
    @Arg("credits", (type) => Int) credits: number
  ) {
    const creditB = await this.manager.findOne<CreditBootstrap>(
      CreditBootstrap,
      {
        id: idCredit,
      }
    );
    if (!creditB) {
      throw new StandarError(
        undefined,
        "La operación estas siendo solcitada con un credito no valido"
      );
    }

    const affect = await this.manager.update(CreditBootstrap, creditB.id, {
      referrealCredits: credits,
    });

    return true;
  }

  @Mutation((type) => Boolean)
  async addCreditsGroupUsers(
    @Arg("ids", (type) => [Int]) ids: number[],
    @Arg("credits", (type) => Int) credits: number,
    @Arg("reason", (type) => String) reason: string
  ) {
    let creditIds = (await this.manager
      .createQueryBuilder()
      .from(User, "user")
      .select("user.id_credit", "id")
      .where("user.id = Any(:ids)", { ids: ids })
      .getRawMany()) as { id: string }[];
    const promises = creditIds.map(({ id }) => {
      return this.creditService.addHistorialCredit({
        id_credit: id,
        reason: reason,
        credits: credits,
      });
    });
    const resp = await Promise.all(promises);
    return true;
  }

  @Authorized(ERol.ADMIN)
  @Mutation((type) => Int, { description: "return credits new" })
  async addManualCredits(
    @Arg("idCredit", (type) => ID) idCredit: string,
    @Arg("reason", (type) => String) reason: string,
    @Arg("credits", (type) => Int) credits: number
  ) {
    const creditB = await this.manager.findOne<CreditBootstrap>(
      CreditBootstrap,
      {
        id: idCredit,
      }
    );
    if (!creditB) {
      throw new StandarError(
        undefined,
        "La operación estas siendo solcitada con un credito no valido"
      );
    }
    await this.creditService.addHistorialCredit({
      id_credit: idCredit,
      reason: reason,
      credits: credits,
    });
    return creditB.currentCredits + credits;
  }

  //select cr.* , use.id from "credit_bootstrap" as cr inner join "user" as use on  cr.id = use.id_credit;
  // it is equal update request
  @Authorized(ERol.ASESOR)
  @Mutation((type) => Boolean)
  async aproveCredits(
    @Arg("idRequest", () => ID) id: number,
    @Arg("credits", (type) => Int)
    credits: number
  ) {
    let creditsAmount = credits;
    const request = await RequestCredit.findOne({ id });
    if (!request) {
      console.log("not exist request");

      return false;
    }

    if (request.state == "APPROVED") {
      console.log("is approved");

      return true;
    }
    const message = configStore.addParams(
      configStore.get("messages.creditsAdded.message"),
      { credits: creditsAmount }
    );

    const credit = await request?.creditBootstrap;
    console.log("bootstrap");
    console.log(credit);
    console.log(credit.id);

    await this.creditService.addHistorialCredit({
      id_credit: credit.id,
      reason: message,
      credits: creditsAmount,
    });

    await RequestCredit.update(id, {
      credits: creditsAmount,
      state: "APPROVED",
    });
    return true;
  }
}
