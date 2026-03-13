import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'skill_aliases' })
@Unique({ properties: ['skill', 'alias'] })
export class SkillAlias {
  @Field(() => ID)
  @PrimaryKey()
  aliasId!: number;

  @Field(() => Skill)
  @ManyToOne(() => Skill)
  skill!: Skill;

  @Field()
  @Property()
  alias!: string;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
