import { RequestCredit } from "./../entities/requestCredit";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class InputRequest implements Partial<RequestCredit> {
  @Field((type) => String)
  id_credit!: string;

  @Field((type) => Int)
  credits!: number;

  @Field((type) => String, { nullable: true })
  description!: string;
}
