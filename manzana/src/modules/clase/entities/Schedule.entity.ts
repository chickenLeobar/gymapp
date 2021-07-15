import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ObjectType, Int, Field } from "type-graphql";
import { Clase } from "./clase.entity";

@Entity()
@ObjectType()
export class Schedule {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column("timestamp")
  @Field((type) => Date)
  start!: Date;

  @Column("timestamp")
  @Field((type) => Date)
  end!: Date;

  @Column()
  @Field((type) => Int)
  day!: number;

  @ManyToOne((type) => Clase)
  clase!: Clase;
}
