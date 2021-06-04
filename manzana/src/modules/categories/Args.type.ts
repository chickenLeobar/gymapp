import { MODEEVENT } from "./../../globals/types";
import { TypeEvent } from "./../../enums/Event.enums";
import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class ArgsCategory {
  @Field((type) => ID)
  idCategory!: number;
  @Field((type) => String, { nullable: true })
  modeEvent!: MODEEVENT;
  @Field((type) => Boolean, { nullable: true })
  recents!: boolean;
}
