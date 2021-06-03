import { User } from "entity/User";
import { Field, ID, ObjectType, Int } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  PrimaryColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class InteractionEvent extends BaseEntity {
  @PrimaryColumn()
  @Field((type) => Int)
  id_user!: number;

  @PrimaryColumn()
  @Field((type) => Int)
  id_event!: number;
}
