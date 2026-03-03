import { registerEnumType } from '@nestjs/graphql';

export enum RoadmapStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

registerEnumType(RoadmapStatus, {
  name: 'RoadmapStatus',
});
