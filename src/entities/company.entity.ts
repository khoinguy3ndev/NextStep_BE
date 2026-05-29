import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Job } from './job.entity';

@ObjectType()
@Entity({ tableName: 'companies' })
@Unique({ properties: ['name'] })
export class Company {
  @Field(() => ID)
  @PrimaryKey({ fieldName: 'company_id' })
  companyId!: number;

  @Field()
  @Property({ fieldName: 'name' })
  name!: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'website', nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'industry', nullable: true })
  industry?: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'size', nullable: true })
  size?: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'location', nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'logo_url', nullable: true })
  logoUrl?: string;

  @OneToMany(() => Job, (job) => job.company)
  jobs = new Collection<Job>(this);
}
