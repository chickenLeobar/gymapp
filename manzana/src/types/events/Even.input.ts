import { TypeInstance } from "./../../entity/resouces/Resource";
import { MODEEVENT } from "./../../globals/types";
import { EventState } from "./../../enums/Event.enums";
import { Event } from "../../entity/events/Event";
import { InputType, Field, Int } from "type-graphql";
import { GraphQLJSON } from "graphql-scalars";
import { Resource } from "../../entity/resouces/Resource";

/**
 * TODO:
 * separate resource in new File
 */
@InputType()
export class InputResource implements Partial<Resource> {
  @Field({ nullable: true })
  type!: string;

  @Field({ nullable: true })
  bucket!: string;
  @Field()
  key!: string;

  @Field({ nullable: true })
  acces!: string;

  @Field({ nullable: true, defaultValue: "S3" })
  instace!: TypeInstance;
}

@InputType()
export class InputEvent implements Partial<Event> {
  @Field()
  name!: string;

  @Field({ nullable: true })
  id_user!: number;

  @Field((type) => Int, { nullable: true })
  id_resource!: number;

  @Field((type) => GraphQLJSON)
  description!: string;

  @Field((type) => Int, { nullable: true })
  capacityAssistant!: number;

  @Field((type) => Boolean)
  includeVideo!: boolean;

  @Field((type) => Int)
  credits!: number;

  @Field((type) => EventState, {
    nullable: true,
    defaultValue: EventState.DRAFT,
  })
  published!: EventState;

  @Field((type) => Boolean)
  includeComments!: boolean;
  @Field((type) => Date, { nullable: true })
  publishedDate!: Date;

  @Field((type) => String)
  modeEvent!: MODEEVENT;

  @Field((type) => Int)
  category_id!: number;
}
