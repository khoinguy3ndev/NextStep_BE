import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AnalysisStatus } from './analysis-status.enum';
import { CvDocument } from './cv-document.entity';
import { Job } from './job.entity';
import { User } from './user.entity';
import { AnalysisResult } from './analysis-result.entity';

@ObjectType()
@Entity({ tableName: 'analysis_requests' })
export class AnalysisRequest {
  @Field(() => ID)
  @PrimaryKey()
  requestId!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => CvDocument)
  cv!: CvDocument;

  @ManyToOne(() => Job, { nullable: true })
  job?: Job;

  @Field()
  @Property({ type: 'text' })
  prompt!: string;

  @Field()
  @Property()
  model!: string;

  @Field(() => AnalysisStatus)
  @Enum({ items: () => AnalysisStatus, nativeEnumName: 'analysis_status', default: AnalysisStatus.PENDING })
  status: AnalysisStatus = AnalysisStatus.PENDING;

  @Field()
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @OneToOne(() => AnalysisResult, (result) => result.request, { nullable: true })
  result?: AnalysisResult;
}
