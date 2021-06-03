import { Event } from "./../../entity/events/Event";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseCategory {
  @Field((type) => [Event])
  items!: Event[];

  @Field((type) => Int)
  count!: number;
}
