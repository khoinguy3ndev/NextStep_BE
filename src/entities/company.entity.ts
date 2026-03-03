import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Job } from './job.entity';

@ObjectType()
@Entity({ tableName: 'companies' })
export class Company {
  @Field(() => ID)
  @PrimaryKey()
  companyId!: number;

  @Field()
  @Property({ unique: true })
  name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  logoUrl?: string;

  @OneToMany(() => Job, (job) => job.company)
  jobs = new Collection<Job>(this);
}
