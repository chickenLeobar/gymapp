import { ObjectType, Field, Int } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Schedule } from "./Schedule.entity";
@ObjectType()
@Entity()
export class Clase {
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column("varchar", { length: 200 })
  name!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image!: string;

  @Field()
  @Column()
  participants!: number;

  @Field()
  @Column("bool")
  avalaible!: boolean;

  @Field()
  @Column()
  description!: string;

  @OneToMany(
    (type) => Schedule,
    (sch) => sch.clase,
    { eager: true }
  )
  schedule!: Schedule[];
}
