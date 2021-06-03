import { Sesion } from "./Sesion";
import { DetailEvent } from "./DetailEvent";
import { CreateDateColumn, ManyToOne } from "typeorm";

import { Entity } from "typeorm";

@Entity()
export class AssistantEvent {
  /**
   * tiempo en el que asiste a la sesión
   */
  @CreateDateColumn()
  timeAsistanEvenr!: Date;

  @ManyToOne((type) => Sesion, { primary: true })
  sesion!: Sesion;

  @ManyToOne((type) => DetailEvent, { primary: true })
  detailEvent!: DetailEvent;
}
