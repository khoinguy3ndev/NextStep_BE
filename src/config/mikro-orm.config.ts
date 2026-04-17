import { Options } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import dotenv from 'dotenv'
import { AlembicVersion } from 'src/entities/alembic-version.entity'
import { Company } from 'src/entities/company.entity'
import { CvAnalysisResult } from 'src/entities/cv-analysis-result.entity'
import { CvSkill } from 'src/entities/cv-skill.entity'
import { Cv } from 'src/entities/cv.entity'
import { EntityEmbedding } from 'src/entities/entity-embedding.entity'
import { JobRequirement } from 'src/entities/job-requirement.entity'
import { JobSkill } from 'src/entities/job-skill.entity'
import { Job } from 'src/entities/job.entity'
import { LearningResource } from 'src/entities/learning-resource.entity'
import { MikroOrmMigration } from 'src/entities/mikro-orm-migration.entity'
import { RagChunk } from 'src/entities/rag-chunk.entity'
import { RagDocument } from 'src/entities/rag-document.entity'
import { RoadmapItem } from 'src/entities/roadmap-item.entity'
import { Roadmap } from 'src/entities/roadmap.entity'
import { SearchProfile } from 'src/entities/search-profile.entity'
import { SkillCourse } from 'src/entities/skill-course.entity'
import { SkillGap } from 'src/entities/skill-gap.entity'
import { Skill } from 'src/entities/skill.entity'
import { User } from 'src/entities/user.entity'

dotenv.config()

const entities = [
  AlembicVersion,
  Company,
  Cv,
  CvAnalysisResult,
  CvSkill,
  EntityEmbedding,
  Job,
  JobRequirement,
  JobSkill,
  LearningResource,
  MikroOrmMigration,
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
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
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
