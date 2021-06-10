import { Sesion } from "./../../entity/events/Sesion";
import { InputType, Int } from "type-graphql";
import { Field, Float } from "type-graphql";
import { IsUrl } from "class-validator";

@InputType()
export class InputSesion implements Partial<Sesion> {
  @Field((type) => Float, { nullable: true })
  duration!: number;
  @Field()
  nameSesion!: string;

  @Field()
  includeComments!: boolean;

  @IsUrl()
  @Field((type) => String, { nullable: true })
  linkRoom!: string;

  @Field((type) => Date, { nullable: true })
  startSesion!: Date;

  @Field()
  description!: string;

  /*=============================================
  =            ATRIBUTES FOR VIDEO RESOURCE            =
  =============================================*/
  @Field((type) => Boolean)
  includeVideo!: boolean;

  @Field((type) => Int, { nullable: true })
  id_resource!: number;
}
