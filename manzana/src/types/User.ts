import { EProvider } from "../enums/Auth.enums";
import { User } from "../entity/User";
import { InputType, Field, ObjectType, Int, ID } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class InputUser implements Partial<User> {
  @Field()
  name!: string;
  @Field()
  lastName!: string;
  @Field()
  email!: string;
  @Field({ nullable: true })
  password!: string;
  @Field({ nullable: true })
  phone!: string;
  @Field({ nullable: true })
  description!: string;
  @Field({ nullable: true })
  sponsor!: string;
}

@InputType()
export class InputEditUser extends InputUser {
  @Field({ nullable: true })
  email!: string;
  @Field({ nullable: true })
  birth!: Date;
  @Field(() => Int, { nullable: true })
  idSponsor!: number;
}

@InputType({ description: "sig in input" })
export class SignInInput implements Partial<User> {
  @IsEmail()
  @Field((type) => String)
  email!: string;
  @Field((type) => String, { nullable: true })
  password!: string;
  @Field((type) => EProvider, { nullable: true })
  provider!: EProvider;
}

export type typeOnlineEvent = "CONNECT" | "DISCONNECT";

// user for
@ObjectType()
export class UserChat implements Partial<User> {
  @Field((type) => ID)
  id!: number;

  @Field((type) => String)
  name!: string;

  @Field((type) => String)
  lastName!: string;

  @Field((type) => Boolean)
  online!: boolean;

  @Field({ nullable: true })
  description!: string;

  @Field((type) => String, { nullable: true })
  image!: string | null;

  @Field((type) => String, { nullable: true })
  code!: string;
}

@ObjectType()
export class UserStateResponse {
  @Field((type) => Int)
  id!: number;

  @Field((type) => String)
  event!: typeOnlineEvent;

  @Field((type) => UserChat)
  user!: UserChat;
}
