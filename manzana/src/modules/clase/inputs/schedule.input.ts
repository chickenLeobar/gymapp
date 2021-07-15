import { InputType, Field, Int } from "type-graphql";

import { Schedule } from "../entities/Schedule.entity";

@InputType()
export class InputSchedule implements Partial<Schedule> {
  @Field((type) => Date)
  start!: Date;
  @Field((type) => Date)
  end!: Date;

  @Field((type) => Int)
  day!: number;
}
