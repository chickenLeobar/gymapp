import { Comment } from "../entitites/Comment";
import { Field, FieldResolver, InputType, ObjectType } from "type-graphql";

@InputType()
export class InputComment implements Partial<Comment> {
  @Field()
  comment!: string;

  @Field({ nullable: true })
  id_comment!: string;

  @Field()
  id_user!: number;

  @Field({ nullable: true })
  id_bootstrap!: number;
}
