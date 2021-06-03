import { MODEEVENT } from "./../../globals/types";
import { ArgsType, Field, Int } from "type-graphql";

abstract class PaginationArgs {
  @Field((type) => Int, { defaultValue: 0 })
  skip!: number;
  @Field((type) => Int, { defaultValue: 10 })
  take!: number;
}

@ArgsType()
export class ArgsEvents extends PaginationArgs {
  @Field((type) => Int)
  idUser!: number;

  @Field((type) => String)
  mode!: MODEEVENT;
}
