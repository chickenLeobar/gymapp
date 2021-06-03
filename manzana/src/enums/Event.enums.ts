import { registerEnumType } from "type-graphql";

export enum TypeEvent {
  VIRTUAL = "virtual",
  PRESENTIAL = "presencial",
}

export enum EventState {
  DRAFT,
  PUBLIC,
  PROGRAM,
}

registerEnumType(EventState, {
  name: "EventState",
  description: "describe state of event",
});

registerEnumType(TypeEvent, {
  name: "TypeEvent",
  description: "describe type event",
});

export enum StateEvent {
  inProgress = "En curso",
  active = "Activo",
  defeat = "Pasado",
}

registerEnumType(StateEvent, {
  name: "StateEvent",
  description: "State of determined event",
});
