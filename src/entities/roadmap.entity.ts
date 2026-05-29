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
  @PrimaryKey({ fieldName: 'roadmap_id' })
  roadmapId!: number;

  @ManyToOne(() => User, { fieldName: 'user_user_id' })
  user!: User;

  @ManyToOne(() => Job, { fieldName: 'target_job_job_id', nullable: true })
  targetJob?: Job;

  @Field()
  @Property({ fieldName: 'goal_title' })
  goalTitle!: string;

  @Field()
  @Property({ fieldName: 'timeframe_weeks', type: 'int' })
  timeframeWeeks!: number;

  @Field(() => RoadmapStatus)
  @Enum({
    items: () => RoadmapStatus,
    nativeEnumName: 'roadmap_status',
    fieldName: 'status',
    default: RoadmapStatus.DRAFT,
  })
  status: RoadmapStatus = RoadmapStatus.DRAFT;

  @Field()
  @Property({ fieldName: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => RoadmapItem, (item) => item.roadmap)
  items = new Collection<RoadmapItem>(this);
}
