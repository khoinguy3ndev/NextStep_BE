import { registerEnumType } from '@nestjs/graphql';

export enum AiJobStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

registerEnumType(AiJobStatus, {
  name: 'AiJobStatus',
});
