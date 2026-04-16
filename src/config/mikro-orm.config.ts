import { Options } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import dotenv from 'dotenv'
import { AnalysisResult } from '../entities/analysis-result.entity'
import { Company } from '../entities/company.entity'
import { CvSkill } from '../entities/cv-skill.entity'
import { Cv } from '../entities/cv.entity'
import { EntityEmbedding } from '../entities/entity-embedding.entity'
import { JobRequirement } from '../entities/job-requirement.entity'
import { JobSkill } from '../entities/job-skill.entity'
import { Job } from '../entities/job.entity'
import { LearningResource } from '../entities/learning-resource.entity'
import { RagChunk } from '../entities/rag-chunk.entity'
import { RagDocument } from '../entities/rag-document.entity'
import { RoadmapItem } from '../entities/roadmap-item.entity'
import { Roadmap } from '../entities/roadmap.entity'
import { SearchProfile } from '../entities/search-profile.entity'
import { SkillCourse } from '../entities/skill-course.entity'
import { SkillGap } from '../entities/skill-gap.entity'
import { Skill } from '../entities/skill.entity'
import { User } from '../entities/user.entity'

dotenv.config()

const databaseUrl = process.env.DATABASE_URL
const entities = [
  AnalysisResult,
  Company,
  Cv,
  CvSkill,
  EntityEmbedding,
  Job,
  JobRequirement,
  JobSkill,
  LearningResource,
  RagChunk,
  RagDocument,
  Roadmap,
  RoadmapItem,
  SearchProfile,
  Skill,
  SkillCourse,
  SkillGap,
  User,
]

const mikroOrmConfig: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  ...(databaseUrl
    ? { clientUrl: databaseUrl }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME,
      }),
  entities,
  entitiesTs: entities,
  extensions: [Migrator],
  debug: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
}

export default mikroOrmConfig
