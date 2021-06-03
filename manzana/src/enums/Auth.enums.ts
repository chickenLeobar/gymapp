import { registerEnumType } from "type-graphql";

export enum ERol {
  ADMIN = "ADMIN",
  ASESOR = "ASESOR",
  USER = "USER",
  CREATOR = "CREATOR",
}

registerEnumType(ERol, {
  name: "Role",
  description: "Determinate rol for user",
});

export enum EProvider {
  FACEBOOK = "facebook",
  GOOGLE = "google",
  EMAIL = "email",
}

registerEnumType(EProvider, {
  name: "Provider",
  description: "describe provider",
});
