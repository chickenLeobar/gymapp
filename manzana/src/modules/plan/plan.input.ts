import { LeSafeAny } from "./../../core/types/anyType";
import { InputType, Field, Int } from "type-graphql";
import { Plan } from "./Plan.entity";

@InputType()
export class InputPlan implements Partial<Plan> {
  @Field()
  name!: string;

  @Field((type) => Int)
  price!: number;

  @Field((type) => Date)
  startDate!: Date;

  @Field((type) => Date)
  endDate!: Date;

  @Field((type) => Int)
  months!: number;

  @Field((type) => String)
  description: LeSafeAny;
}
