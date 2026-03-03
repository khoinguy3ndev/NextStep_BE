# Database design (PostgreSQL)

## Muc tieu
- Luu du lieu job crawl, CV, skill, ket qua matching, phan tich va roadmap.
- Ho tro RAG (chunk + embedding) va sinh roadmap theo tuan/thang.

## ERD (Mermaid)
```mermaid
erDiagram
  USER ||--o{ CV_DOCUMENT : owns
  USER ||--o{ SEARCH_PROFILE : has
  USER ||--o{ JOB_MATCH : gets
  USER ||--o{ ROADMAP : plans
  COMPANY ||--o{ JOB : posts

  JOB ||--o{ JOB_SKILL : requires
  SKILL ||--o{ JOB_SKILL : is_required
  JOB ||--o{ JOB_REQUIREMENT : has

  CV_DOCUMENT ||--o{ CV_SECTION : contains
  CV_DOCUMENT ||--o{ CV_SKILL : extracts
  SKILL ||--o{ CV_SKILL : extracted

  JOB ||--o{ JOB_MATCH : matched
  CV_DOCUMENT ||--o{ JOB_MATCH : matched

  RAG_DOCUMENT ||--o{ RAG_CHUNK : chunked
  ANALYSIS_REQUEST ||--|| ANALYSIS_RESULT : produces
  USER ||--o{ ANALYSIS_REQUEST : requests
  CV_DOCUMENT ||--o{ ANALYSIS_REQUEST : uses
  JOB ||--o{ ANALYSIS_REQUEST : compares

  ROADMAP ||--o{ ROADMAP_ITEM : contains
  SKILL ||--o{ ROADMAP_ITEM : targets
  LEARNING_RESOURCE ||--o{ ROADMAP_ITEM : uses
```

## RAG pipeline mapping
1. Crawl jobs -> luu `Job.descriptionRaw`.
2. Clean/normalize JD -> `Job.descriptionClean`.
3. Extract skills/requirements -> `JobSkill`, `JobRequirement`.
4. Tao RAG docs (JD + course + skill guide) -> `RagDocument`.
5. Chunk + embed -> `RagChunk` (pgvector).
6. Query: CV + JD -> retrieve top-K chunks.
7. LLM sinh ket qua -> luu `AnalysisResult`, `Roadmap`, `RoadmapItem`.

## Scoring cong khai (rule-based)
- Skill match:
$$
\,f_{skill} = \frac{\sum_{s \in S_j \cap S_c} w_s \cdot p_s}{\sum_{s \in S_j} w_s}
$$
- Salary fit:
$$
\,f_{sal} = \frac{\max(0, \min(u_{max}, j_{max}) - \max(u_{min}, j_{min}))}{u_{max} - u_{min}}
$$
- Experience fit:
$$
\,f_{exp} = \min(1, \frac{y_c}{y_j})
$$
- Final score:
$$
Score = 0.55 f_{skill} + 0.15 f_{exp} + 0.10 f_{lvl} + 0.10 f_{sal} + 0.10 f_{loc}
$$

## Trong so de xuat
- Skill: 0.55
- Experience: 0.15
- Level: 0.10
- Salary: 0.10
- Location: 0.10

## Ghi chu ky thuat
- Dung enum native cua Postgres cho cac truong `@Enum`.
- Luu luong theo integer (cents) de tranh loi lam tron.
- Embedding su dung pgvector, can `CREATE EXTENSION vector`.
