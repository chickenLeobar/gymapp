import { getRepository } from "typeorm";
import { ClassType, Field, Int, ObjectType } from "type-graphql";
export default function paginatedResponse<ITem>(TItemClass: ClassType<ITem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginationResponse {
    @Field((type) => [TItemClass])
    items!: ITem[];
    @Field((type) => Int, { nullable: true })
    total!: number;
  }
  return PaginationResponse;
}
