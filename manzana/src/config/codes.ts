import { Ierror } from "../types/Response";
import format from "string-template";
export class ManageCodes {
  static searchError(code: number, values?: { [key: string]: any }): Ierror {
    let res = codes.find((dat) => dat.code == code);
    if (!res) {
      res = codes[-1];
    }
    if (values) {
      res.message = format(res?.message, values);
    }
    return { code: res.code || -2, message: res?.message || "" };
  }
}

export interface Icode {
  code?: number;
  message: string;
  codeRes?: number;
  description?: string;
}

export const codes: Icode[] = [
  {
    code: -1,
    message: "Error no econtrado",
  },
  {
    code: 1,
    message: "Ya esta registrado, Inicie sesión",
  },
  {
    code: 2,
    message: "usuario/contraseña incorrectos",
  },
  {
    code: 3,
    message: "Usted se ha registrado con:",
  },
  {
    code: 4,
    message: "record not found",
  },
  {
    code: 5,
    message:
      "Al parecer no hemos podido guardar tu foto, por favor intentalo nuevamente",
  },
  {
    code: 6,
    message: "El evento no existe",
  },
  {
    code: 7,
    message:
      "No hemos podido guardar tu image , intenta nuevamente si el problema persiste, comuniquese con su asesor",
  },
  {
    code: 8,
    message:
      "Ha ocurrido un error de sistema, por favor intentelo nuevamente si esto persiste, cominiquese con su asesor",
  },
  {
    code: 9,
    message: "Esta sesión no existe",
  },
  {
    code: 10,
    message: "Ya esta afiliado a este evento",
  },
  {
    code: 12,
    message: "No hemos podido eliminar esta sesión",
  },
  {
    code: 13,
    message: "Este recurso no existe",
  },
  {
    code: 14,
    message: "Necesita un codigo de invitación, para ingresar",
  },
  {
    code: 15,
    message: "Token inválido: Esta solicitud ha caducado",
  },
  {
    code: 18,
    message:
      "No dispone de la cantidad de creditos necesaria para pagar se necesitan {difference} creditos más en su cuenta",
  },
  {
    code: 19,
    message: "Se esta realizando la solicitud con usuario que no existe",
  },
];
