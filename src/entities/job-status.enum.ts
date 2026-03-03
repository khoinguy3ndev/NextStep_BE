import { registerEnumType } from '@nestjs/graphql';

export enum JobStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
}

registerEnumType(JobStatus, {
  name: 'JobStatus',
});
