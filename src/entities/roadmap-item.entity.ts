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
  @PrimaryKey({ fieldName: 'item_id' })
  itemId!: number;

  @ManyToOne(() => Roadmap, { fieldName: 'roadmap_roadmap_id' })
  roadmap!: Roadmap;

  @ManyToOne(() => Skill, { fieldName: 'skill_skill_id' })
  skill!: Skill;

  @Field({ nullable: true })
  @Property({ fieldName: 'priority', nullable: true, type: 'int' })
  priority?: number;

  @Field({ nullable: true })
  @Property({ fieldName: 'estimated_weeks', nullable: true, type: 'int' })
  estimatedWeeks?: number;

  @ManyToOne(() => LearningResource, {
    fieldName: 'resource_resource_id',
    nullable: true,
  })
  resource?: LearningResource;

  @Field({ nullable: true })
  @Property({ fieldName: 'notes', type: 'text', nullable: true })
  notes?: string;
}
