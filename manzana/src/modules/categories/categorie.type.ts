import { Event } from "./../../entity/events/Event";
import { Resource } from "./../../entity/resouces/Resource";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Categorie extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;
  @Column()
  @Field()
  name!: string;
  @Column("text")
  @Field()
  description!: string;

  @OneToOne((type) => Resource)
  @JoinColumn({ name: "id_image" })
  @Field((type) => Resource, { nullable: true })
  image!: Promise<Resource>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  id_image!: number;

  @Field((type) => Date)
  @CreateDateColumn()
  createCategorie!: Date;

  @Field((type) => Int)
  @Column({ default: 0 })
  countEvents!: number;

  @Field((type) => Int)
  @Column({ default: 0 })
  countPrograms!: number;

  @Field((type) => Event)
  events!: Promise<Event[]>;
}

@InputType()
export class InputCategorie implements Partial<Categorie> {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field((type) => ID, { nullable: true })
  id_image!: number;
}

@ObjectType()
export class CategorieResponse {
  @Field((type) => [Categorie])
  items!: Categorie[];
}
