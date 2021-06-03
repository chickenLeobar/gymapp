import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class PaginationParams {
  @Field((type) => Int, { defaultValue: 0, nullable: true })
  skip!: number;

  @Field((type) => Int, { nullable: true })
  take!: number;
}
