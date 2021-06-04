import { Resource } from "../../entity/resouces/Resource";
import { Sesion } from "./../../entity/events/Sesion";
import { Event } from "./../../entity/events/Event";
import { NormalResponse } from "../Response";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class EventResponse extends NormalResponse {
  @Field({ nullable: true })
  event?: Event;
}
@ObjectType()
export class SesionResponse extends NormalResponse {
  @Field((type) => [Sesion], { nullable: "itemsAndList" })
  sesions?: Sesion[];
  @Field((type) => Sesion, { nullable: true })
  sesion?: Sesion;
}
// Resource Response

@ObjectType()
export class ResourceResponse extends NormalResponse {
  @Field({ nullable: true })
  resource?: Resource;
}

/* Asistant Response */

@ObjectType()
export class DetailEventResponse extends NormalResponse {
  @Field((type) => Date, { nullable: true })
  timeAttend?: Date;
}

@ObjectType()
export class DetailEventAllResponse extends NormalResponse {
  @Field((type) => [Event])
  events?: Event[];
}
