import { Conversation } from "./../modules/chat/entities/Conversation";
import { CreditBootstrap } from "./../modules/credits/entities/credit";
import { Comment } from "../modules/comments/entitites/Comment";
import { DetailEvent } from "./events/DetailEvent";
import { EProvider } from "./../enums/Auth.enums";
import { Utils } from "./../helpers/helpers";
import { Field, ID } from "type-graphql";
import {
  Column,
  AfterInsert,
  PrimaryGeneratedColumn,
  getRepository,
  OneToMany,
  Entity,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { Person } from "./Person";
import { ObjectType } from "type-graphql";
import { Event } from "./events/Event";
import { EmailHandle } from "../helpers/nodemailer";
import { UtilCredits } from "../modules/credits/utils/runCreditDefault";

@ObjectType({ implements: Person })
@Entity()
export class User extends Person {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: "250", unique: true })
  @Field()
  email!: string;

  @Field((type) => EProvider)
  @Column({
    type: "enum",
    enum: EProvider,
    default: EProvider.EMAIL,
    nullable: false,
  })
  provider!: EProvider;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  description!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  password!: string;

  @Column({ unique: true })
  @Field()
  code!: string;

  @Column({ type: "varchar", nullable: true })
  @Field((type) => String, { nullable: true })
  image!: string | null;

  @Column("varchar", { length: 15, nullable: true })
  @Field({ nullable: true })
  phone!: string;

  @Column("boolean", { default: false })
  @Field((type) => Boolean)
  comfirmed!: boolean;

  /*=============================================
  =           Events            =
  =============================================*/

  @AfterInsert()
  async sendConfirmationEmail() {
    const url = await Utils.generateConfirmUrl(this.id);
    EmailHandle.sendEmail<{ name: string; link: string }>(this.email, {
      name: "confirm",
      data: { name: this.getCompleteName(), link: url },
    });
  }

  @BeforeInsert()
  generateCode() {
    this.code = Utils.generateCode(this.id, this.name);
  }

  /*=============================================
  =            relationships            =
  =============================================*/
  // events that user assisted
  @OneToMany((type) => DetailEvent, (de) => de.user, { cascade: true })
  detailEvents!: Promise<DetailEvent[]>;

  // events user created
  @OneToMany((type) => Event, (e) => e.creator, { cascade: true })
  @Field((type) => [Event])
  eventsCreated!: Promise<Event[]>;

  @OneToMany((type) => Comment, (c) => c.user, { cascade: true })
  comments!: Promise<Comment[]>;
  /*=============================================
   =            referreals          =
   =============================================*/
  @Field((type) => [User], { nullable: "itemsAndList" })
  referreals!: User[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  sponsor!: string;

  /*=============================================
  =            Creditss            =
  =============================================*/
  @Field((type) => CreditBootstrap, { nullable: true })
  @JoinColumn({ name: "id_credit" })
  @OneToOne((type) => CreditBootstrap, { eager: true })
  credit!: CreditBootstrap;

  @BeforeInsert()
  async applyCredits() {
    UtilCredits.createCreditAndDefaultMounts(this.email, {
      name: this.name,
      lastName: this.lastName,
    });
  }

  @Column({ nullable: true })
  id_credit!: string;

  // conversations
  @ManyToMany((type) => Conversation, (c) => c.participants)
  conversations!: Promise<Conversation[]>;

  // las activate

  @Column("timestamp", { nullable: true, default: () => "CURRENT_TIMESTAMP" })
  @Field((type) => Date)
  lastTimeActive!: Date;

  @Column("bool", { default: false })
  @Field((type) => Boolean)
  suspended!: boolean;
}
