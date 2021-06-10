import { StandarError } from "./../../../utils/errors/shemaError";
import { HistorialCredit } from "./../entities/historialCredit";
import { CreditBootstrap } from "../entities/credit";
import { User } from "../../../entity/User";
import { getRepository } from "typeorm";
import configStore from "../../../config/configstore";
import pino from "../../../config/pino";
export class UtilCredits {
  /**
   *
   * @param email
   * aplica creditos por defecto al usuario
   */
  static async createCreditAndDefaultMounts(
    email: string,
    params: { name: string; lastName: string }
  ) {
    const credit = CreditBootstrap.create();
    const bdCredits = await CreditBootstrap.save(credit);
    const respUpdate = await getRepository(User).update(
      { email },
      { id_credit: bdCredits.id }
    );
    if (respUpdate?.affected) {
      await this.applyTransactions(bdCredits.id, params);
    }
  }
  /**
   *
   *  id parent credit : esto aplica los acciones por defecto a los creditos
   * - Creditos de bienvenida
   * - Creditos por fecha : etc
   * @param idCredit :
   */
  private static async applyTransactions(
    idCredit: string,
    params?: { name: string; lastName: string }
  ) {
    const transactions = configStore.get("defaultCredits.data") as {
      reason: string;
      credits: number;
    }[];
    if (transactions && transactions.length >= 0) {
      const promises = transactions.map(async (el) => {
        const data = HistorialCredit.create({
          reason: configStore.addParams(el.reason, {
            credits: el.credits,
            ...params,
          }),
          credits: el.credits,
          id_credit: idCredit,
        });
        return HistorialCredit.save(data);
      });
      const resp = await Promise.all(promises);
    }
  }
  /**
   *
   * @param historial
   * this method usen for entity bootstrap credit
   * and less or more current credits
   */
  public static async changueCredits(historial: HistorialCredit) {
    try {
      console.log("last method");
      console.log(historial);

      const bdCredit = await CreditBootstrap.findOne({
        id: historial.id_credit,
      });
      if (!bdCredit) {
        throw new StandarError(20);
      }
      const currentCredits = bdCredit.currentCredits;

      await CreditBootstrap.update(bdCredit.id, {
        currentCredits: currentCredits + historial.credits,
      });
    } catch (err) {
      pino.error(
        {
          err: err,
          extra: "runCrediDefault:85",
        },
        "Error creditos"
      );
    }
  }
}
