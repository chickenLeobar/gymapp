import { ObjectType, Field, Int } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "sede" })
@ObjectType()
@Unique("index_direction", ["name", "direction"])
export class Sede {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  direction!: string;

  @Column("json")
  @Field()
  description!: string;
}
