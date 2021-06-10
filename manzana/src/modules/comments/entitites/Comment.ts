import { Interaction } from "./Interaction";
import { User } from "../../../entity/User";
import { BootstrapComment } from "./BootrapComment";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Field, Int, ID, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field((type) => ID)
  id!: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createComment!: Date;

  @UpdateDateColumn({ nullable: true })
  @Field((type) => Date, { nullable: true })
  updateComment!: Date;

  @Column("text")
  @Field()
  comment!: string;

  /*=============================================
   =            RELATIONS            =
   =============================================*/

  // relation with comment

  @ManyToOne((type) => Comment, (c) => c.replies)
  @JoinColumn({ name: "id_comment" })
  @Field((type) => [Comment], { defaultValue: [], nullable: true })
  replies!: Promise<Comment[]>;

  // relation with bootstrap comment
  @ManyToOne((type) => BootstrapComment)
  @JoinColumn({ name: "id_bootstrap" })
  bootstrap!: BootstrapComment;

  // relation with user
  @ManyToOne((type) => User)
  @JoinColumn({ name: "id_user" })
  @Field((type) => User, { nullable: true })
  user!: Promise<User>;

  //  relation  with interactions

  @Field((type) => [Interaction])
  @OneToMany((type) => Interaction, (interaction) => interaction.comment)
  interaction!: Promise<Interaction[]>;

  /*=============================================
  =            Helpers            =
  =============================================*/
  @Field((type) => Int)
  @Column()
  id_user!: number;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  id_comment!: string;
  @Field((type) => Int, { nullable: true })
  @Column({ nullable: true })
  id_bootstrap!: number;
}
