import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from "@nestjs/graphql";

@ObjectType()
export class CvSkillAnalysis {
  @Field()
  name!: string;

  @Field(() => Float)
  proficiency!: number;

  @Field(() => Float)
  yearsOfExperience!: number;
}

@ObjectType()
export class ExtractedCvProfileType {
  @Field()
  cvLevel!: string;

  @Field(() => Float)
  cvYearsExperience!: number;

  @Field(() => [String])
  preferredLocations!: string[];

  @Field(() => [String])
  cvCertifications!: string[];

  @Field(() => [CvSkillAnalysis])
  cvSkills!: CvSkillAnalysis[];
}

@ObjectType()
export class JobSkillAnalysis {
  @Field()
  name!: string;

  @Field(() => Float)
  importance!: number;

  @Field(() => Float)
  requiredProficiency!: number;
}

@ObjectType()
export class JobContextType {
  @Field(() => Int)
  jobId!: number;

  @Field()
  title!: string;

  @Field()
  sourceUrl!: string;

  @Field()
  jobLevel!: string;

  @Field(() => Float)
  jobYearsRequired!: number;

  @Field(() => String, { nullable: true })
  jobLocation?: string | null;

  @Field()
  jobIsRemote!: boolean;

  @Field(() => [JobSkillAnalysis])
  jobSkills!: JobSkillAnalysis[];
}

@ObjectType()
export class ScoreBreakdownType {
  @Field(() => Int)
  skillMatch!: number;

  @Field(() => Int)
  experienceMatch!: number;

  @Field(() => Int)
  levelMatch!: number;

  @Field(() => Int)
  salaryMatch!: number;

  @Field(() => Int)
  locationMatch!: number;

  @Field(() => Int, { nullable: true })
  keywordMatch?: number | null;

  @Field(() => Int, { nullable: true })
  titleMatch?: number | null;

  @Field(() => Int, { nullable: true })
  atsReadability?: number | null;
}

@ObjectType()
export class JobMatchType {
  @Field(() => Int)
  score!: number;

  @Field(() => ScoreBreakdownType)
  scoreBreakdown!: ScoreBreakdownType;

  @Field(() => [String])
  missingSkills!: string[];

  @Field(() => [String])
  matchedSkills!: string[];
}

@ObjectType()
export class MissingSkillGapType {
  @Field()
  skill!: string;

  @Field()
  importance!: string;

  @Field()
  reason!: string;
}

@ObjectType()
export class WeakSkillGapType {
  @Field()
  skill!: string;

  @Field(() => Float)
  currentProficiency!: number;

  @Field(() => Float)
  requiredProficiency!: number;

  @Field(() => Float)
  gap!: number;
}

@ObjectType()
export class SkillGapType {
  @Field(() => [MissingSkillGapType])
  missing!: MissingSkillGapType[];

  @Field(() => [WeakSkillGapType])
  weak!: WeakSkillGapType[];
}

@ObjectType()
export class ExperienceGapType {
  @Field(() => Float)
  requiredYears!: number;

  @Field(() => Float)
  currentYears!: number;

  @Field(() => Int)
  gapWeeks!: number;
}

@ObjectType()
export class LevelGapType {
  @Field()
  cvLevel!: string;

  @Field()
  jobLevel!: string;

  @Field(() => Int)
  gapLevels!: number;
}

@ObjectType()
export class CertificationGapType {
  @Field(() => [String])
  required!: string[];

  @Field(() => [String])
  have!: string[];

  @Field(() => [String])
  missing!: string[];
}

@ObjectType()
export class GapAnalysisType {
  @Field(() => SkillGapType)
  skillGap!: SkillGapType;

  @Field(() => ExperienceGapType)
  experienceGap!: ExperienceGapType;

  @Field(() => LevelGapType)
  levelGap!: LevelGapType;

  @Field(() => CertificationGapType)
  certificationGap!: CertificationGapType;

  @Field(() => [String])
  recommendedSkills!: string[];
}

@ObjectType()
export class RecommendedResourceType {
  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  provider?: string | null;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => Int, { nullable: true })
  durationHours?: number | null;
}

@ObjectType()
export class RoadmapSkillItemType {
  @Field()
  skillName!: string;

  @Field(() => Int)
  priority!: number;

  @Field(() => Int)
  estimatedWeeks!: number;

  @Field(() => Int, { nullable: true })
  baselineHours?: number | null;

  @Field(() => Float)
  transferBonus!: number;

  @Field(() => Int, { nullable: true })
  adjustedHours?: number | null;

  @Field(() => [RecommendedResourceType])
  recommendedResources!: RecommendedResourceType[];
}

@ObjectType()
export class RoadmapPhaseType {
  @Field(() => Int)
  phase!: number;

  @Field(() => Int)
  durationWeeks!: number;

  @Field()
  title!: string;

  @Field(() => [RoadmapSkillItemType])
  skills!: RoadmapSkillItemType[];
}

@ObjectType()
export class RoadmapType {
  @Field(() => [RoadmapPhaseType])
  phases!: RoadmapPhaseType[];

  @Field(() => Int)
  totalWeeks!: number;

  @Field()
  estimatedCompletion!: string;

  @Field()
  difficultyLevel!: string;
}

@ObjectType()
export class CvAnalysisResponseType {
  @Field(() => Int, { nullable: true })
  analysisResultId?: number | null;

  @Field(() => ExtractedCvProfileType)
  extractedProfile!: ExtractedCvProfileType;

  @Field(() => JobContextType)
  jobContext!: JobContextType;

  @Field(() => JobMatchType)
  jobMatch!: JobMatchType;

  @Field(() => GapAnalysisType)
  gapAnalysis!: GapAnalysisType;

  @Field(() => RoadmapType)
  roadmap!: RoadmapType;
}

@ObjectType()
export class CvAnalysisHistoryItemType {
  @Field(() => Int)
  analysisId!: number;

  @Field(() => Int)
  jobId!: number;

  @Field()
  jobTitle!: string;

  @Field(() => String, { nullable: true })
  cvFilename?: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => Int, { nullable: true })
  jobMatchScore?: number | null;

  @Field(() => Int, { nullable: true })
  roadmapTotalWeeks?: number | null;
}

@ObjectType()
export class CvAnalysisHistoryType {
  @Field(() => Int)
  total!: number;

  @Field(() => [CvAnalysisHistoryItemType])
  items!: CvAnalysisHistoryItemType[];
}
