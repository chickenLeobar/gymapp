import { HistorialCredit } from "./historialCredit";
import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity()
@ObjectType()
export class CreditBootstrap extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id!: string;

  @Column("int4", { default: 0 })
  @Field((type) => Int)
  currentCredits!: number;

  @Column("int4", { default: 0 })
  @Field((type) => Int)
  referrealCredits!: number;

  @UpdateDateColumn()
  @Field((type) => Date)
  updateCredits!: Date;

  @Field((type) => [HistorialCredit])
  @OneToMany((type) => HistorialCredit, (c) => c.bootstrap)
  historial!: Promise<HistorialCredit[]>;
}
