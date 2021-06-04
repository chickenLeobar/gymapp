import { TypeStateRequest } from "./../entities/requestCredit";
import { ViewColumn, ViewEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
@ViewEntity({
  name: "view_request",
  expression: `select 
  request.id as "id_request" ,
  request.state as  "state",
  request.created as  "created",
  request.credits as "credits",
  request.description as  "description",
  request.id_credit,
  request."id_responsable",
  us.name as "userName",
  us.id as "id_user",
  us."lastName",
  credit."currentCredits",
  credit."referrealCredits"
  from public.request_credit as request  
  inner join public.credit_bootstrap  as credit  on credit.id =  request.id_credit
  inner join  public."user" as us on us.id_credit = credit.id
  
`,
})
@ObjectType()
export class RequestCreditView {
  @ViewColumn()
  @Field((type) => Int)
  id_request!: number;

  @ViewColumn({ name: "state" })
  @Field((type) => String)
  state!: TypeStateRequest;

  @ViewColumn({ name: "description" })
  @Field((type) => String, { nullable: true })
  description!: string;

  @ViewColumn({ name: "credits" })
  @Field((type) => Int)
  credits!: number;

  @ViewColumn({ name: "userName" })
  @Field((type) => String)
  userName!: string;

  @ViewColumn({ name: "id_user" })
  @Field((type) => Int)
  idUser!: number;

  @ViewColumn({ name: "lastName" })
  @Field((type) => String)
  lastName!: string;

  @ViewColumn({ name: "currentCredits" })
  @Field((type) => Int)
  currentCredits!: number;

  @ViewColumn({ name: "referrealCredits" })
  @Field((type) => Int)
  referrealCredits!: number;

  @ViewColumn({ name: "id_responsable" })
  @Field((type) => Int)
  id_responsable!: number;

  @ViewColumn({ name: "created" })
  @Field((type) => Date)
  created!: Date;

  @ViewColumn({ name: "id_credit" })
  @Field((type) => String)
  id_credit!: string;
}
