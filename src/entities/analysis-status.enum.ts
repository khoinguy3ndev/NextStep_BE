import { registerEnumType } from '@nestjs/graphql';

export enum AnalysisStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

registerEnumType(AnalysisStatus, {
  name: 'AnalysisStatus',
});
