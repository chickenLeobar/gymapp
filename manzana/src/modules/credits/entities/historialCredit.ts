import { CreditBootstrap } from "./credit";
import { Field, Int, ObjectType } from "type-graphql";
import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UtilCredits } from "../utils/runCreditDefault";
@Entity()
@ObjectType()
export class HistorialCredit extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column()
  @Field()
  reason!: string;

  @CreateDateColumn()
  @Field((type) => Date)
  emit!: Date;

  @Column()
  @Field((type) => Int)
  credits!: number;

  @ManyToOne((type) => CreditBootstrap)
  @JoinColumn({ name: "id_credit" })
  @Field((type) => CreditBootstrap)
  bootstrap!: Promise<CreditBootstrap>;
  @Column()
  id_credit?: string;

  @AfterInsert()
  changueValueCategorie() {
    UtilCredits.changueCredits(this);
  }
}
