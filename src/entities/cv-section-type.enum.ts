import { registerEnumType } from '@nestjs/graphql';

export enum CvSectionType {
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  PROJECT = 'project',
  SKILL = 'skill',
  CERTIFICATION = 'certification',
  OTHER = 'other',
}

registerEnumType(CvSectionType, {
  name: 'CvSectionType',
});
