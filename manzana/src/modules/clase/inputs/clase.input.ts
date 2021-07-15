import { Field, Int, InputType } from "type-graphql";
import { Clase } from "../entities/clase.entity";
import { Schedule } from "../entities/Schedule.entity";
import { InputSchedule } from "./schedule.input";
@InputType()
export class InputClase implements Partial<Clase> {
  @Field()
  name!: string;

  @Field()
  avalaible!: boolean;

  @Field()
  description!: string;

  @Field({ nullable: true })
  image!: string;

  @Field((type) => Int)
  participants!: number;

  @Field((type) => [InputSchedule])
  schedules!: InputSchedule[];
}
