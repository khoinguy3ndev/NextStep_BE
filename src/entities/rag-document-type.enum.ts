import { registerEnumType } from '@nestjs/graphql';

export enum RagDocumentType {
  JOB_MARKET = 'job_market',
  COURSE = 'course',
  SKILL_GUIDE = 'skill_guide',
  ROLE_PROFILE = 'role_profile',
}

registerEnumType(RagDocumentType, {
  name: 'RagDocumentType',
});
