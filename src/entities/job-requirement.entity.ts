import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Job } from './job.entity';
import { RequirementType } from './requirement-type.enum';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'job_requirements' })
export class JobRequirement {
  @Field(() => ID)
  @PrimaryKey()
  requirementId!: number;

  @ManyToOne(() => Job)
  job!: Job;

  @Field(() => RequirementType)
  @Enum({ items: () => RequirementType, nativeEnumName: 'requirement_type' })
  type!: RequirementType;

  @Field()
  @Property({ type: 'text' })
  rawText!: string;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  yearsExp?: number;

  @ManyToOne(() => Skill, { nullable: true })
  normalizedSkill?: Skill;
}
