import { User } from "./../User";
import { Event } from "./Event";
import {
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Unique,
  Index,
} from "typeorm";

@Entity()
export class DetailEvent {
  /**
   * Tiempo en el que el usuario se une  al evento
   */
  @CreateDateColumn()
  entryTime!: Date;

  @Column()
  @PrimaryColumn()
  id_event!: number;

  @Column()
  @PrimaryColumn()
  id_user!: number;

  @ManyToOne((type) => Event)
  @JoinColumn({ name: "id_event" })
  event!: Promise<Event>;
  @ManyToOne((type) => User)
  @JoinColumn({ name: "id_user" })
  user!: User;
}
