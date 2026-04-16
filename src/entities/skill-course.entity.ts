import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'skill_courses' })
export class SkillCourse {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => Skill)
  @ManyToOne(() => Skill, { fieldName: 'skill_id' })
  skill!: Skill;

  @Field({ nullable: true })
  @Property({ nullable: true })
  platform?: string;

  @Field()
  @Property()
  title!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  duration?: string;

  @Field({ nullable: true })
  @Property({ type: 'int', nullable: true, fieldName: 'duration_hours' })
  durationHours?: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  level?: string;
}
