import { Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { Comment } from "./Comment";
import { Field, ObjectType, ID } from "type-graphql";
/**
 *  this entity load comments
 */

@ObjectType()
@Entity()
export class BootstrapComment extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;
  @OneToMany((type) => Comment, (c) => c.bootstrap)
  @Field((type) => [Comment])
  comments!: Promise<Comment[]>;
}
