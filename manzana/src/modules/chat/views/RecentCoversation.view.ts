import { Field, ID, Int, ObjectType } from "type-graphql";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  name: "recent_messages_view",
  expression: `
  SELECT us.id as "id_user" ,
  us.image as "image" ,
  us.name  as  "name" , 
  conver."conversationId" as "id_conversation" ,
  COUNT(messa.id) as "count_messages",
  (select msg.message from public.message as msg where msg."id_conversation" = conver."conversationId" ORDER BY msg.created DESC LIMIT 1  ) as "last_message",
  (select msg.created from public.message as msg where msg."id_conversation" = conver."conversationId" ORDER BY msg.created DESC LIMIT 1  ) as "time_message",
  COUNT(messa.read)  filter (where read = FALSE and messa.id_creator =  us.id) as "unread_messages"
  from  public.conversation_participants_user as conver 
  INNER JOIN  public.message  as messa on  messa."id_conversation" = conver."conversationId"
  INNER JOIN public."user" as us on us.id = conver."userId"  GROUP by conver."conversationId" , us.id
    `,
})
@ObjectType()
export class RecentMessages {
  @ViewColumn()
  @Field((type) => ID, { nullable: true })
  id_user!: number;

  @Field({ nullable: true })
  @ViewColumn({ name: "image" })
  avatar!: string;

  @Field()
  @ViewColumn()
  name!: string;

  @Field((type) => ID)
  @ViewColumn()
  id_conversation!: number;

  @Field((type) => Int)
  @ViewColumn()
  count_messages!: number;

  @Field()
  @ViewColumn()
  last_message!: string;

  @Field((type) => Date)
  @ViewColumn()
  time_message!: Date;

  @Field()
  @ViewColumn()
  unread_messages!: number;
}
