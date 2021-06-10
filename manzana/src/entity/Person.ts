import { Column, CreateDateColumn } from "typeorm";
import { Field, InterfaceType } from "type-graphql";
import { ERol } from "../enums/Auth.enums";
@InterfaceType({ description: "general person in my application" })
export abstract class Person {
  @Field()
  @Column("text")
  name!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field((type) => Date)
  @CreateDateColumn()
  create!: Date;

  @Field((type) => [ERol], { defaultValue: [ERol.USER] })
  @Column({
    type: "text",
    array: true,
    default: '{"USER"}',
    nullable: false,
  })
  rol!: ERol[];
  @Field(() => String, { nullable: true })
  getCompleteName(): string {
    return `${this.name} ${this.lastName}`;
  }
  @Field((type) => Date, { nullable: true })
  @Column("timestamp", { nullable: true })
  birth!: Date;
}
