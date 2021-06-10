import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

export type TypeInstance = "LOCAL" | "S3";

@Entity()
@ObjectType()
export class Resource extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: number;

  @UpdateDateColumn()
  @Field((type) => Date)
  updateResource!: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bucket!: string;

  @Field()
  @Column()
  key!: string;
  @Field({ nullable: true })
  url!: string;

  @Field((type) => String, { nullable: true })
  @Column("varchar", { length: 20, default: "S3" })
  instace!: TypeInstance;

  @Field({ nullable: true })
  @Column({ nullable: true })
  type!: string;

  // ACL  DOCUMENTATION : https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl_overview.html#specifying-grantee
  @Field()
  @Column({ nullable: true, default: "public-read" })
  access!: string;
}
