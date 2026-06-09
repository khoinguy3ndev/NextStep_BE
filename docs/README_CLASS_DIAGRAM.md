# README - Biểu đồ lớp từ Entities

Tài liệu này mô tả biểu đồ lớp (class diagram) được tổng hợp từ các entity trong thư mục `src/entities`.

## 1) Biểu đồ lớp (Mermaid)

```mermaid
classDiagram

class User {
  +userId: number
  +email: string
  +name: string
  +role: Role
}
class Cv {
  +cvId: number
  +fileName: string
  +fileKey: string
}
class SearchProfile {
  +profileId: number
  +currency: Currency
}
class Company {
  +companyId: number
  +name: string
}
class Job {
  +jobId: number
  +title: string
  +status: JobStatus
}
class Skill {
  +skillId: number
  +name: string
  +category: string
}
class JobSkill {
  +jobSkillId: number
  +importance: number
}
class JobRequirement {
  +requirementId: number
  +type: RequirementType
}
class CvAnalysisResult {
  +analysisId: number
  +createdAt: Date
}
class CvSkill {
  +id: number
  +confidence: number
}
class SkillGap {
  +id: number
  +priorityScore: number
}
class Roadmap {
  +roadmapId: number
  +goalTitle: string
  +status: RoadmapStatus
}
class RoadmapItem {
  +itemId: number
  +priority: number
}
class LearningResource {
  +resourceId: number
  +title: string
}
class SkillCourse {
  +id: number
  +title: string
}
class RagDocument {
  +docId: number
  +type: RagDocumentType
  +title: string
}
class RagChunk {
  +chunkId: number
  +tokenCount: number
  +embeddingModel: string
}
class EntityEmbedding {
  +embeddingId: bigint
  +entityType: EmbeddingEntityType
  +entityId: bigint
}
class AlembicVersion {
  +versionNum: string
}
class MikroOrmMigration {
  +id: number
  +name: string
}

User "1" --> "*" Cv : owns
User "1" --> "*" SearchProfile : has
User "1" --> "*" Roadmap : creates

Company "1" --> "*" Job : posts

Job "1" --> "*" JobSkill : has
Skill "1" --> "*" JobSkill : maps
Job "1" --> "*" JobRequirement : requires
Skill "1" --> "*" JobRequirement : normalizedSkill

Job "1" --> "*" CvAnalysisResult : analyzedFor
CvAnalysisResult "1" --> "*" CvSkill : extracts
CvAnalysisResult "1" --> "*" SkillGap : detects
Skill "1" --> "*" CvSkill : linked
Skill "1" --> "*" SkillGap : linked

Roadmap "1" --> "*" RoadmapItem : contains
Skill "1" --> "*" RoadmapItem : targetSkill
LearningResource "1" --> "*" RoadmapItem : references
Job "1" --> "*" Roadmap : targetJob

Skill "1" --> "*" SkillCourse : hasCourses

RagDocument "1" --> "*" RagChunk : chunks
```

## 2) Nhóm entity theo domain

- **User & Profile**: `User`, `Cv`, `SearchProfile`
- **Job Matching**: `Company`, `Job`, `Skill`, `JobSkill`, `JobRequirement`
- **Analysis**: `CvAnalysisResult`, `CvSkill`, `SkillGap`
- **Roadmap Learning**: `Roadmap`, `RoadmapItem`, `LearningResource`, `SkillCourse`
- **RAG Knowledge Base**: `RagDocument`, `RagChunk`, `EntityEmbedding`
- **Migration/System**: `AlembicVersion`, `MikroOrmMigration`

## 3) Ghi chú

- `Job` ↔ `Skill` là quan hệ nhiều-nhiều thông qua pivot entity `JobSkill`.
- `EntityEmbedding` là bảng embedding dùng chung theo cặp (`entityType`, `entityId`), không ràng buộc FK trực tiếp đến từng entity cụ thể.
- `AlembicVersion` và `MikroOrmMigration` phục vụ theo dõi migration, không tham gia nghiệp vụ chính.
