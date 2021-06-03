import { Field, ObjectType } from "type-graphql";
import { GraphQLJSON } from "graphql-scalars";
@ObjectType()
export class ConfigResponse {
  @Field()
  path!: string;

  @Field((type) => GraphQLJSON)
  value!: Object;
}
