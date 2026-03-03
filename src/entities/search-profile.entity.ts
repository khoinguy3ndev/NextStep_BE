import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Currency } from './currency.enum';
import { JobLevel } from './job-level.enum';
import { User } from './user.entity';

@ObjectType()
@Entity({ tableName: 'search_profiles' })
export class SearchProfile {
  @Field(() => ID)
  @PrimaryKey()
  profileId!: number;

  @ManyToOne(() => User)
  user!: User;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  desiredSalaryMin?: number;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  desiredSalaryMax?: number;

  @Field(() => Currency, { nullable: true })
  @Enum({ items: () => Currency, nativeEnumName: 'currency', nullable: true })
  currency?: Currency;

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  locations: string[] = [];

  @Field(() => [JobLevel], { nullable: true })
  @Enum({ items: () => JobLevel, nativeEnumName: 'job_level', array: true, default: [] })
  targetLevels: JobLevel[] = [];

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  targetTitles: string[] = [];

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  industries: string[] = [];
}
