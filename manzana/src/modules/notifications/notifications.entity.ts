import { User } from "./../../entity/User";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
export type TypeNotification = "EVENT" | "REFER" | "NORMAL";

@Entity()
@ObjectType()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: string;

  @Field((type) => String)
  @Column()
  type!: TypeNotification;

  @Field()
  @Column()
  title!: string;

  @Column({ default: false })
  @Field({ defaultValue: false })
  read!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  link!: string;
  @Field((type) => Date)
  @CreateDateColumn()
  timeCreated!: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  description!: string;
  @ManyToOne((type) => User)
  @JoinColumn({ name: "id_user" })
  user!: User;

  @Column()
  id_user!: number;
}
