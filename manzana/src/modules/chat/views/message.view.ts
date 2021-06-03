import { ViewColumn, ViewEntity } from "typeorm";
import { Message } from "../entities/message";
import { Field, ID, Int, ObjectType } from "type-graphql";
@ObjectType()
@ViewEntity({
  name: "view_chat_mesage",
  expression: `select msg.id as "id" ,msg.read as "read" ,
               msg.id_conversation as "idConversation" ,
               us.id  as  "idUser",
               us.name as "name" , us.image  as "image"  ,  
               msg.message  as "message" ,  msg.created as  "time" from public.message  
               as msg INNER join public."user" as us on us.id = msg.id_creator`,
})
export class MessageView implements Partial<Message> {
  @ViewColumn()
  @Field((type) => ID)
  id!: number;

  @ViewColumn({ name: "name" })
  @Field()
  name!: string;

  @Field((type) => Date)
  @ViewColumn({ name: "time" })
  created!: Date;

  @ViewColumn()
  @Field((type) => Boolean)
  read!: boolean;

  @ViewColumn()
  @Field()
  message!: string;

  @ViewColumn({ name: "image" })
  @Field({ nullable: true })
  avatar!: string;

  @ViewColumn({ name: "idConversation" })
  @Field((type) => Int)
  id_conversation!: number;

  @Field((type) => Int)
  @ViewColumn({ name: "idUser" })
  id_creator!: number;
}
