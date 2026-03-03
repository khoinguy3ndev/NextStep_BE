import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CvDocument } from './cv-document.entity';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'cv_skills' })
@Unique({ properties: ['cv', 'skill'] })
export class CvSkill {
  @Field(() => ID)
  @PrimaryKey()
  cvSkillId!: number;

  @ManyToOne(() => CvDocument)
  cv!: CvDocument;

  @ManyToOne(() => Skill)
  skill!: Skill;

  @Field()
  @Property({ type: 'float' })
  proficiency!: number;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  yearsExp?: number;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  evidenceSnippet?: string;
}
