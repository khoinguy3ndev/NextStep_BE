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
  @PrimaryKey({ fieldName: 'requirement_id' })
  requirementId!: number;

  @ManyToOne(() => Job, { fieldName: 'job_job_id' })
  job!: Job;

  @Field(() => RequirementType)
  @Enum({
    items: () => RequirementType,
    nativeEnumName: 'requirement_type',
    fieldName: 'type',
  })
  type!: RequirementType;

  @Field()
  @Property({ fieldName: 'raw_text', type: 'text' })
  rawText!: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'years_exp', nullable: true, type: 'int' })
  yearsExp?: number;

  @ManyToOne(() => Skill, {
    fieldName: 'normalized_skill_skill_id',
    nullable: true,
  })
  normalizedSkill?: Skill;
}
