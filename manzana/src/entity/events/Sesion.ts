import { BootstrapComment } from "../../modules/comments/entitites/BootrapComment";
import { Resource } from "./../resouces/Resource";
import { GraphQLJSON } from "graphql-scalars";
import { Event } from "./Event";

import { ObjectType, Field, ID, Float, Int } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

import { TypeEvent } from "../../enums/Event.enums";
@ObjectType()
@Entity()
export class Sesion extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  nameSesion!: string;

  /* si es un link el usuario puede,
   ingresar un estimado de la duracion de la reunion,
  , si es un video el  tiempo lo saca del video*/
  @Field((type) => Float, { nullable: true })
  @Column({ nullable: true })
  duration!: number;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  linkRoom!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sesionCover!: string;

  @Field()
  @Column("text")
  description!: string;

  // if event program start sesion not exist
  @Field((type) => Date, { nullable: true })
  @Column("timestamp", { nullable: true })
  startSesion!: Date;

  @Field((type) => TypeEvent, { nullable: true })
  @Column({ enum: TypeEvent, default: TypeEvent.VIRTUAL, nullable: true })
  typeEvent!: TypeEvent;

  @Field((type) => Event)
  @ManyToOne((type) => Event, (ev) => ev.sesions)
  @JoinColumn({ name: "id_event" })
  event!: Promise<Event>;

  @Field((type) => Date, { nullable: true })
  @CreateDateColumn()
  createdSesion!: Date;

  @Field((type) => Boolean, { defaultValue: false })
  @Column({ nullable: false, default: () => false })
  includeComments?: boolean;

  /*=============================================
  =            ATRIBUTES FOR RESOURCE            =
  =============================================*/

  /// determine if show video
  @Field((type) => Boolean)
  @Column({ default: false })
  includeVideo!: boolean;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  id_resource!: number;

  @ManyToOne((type) => Resource)
  @JoinColumn({ name: "id_resource" })
  @Field((type) => Resource, { nullable: true })
  video!: Promise<Resource>;

  /*=============================================
  =            Relations for inlude comments            =
  =============================================*/

  @ManyToOne((type) => BootstrapComment)
  @JoinColumn({ name: "id_comment" })
  @Field((type) => BootstrapComment)
  comments!: Promise<BootstrapComment>;

  @Field({ nullable: true })
  @Column({ nullable: true })
  id_comment!: number;

  /*=============================================
  =            Events            =
  =============================================*/

  @BeforeInsert()
  async createBootstrapComments() {
    if (this.includeComments) {
      const cb = await BootstrapComment.create().save();
      this.id_comment = cb.id;
    }
  }
  @BeforeUpdate()
  async updateBootrapComments() {
    if (this.includeComments && !this.id_comment) {
      const cb = await BootstrapComment.create().save();
      this.id_comment = cb.id;
    }
  }
}
