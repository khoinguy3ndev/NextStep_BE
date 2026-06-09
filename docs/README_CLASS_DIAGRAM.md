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

## 4) Danh sách bảng dữ liệu

| STT | Tên bảng | Mô tả dữ liệu lưu trữ |
| --- | --- | --- |
| 1 | `users` | Lưu trữ thông tin tài khoản người dùng như họ tên, email, mật khẩu đã mã hóa, ảnh đại diện, tài khoản Google, vai trò, vị trí hiện tại, kinh nghiệm, mức lương mục tiêu, liên hệ, hồ sơ nghề nghiệp và dữ liệu hồ sơ cá nhân. |
| 2 | `companies` | Lưu trữ thông tin công ty tuyển dụng như tên, website, ngành nghề, quy mô, địa điểm và logo. |
| 3 | `jobs` | Lưu trữ thông tin tin tuyển dụng như công ty đăng tuyển, tiêu đề, cấp độ, địa điểm, mức lương, mô tả gốc/đã xử lý, trách nhiệm, kỹ năng yêu cầu, phúc lợi, loại hình việc làm, kinh nghiệm, hạn ứng tuyển, nguồn đăng và trạng thái. |
| 4 | `job_skills` | Lưu liên kết nhiều-nhiều giữa job và skill, bao gồm mức độ quan trọng và trích dẫn bằng chứng cho từng kỹ năng. |
| 5 | `job_requirements` | Lưu các yêu cầu có cấu trúc của một job như loại yêu cầu, nội dung gốc, số năm kinh nghiệm và kỹ năng đã chuẩn hóa nếu có. |
| 6 | `skills` | Lưu danh mục kỹ năng chuẩn hóa của hệ thống, bao gồm tên kỹ năng, nhóm phân loại, danh sách alias và trạng thái hoạt động. |
| 7 | `cv_skills` | Lưu các kỹ năng được trích xuất từ CV trong một lần phân tích, gồm độ tin cậy và nguồn suy ra. |
| 8 | `skill_gaps` | Lưu các kỹ năng còn thiếu sau khi so khớp CV với job, bao gồm điểm ưu tiên và lý do gap. |
| 9 | `cv_analysis_results` | Lưu kết quả phân tích CV bằng AI theo từng lần chạy, gồm job tham chiếu, trích xuất profile, ngữ cảnh job, kết quả match, phân tích gap, roadmap gợi ý và review AI. |
| 10 | `cvs` | Lưu thông tin file CV của người dùng như tên file, key lưu trữ, URL và thời điểm upload. |
| 11 | `search_profiles` | Lưu cấu hình tìm việc của người dùng như mức lương mong muốn, loại tiền tệ, địa điểm, cấp độ mục tiêu, chức danh mục tiêu và ngành nghề quan tâm. |
| 12 | `roadmaps` | Lưu roadmap phát triển nghề nghiệp của người dùng, gồm mục tiêu, thời gian dự kiến, trạng thái và job mục tiêu nếu có. |
| 13 | `roadmap_items` | Lưu các hạng mục chi tiết trong roadmap như skill cần học, độ ưu tiên, số tuần ước tính, tài nguyên học tập tham chiếu và ghi chú. |
| 14 | `learning_resources` | Lưu danh mục tài nguyên học tập như tiêu đề, nhà cung cấp, URL, chi phí, thời lượng, tag và ngôn ngữ. |
| 15 | `skill_courses` | Lưu các khóa học gắn với từng skill, bao gồm nền tảng, tiêu đề, URL, thời lượng, cấp độ và số giờ ước tính. |
| 16 | `rag_documents` | Lưu tài liệu gốc phục vụ RAG, gồm loại tài liệu, tiêu đề, nguồn, nội dung, ngôn ngữ và thời điểm tạo. |
| 17 | `rag_chunks` | Lưu các đoạn văn bản đã chia nhỏ từ tài liệu RAG, kèm token count, vector embedding, model embedding và thời điểm tạo. |
| 18 | `entity_embeddings` | Lưu embedding dùng chung cho nhiều loại entity, gồm loại entity, ID entity, vector embedding, model embedding, kích thước vector và thời điểm tạo. |
| 19 | `alembic_version` | Lưu phiên bản migration của Alembic để theo dõi trạng thái schema. |
| 20 | `mikro_orm_migrations` | Lưu lịch sử migration đã chạy của MikroORM, gồm ID, tên migration và thời điểm thực thi. |

**Ghi chú:** Ngoài các entity trong `src/entities`, migration hiện tại còn có một số bảng kỹ thuật như `ai_jobs`, `ai_job_attempts` và `skill_aliases`. Các bảng này đang được quản lý ở tầng migration nhưng chưa có entity riêng trong thư mục entity.
