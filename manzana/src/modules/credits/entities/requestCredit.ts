import { CreditBootstrap } from "./credit";
import { User } from "./../../../entity/User";

import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
export type TypeStateRequest = "APPROVED" | "PENDDING";
@Entity()
@ObjectType()
export class RequestCredit extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @ManyToOne((type) => CreditBootstrap)
  @JoinColumn({ name: "id_credit" })
  @Field((type) => CreditBootstrap)
  creditBootstrap!: Promise<CreditBootstrap>;

  @Column()
  @Field((type) => ID)
  id_credit!: string;

  @Column()
  @Field((type) => Int)
  credits!: number;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  description!: string;

  @CreateDateColumn()
  @Field((type) => Date)
  created!: Date;
  @ManyToOne((type) => User)
  @JoinColumn({ name: "id_responsable" })
  @Field((type) => User)
  responsable!: Promise<User>;

  @Column()
  @Field((type) => ID)
  id_responsable!: number;

  @Field((type) => String, { nullable: true })
  @Column("varchar", { length: 80, default: "PENDDING" })
  state!: TypeStateRequest;
}
