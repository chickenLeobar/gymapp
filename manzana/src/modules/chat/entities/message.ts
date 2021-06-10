import { User } from "./../../../entity/User";
import { Conversation } from "./Conversation";
import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field((type) => Date)
  @CreateDateColumn()
  created!: Date;

  @Field((type) => Boolean)
  @Column("bool", { default: false })
  read!: boolean;

  @Column()
  @Field()
  message!: string;

  @ManyToOne((type) => Conversation)
  @JoinColumn({ name: "id_conversation" })
  conversation!: Promise<Conversation>;

  @Column()
  @Field()
  id_conversation!: number;
  // participants

  @ManyToOne((type) => User)
  @JoinColumn({ name: "id_creator" })
  creator!: User;

  @Column()
  id_creator!: number;
}
