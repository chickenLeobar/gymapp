import { LeSafeAny } from "./../../core/types/anyType";
import { InputType, Field } from "type-graphql";
import { Sede } from "./Sede.entity";

@InputType()
export class SedeInput implements Partial<Sede> {
  @Field()
  name!: string;

  @Field()
  direction!: string;

  @Field()
  description!: string;
}
