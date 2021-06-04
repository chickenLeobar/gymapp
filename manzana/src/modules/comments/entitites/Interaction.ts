import { User } from "./../../../entity/User";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, Int, ID } from "type-graphql";
import { InteractionType } from "../types/model";
import { Comment } from "../entitites/Comment";
/**
 * Interactioin withm  comments : LIKE - OTHERS
 */

@Entity()
@ObjectType()
export class Interaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @CreateDateColumn()
  @Field((type) => Date)
  createInteraction!: Date;

  @Column("varchar", { length: 120 })
  @Field((type) => String)
  typeInteraction!: InteractionType;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "id_user" })
  user!: Promise<User>;

  @ManyToOne((type) => Comment)
  @JoinColumn({ name: "id_comment" })
  comment!: Comment;

  //  ids connectiom

  @Column()
  @Field((type) => Int)
  id_user!: number;

  @Column()
  @Field((type) => String)
  id_comment!: string;
}
