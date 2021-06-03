import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ConfigEntity extends BaseEntity {
  @PrimaryColumn()
  key!: string;

  @Column("jsonb")
  value!: Object;
}
