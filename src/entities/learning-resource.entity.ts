import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoadmapItem } from './roadmap-item.entity';

@ObjectType()
@Entity({ tableName: 'learning_resources' })
export class LearningResource {
  @Field(() => ID)
  @PrimaryKey({ fieldName: 'resource_id' })
  resourceId!: number;

  @Field()
  @Property({ fieldName: 'title' })
  title!: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'provider', nullable: true })
  provider?: string;

  @Field()
  @Property({ fieldName: 'url' })
  url!: string;

  @Field({ nullable: true })
  @Property({ fieldName: 'cost', nullable: true, type: 'int' })
  cost?: number;

  @Field({ nullable: true })
  @Property({ fieldName: 'duration_hours', nullable: true, type: 'int' })
  durationHours?: number;

  @Field(() => [String], { nullable: true })
  @Property({ fieldName: 'tags', type: 'text[]' })
  tags: string[] = [];

  @Field({ nullable: true })
  @Property({ fieldName: 'language', nullable: true })
  language?: string;

  @OneToMany(() => RoadmapItem, (item) => item.resource)
  roadmapItems = new Collection<RoadmapItem>(this);
}
