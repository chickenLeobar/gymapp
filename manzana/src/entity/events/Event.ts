import { InteractionEvent } from "./Interaction";
import { User } from "./../User";
import { MODEEVENT } from "./../../globals/types";
import { BootstrapComment } from "../../modules/comments/entitites/BootrapComment";
import { EventState } from "./../../enums/Event.enums";
import { Sesion } from "./Sesion";
import { DetailEvent } from "./DetailEvent";
import { ObjectType, Field, ID, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  AfterInsert,
  BeforeUpdate,
  getManager,
} from "typeorm";

import { GraphQLJSON } from "graphql-scalars";
import { Resource } from "../../entity/resouces/Resource";
import { Categorie } from "../../modules/categories/categorie.type";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column("varchar", { length: 150 })
  name!: string;

  @Field((type) => Boolean, { nullable: true })
  @Column({ nullable: true })
  includeComments!: boolean;

  /// determine if show video
  @Field((type) => Boolean)
  @Column({ default: false })
  includeVideo!: boolean;

  @Field((type) => GraphQLJSON)
  @Column("simple-json")
  description!: string;

  /* creado para poder restrngir las capacidad de asistir a un evento */

  @Field((type) => Int, { nullable: true })
  @Column({ default: -1 })
  capacityAssistant!: number;

  @Field((type) => Date)
  @CreateDateColumn()
  createEvent!: Date;

  @Field((type) => EventState)
  @Column({ enum: EventState, default: EventState.DRAFT })
  published!: EventState;

  @Field({ nullable: true })
  @Column({ nullable: true })
  eventCover!: string;
  /**
   * program events
   */
  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  publishedDate!: Date;

  @ManyToOne((type) => Resource, {
    cascade: ["insert", "remove", "update"],
  })
  @JoinColumn({ name: "id_resource" })
  @Field((type) => Resource, { nullable: true })
  video!: Promise<Resource>;

  /**
   * DETALLES DE EVEENTO
   */

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  id_resource!: number;

  @OneToMany(
    (type) => DetailEvent,
    (de) => de.event
  )
  detailEvents!: Promise<DetailEvent>;

  @Field((type) => [Sesion])
  @OneToMany(
    (type) => Sesion,
    (se) => se.event
  )
  sesions!: Promise<Sesion[]>;

  @ManyToOne((type) => BootstrapComment)
  @JoinColumn({ name: "id_comment" })
  @Field((type) => BootstrapComment)
  comments!: Promise<BootstrapComment>;
  /// configure modes

  @Field((type) => String, { nullable: true })
  @Column("varchar", { length: 150, nullable: true })
  modeEvent!: MODEEVENT;
  /*=============================================
 =            helpers bd            =
 =============================================*/
  @Field({ nullable: true })
  @Column({ nullable: true })
  id_comment!: number;

  /*=============================================
  =            creator            =
  =============================================*/
  @Field((type) => User, { nullable: true })
  @JoinColumn({ name: "id_user" })
  @ManyToOne((type) => User)
  creator!: Promise<User>;

  @Column()
  @Field((type) => Int, { description: "Creator of the event" })
  id_user!: number;

  @BeforeUpdate()
  async updateBootrapComments() {
    if (this.includeComments && !this.id_comment) {
      console.log("new bootstrap created");

      const cb = await BootstrapComment.create().save();
      this.id_comment = cb.id;
    }
  }
  @ManyToOne((type) => Categorie, { cascade: true })
  @JoinColumn({ name: "category_id" })
  categories!: Promise<Categorie>;

  @Field((type) => Int)
  @Column()
  category_id!: number;

  @Column({ default: 0 })
  @Field((type) => Int, { description: "cost of event in credits" })
  credits!: number;

  @Field((type) => [InteractionEvent])
  interactions!: Promise<InteractionEvent[]>;
}
