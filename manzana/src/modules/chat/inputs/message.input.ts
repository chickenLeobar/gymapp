import { Field, InputType, Int } from "type-graphql";
import { Message } from "../entities/message";

@InputType()
export class InputMessage implements Partial<Message> {
  @Field()
  message!: string;

  @Field((type) => Int)
  id_creator!: number;

  @Field()
  id_conversation!: number;
}
