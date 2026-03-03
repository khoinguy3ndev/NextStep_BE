import { registerEnumType } from '@nestjs/graphql';

export enum JobLevel {
  INTERN = 'intern',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
}

registerEnumType(JobLevel, {
  name: 'JobLevel',
});
