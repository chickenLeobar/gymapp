import { User } from "../entity/User";
import { Field, InputType, Int, ObjectType } from "type-graphql";

/*=============================================
=            auth Response            =
=============================================*/
@ObjectType()
export class Ierror {
  @Field((type) => Int, { nullable: true })
  code!: number;
  @Field((type) => String, { nullable: true })
  message!: string;
}
@ObjectType()
export class NormalResponse {
  @Field((type) => Boolean)
  resp?: boolean = true;
  @Field((type) => [Ierror], { nullable: "itemsAndList" })
  errors?: Ierror[];
}

@ObjectType()
export class AuthResponse extends NormalResponse {
  @Field((type) => String, { nullable: true })
  token?: string;
}

@ObjectType()
export class UserResponse extends NormalResponse {
  @Field((type) => User, { nullable: true })
  user?: User;
}
@ObjectType()
export class FileResponse extends NormalResponse {
  @Field({ nullable: true })
  path?: string;
}

@ObjectType()
export class PrevDataResource {
  @Field((type) => String)
  key!: string;

  @Field((type) => String)
  instance!: string;
}
