import { TypeNotification } from "./notifications.entity";
import format from "string-template";
import Container, { Token } from "typedi";
export interface Inotification {
  title: string;
  description: string;
}

const TemplateNotifications = new Map<TypeNotification, Inotification>([
  [
    "REFER",
    {
      title: "¡Nuevo referido!",
      //  library for build templates with strings
      //https://www.npmjs.com/package/string-template
      description: "{name} se ha unido a tu equipo",
    },
  ],
  [
    "EVENT",
    {
      title: "¡Tu sesion emepieza en breve!",
      description: "la sesión {sesion} esta por comenzar",
    },
  ],
]);

export const TEMPLATES_DEFAULT = new Token("defaulnotificationsTemplate");

Container.set(TEMPLATES_DEFAULT, TemplateNotifications);
