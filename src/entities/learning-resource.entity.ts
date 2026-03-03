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
  @PrimaryKey()
  resourceId!: number;

  @Field()
  @Property()
  title!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  provider?: string;

  @Field()
  @Property()
  url!: string;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  cost?: number;

  @Field({ nullable: true })
  @Property({ nullable: true, type: 'int' })
  durationHours?: number;

  @Field(() => [String], { nullable: true })
  @Property({ type: 'text[]', default: [] })
  tags: string[] = [];

  @Field({ nullable: true })
  @Property({ nullable: true })
  language?: string;

  @OneToMany(() => RoadmapItem, (item) => item.resource)
  roadmapItems = new Collection<RoadmapItem>(this);
}
