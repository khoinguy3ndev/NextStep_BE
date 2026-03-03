import { registerEnumType } from '@nestjs/graphql';

export enum RequirementType {
  SKILL = 'skill',
  DEGREE = 'degree',
  EXPERIENCE = 'experience',
  LANGUAGE = 'language',
  OTHER = 'other',
}

registerEnumType(RequirementType, {
  name: 'RequirementType',
});
