import { LeSafeAny } from "../../core/types/anyType";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int, Float } from "type-graphql";

@ObjectType()
@Entity({ name: "plan" })
export class Plan {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column({
    unique: true,
  })
  @Field()
  name!: string;

  @Column("real")
  @Field((type) => Float)
  price!: number;

  @Column("date")
  @Field((type) => Date)
  startDate!: Date;

  @Column("date")
  @Field((type) => Date)
  endDate!: Date;

  @Column("int4")
  @Field((type) => Int)
  months!: number;

  @Column("bool", { default: true, nullable: true })
  @Field({ nullable: true })
  avalaible!: boolean;

  @Column("json")
  @Field((type) => String)
  description!: string;
}
