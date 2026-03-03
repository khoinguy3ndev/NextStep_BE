import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Job } from './job.entity';
import { RoadmapItem } from './roadmap-item.entity';
import { RoadmapStatus } from './roadmap-status.enum';
import { User } from './user.entity';

@ObjectType()
@Entity({ tableName: 'roadmaps' })
export class Roadmap {
  @Field(() => ID)
  @PrimaryKey()
  roadmapId!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Job, { nullable: true })
  targetJob?: Job;

  @Field()
  @Property()
  goalTitle!: string;

  @Field()
  @Property({ type: 'int' })
  timeframeWeeks!: number;

  @Field(() => RoadmapStatus)
  @Enum({ items: () => RoadmapStatus, nativeEnumName: 'roadmap_status', default: RoadmapStatus.DRAFT })
  status: RoadmapStatus = RoadmapStatus.DRAFT;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @OneToMany(() => RoadmapItem, (item) => item.roadmap)
  items = new Collection<RoadmapItem>(this);
}
