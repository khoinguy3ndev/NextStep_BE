import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LearningResource } from './learning-resource.entity';
import { Roadmap } from './roadmap.entity';
import { Skill } from './skill.entity';

@ObjectType()
@Entity({ tableName: 'roadmap_items' })
export class RoadmapItem {
  @Field(() => ID)
  @PrimaryKey()
  itemId!: number;

  @ManyToOne(() => Roadmap)
  roadmap!: Roadmap;

  @ManyToOne(() => Skill)
  skill!: Skill;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  priority?: number;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  estimatedWeeks?: number;

  @ManyToOne(() => LearningResource, { nullable: true })
  resource?: LearningResource;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  notes?: string;
}
