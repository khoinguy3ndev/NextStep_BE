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
  @PrimaryKey({ fieldName: 'profile_id' })
  profileId!: number;

  @ManyToOne(() => User, { fieldName: 'user_user_id' })
  user!: User;

  @Field({ nullable: true })
  @Property({ fieldName: 'desired_salary_min', nullable: true, type: 'int' })
  desiredSalaryMin?: number;

  @Field({ nullable: true })
  @Property({ fieldName: 'desired_salary_max', nullable: true, type: 'int' })
  desiredSalaryMax?: number;

  @Field(() => Currency, { nullable: true })
  @Enum({
    items: () => Currency,
    nativeEnumName: 'currency',
    fieldName: 'currency',
    nullable: true,
  })
  currency?: Currency;

  @Field(() => [String], { nullable: true })
  @Property({ fieldName: 'locations', type: 'text[]' })
  locations: string[] = [];

  @Field(() => [JobLevel], { nullable: true })
  @Enum({
    items: () => JobLevel,
    nativeEnumName: 'job_level',
    fieldName: 'target_levels',
    array: true,
  })
  targetLevels: JobLevel[] = [];

  @Field(() => [String], { nullable: true })
  @Property({ fieldName: 'target_titles', type: 'text[]' })
  targetTitles: string[] = [];

  @Field(() => [String], { nullable: true })
  @Property({ fieldName: 'industries', type: 'text[]' })
  industries: string[] = [];
}
