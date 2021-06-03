import { ERol } from "../../../enums/Auth.enums";
import { ViewColumn, ViewEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "../../../entity/User";

@ViewEntity({
  name: "userViewCtrl",
  expression: `SELECT us.id,
  us.name ,
  us.image ,
  us."lastName" ,
  us."create",
  us.rol ,
  us.id_credit,
  us.email,
   us.code ,
   us.comfirmed , 
   us.phone 
  , 
  us."lastTimeActive",
  creditb."currentCredits" as "credits",
  creditb."referrealCredits",
  us.suspended
  FROM "user" as us
  INNER join public.credit_bootstrap as creditb on creditb.id = us.id_credit`,
})
@ObjectType()
export class UserViewCtrl implements Partial<User> {
  @ViewColumn()
  @Field((type) => Int)
  id!: number;

  @ViewColumn()
  @Field((type) => String, { nullable: true })
  image!: string;

  @ViewColumn()
  @Field()
  name!: string;

  @ViewColumn()
  @Field()
  lastName!: string;

  @ViewColumn()
  @Field((type) => Date, { nullable: true })
  lastTimeActive!: Date;

  @ViewColumn()
  @Field((type) => Date)
  create!: Date;

  @Field((type) => [ERol])
  @ViewColumn()
  rol!: ERol[];

  @ViewColumn()
  @Field((type) => String)
  email!: string;

  @ViewColumn()
  @Field((type) => String)
  code!: string;

  @ViewColumn()
  @Field((type) => Boolean)
  comfirmed!: boolean;

  @ViewColumn()
  @Field((type) => String, { nullable: true })
  phone!: string;
  @ViewColumn()
  @Field((type) => Boolean)
  suspended!: boolean;

  @Field((type) => Int)
  @ViewColumn()
  credits!: number;

  @Field((type) => Int)
  @ViewColumn()
  referrealCredits!: number;

  @ViewColumn()
  @Field((type) => String)
  id_credit!: string;

  @Field((type) => Boolean)
  online!: boolean;
}
