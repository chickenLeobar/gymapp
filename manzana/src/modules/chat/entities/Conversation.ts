import { UserChat } from "./../../../types/User";
import { MessageView } from "./../views/message.view";
import { User } from "./../../../entity/User";
import { Message } from "./message";
import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from "typeorm";
@Entity()
@ObjectType()
export class Conversation extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;
  @Field((type) => Date)
  @CreateDateColumn()
  created!: Date;

  @OneToMany((type) => Message, (m) => m.conversation)
  messages!: MessageView[];

  @ManyToMany((type) => User, (u) => u.conversations)
  @JoinTable()
  participants!: Promise<User[]>;

  members!: UserChat[];
}
