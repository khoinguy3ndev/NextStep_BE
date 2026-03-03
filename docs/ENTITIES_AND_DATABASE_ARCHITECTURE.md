# Database Entities & Architecture Guide

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Core Entities (Thực Thể Cơ Bản)](#core-entities)
3. [RAG System Entities (Thực Thể Hệ Thống RAG)](#rag-system-entities)
4. [Job Matching Entities (Thực Thể Matching Việc Làm)](#job-matching-entities)
5. [Career Development Entities (Thực Thể Phát Triển Sự Nghiệp)](#career-development-entities)
6. [Analysis Entities (Thực Thể Phân Tích)](#analysis-entities)
7. [Enums & Constants](#enums--constants)
8. [Workflows & Use Cases](#workflows--use-cases)

---

## 🎯 Tổng Quan

Hệ thống được thiết kế để **hỗ trợ việc matching giữa CV của người dùng và các vị trí tuyển dụng**, đồng thời **cung cấp lộ trình phát triển kỹ năng** dựa trên **AI RAG (Retrieval-Augmented Generation)**.

### Kiến trúc chính bao gồm:
- **User Management**: Quản lý người dùng, vai trò
- **Job Management**: Quản lý các vị trí tuyển dụng, công ty, yêu cầu công việc
- **CV Management**: Quản lý tài liệu CV và các phần của CV
- **RAG Knowledge Base**: Lưu trữ tài liệu và chunks để AI sử dụng
- **Skills Management**: Quản lý kỹ năng và liên kết giữa CV, Job, Roadmap
- **Job Matching**: So sánh CV với Job để tính toán match score
- **Career Roadmap**: Tạo và quản lý lộ trình phát triển kỹ năng
- **Analysis & Insights**: Phân tích khoảng cách kỹ năng và đưa ra khuyến nghị

---

## 👥 Core Entities

### **User**
**Bảng:** `users`

**Mục đích:** Lưu trữ thông tin người dùng hệ thống

```
- userId (Primary Key): ID duy nhất
- email (Unique): Email đăng nhập
- password: Mật khẩu (hashed)
- name: Tên người dùng
- role: Vai trò (USER, ADMIN)
- createdAt: Thời gian tạo
- updatedAt: Thời gian cập nhật cuối
```

**Mối quan hệ:**
- HasMany → CvDocument
- HasMany → Job
- HasMany → AnalysisRequest
- HasMany → Roadmap
- HasMany → JobMatch
- HasMany → SearchProfile

**Ứng dụng:** Xác thực người dùng, phân quyền hệ thống, theo dõi hoạt động người dùng

---

### **Company**
**Bảng:** `companies`

**Mục đích:** Lưu trữ thông tin công ty tuyển dụng

```
- companyId (Primary Key): ID công ty
- name (Unique): Tên công ty
- website: Website công ty
- industry: Ngành công nghiệp
- size: Quy mô công ty (Startup, SME, Enterprise...)
- location: Địa điểm
- logoUrl: Link logo
```

**Mối quan hệ:**
- HasMany → Job

**Ứng dụng:** Quản lý thông tin nhà tuyển dụng, lọc công việc theo công ty

---

### **Skill**
**Bảng:** `skills`

**Mục đích:** Lưu trữ danh sách kỹ năng duy nhất (database kỹ năng)

```
- skillId (Primary Key): ID kỹ năng
- name (Unique): Tên kỹ năng (VD: "React", "Project Management")
- category: Loại kỹ năng (VD: "Frontend", "Soft Skill")
- aliases: Mảng các tên gọi khác (VD: ["Reactjs", "ReactJS"])
- isActive: Kỹ năng còn hoạt động
```

**Mối quan hệ:**
- HasMany → JobSkill (qua Job)
- HasMany → CvSkill (qua CV)
- HasMany → RoadmapItem (qua Roadmap)

**Ứng dụng:** 
- Cơ sở dữ liệu kỹ năng tập trung để đảm bảo consistency
- Tìm kiếm và so sánh kỹ năng
- Xây dựng ontology kỹ năng

---

## 🧠 RAG System Entities

Những entity này hỗ trợ hệ thống **Retrieval-Augmented Generation** - cho phép AI truy xuất kiến thức từ knowledge base để cung cấp thông tin chính xác hơn.

### **RagDocument**
**Bảng:** `rag_documents`

**Mục đích:** Lưu trữ các tài liệu nguyên gốc trong knowledge base của hệ thống RAG

```
- docId (Primary Key): ID tài liệu
- type (Enum): Loại tài liệu
  * JOB_MARKET: Thông tin thị trường việc làm, xu hướng tuyển dụng
  * COURSE: Nội dung khóa học, hướng dẫn học
  * SKILL_GUIDE: Hướng dẫn về kỹ năng, best practices
  * ROLE_PROFILE: Mô tả profil công việc, yêu cầu
- title: Tiêu đề tài liệu
- sourceUrl: URL nguồn (nếu có)
- content: Nội dung đầy đủ (text)
- language: Ngôn ngữ tài liệu
- createdAt: Thời gian tạo
```

**Mối quan hệ:**
- HasMany → RagChunk

**Ứng dụng:**
- Lưu trữ tài liệu tham khảo cho AI sử dụng
- Hỗ trợ tra cứu thông tin về thị trường việc làm, kỹ năng, khóa học
- Cập nhật kiến thức hệ thống định kỳ

**Ví dụ:**
- "Hộp công cụ để trở thành Senior React Developer"
- "Xu hướng tuyển dụng 2026: AI & Machine Learning"
- "Soft Skills quan trọng cho Product Manager"

---

### **RagChunk**
**Bảng:** `rag_chunks`

**Mục đích:** Chia nhỏ tài liệu RAG thành các đoạn (chunks) để phục vụ vector embedding và retrieval

```
- chunkId (Primary Key): ID chunk
- docId (Foreign Key): ID tài liệu cha
- content: Nội dung đoạn (text)
- tokenCount: Số token trong đoạn
- embedding: Vector embedding (1536 dimensions, sinh ra từ embedding model)
- embeddingModel: Tên model dùng để tạo embedding (VD: "text-embedding-3-small")
- createdAt: Thời gian tạo
```

**Mối quan hệ:**
- BelongsTo → RagDocument

**Ứng dụng:**
- **Semantic Search**: Tìm kiếm các chunk liên quan dựa trên vector similarity
- **RAG Pipeline**: 
  1. User hỏi question
  2. Chuyển question thành vector embedding
  3. Tìm kiếm các chunk có vector tương tự
  4. Truyền chunk vào AI model để sinh response

**Workflow:**
```
Question: "Project Manager cần những kỹ năng gì?"
         ↓
    [Embedding]
         ↓
[Vector Similarity Search] tìm chunks liên quan
         ↓
Chunks về: "PM requirements", "Leadership", "Communication"
         ↓
[LLM] sử dụng chunks này để sinh response chính xác
```

---

## 🎯 Job Matching Entities

### **Job**
**Bảng:** `jobs`

**Mục đích:** Lưu trữ thông tin các vị trí tuyển dụng

```
- jobId (Primary Key): ID công việc
- companyId (Foreign Key): Công ty đăng tuyển
- title: Chức danh công việc
- level: Cấp độ (JUNIOR, MID, SENIOR)
- location: Địa điểm làm việc
- salaryMin: Mức lương tối thiểu
- salaryMax: Mức lương tối đa
- currency: Đơn vị tiền tệ (USD, VND, EUR)
- status: Trạng thái (ACTIVE, CLOSED, DRAFT)
- description: Mô tả chi tiết công việc
- createdAt/updatedAt: Metadata
```

**Mối quan hệ:**
- BelongsTo → Company
- HasMany → JobSkill
- HasMany → JobRequirement
- HasMany → AnalysisRequest
- HasMany → Roadmap
- HasMany → JobMatch

**Ứng dụng:**
- Lưu trữ dữ liệu công việc cho hệ thống matching
- Cơ sở cho phân tích gap kỹ năng
- Hỗ trợ lọc công việc theo tiêu chí

---

### **JobSkill**
**Bảng:** `job_skills`

**Mục đích:** Liên kết các kỹ năng với công việc

```
- jobSkillId (Primary Key)
- jobId (Foreign Key): Công việc
- skillId (Foreign Key): Kỹ năng yêu cầu
- importance: Mức độ quan trọng (1-5)
```

**Ứng dụng:**
- Định nghĩa chính xác kỹ năng cần thiết cho từng công việc
- Phục vụ so sánh với CV của ứng viên

---

### **JobRequirement**
**Bảng:** `job_requirements`

**Mục đích:** Lưu trữ các yêu cầu chi tiết của công việc (không chỉ kỹ năng)

```
- requirementId (Primary Key)
- jobId (Foreign Key): Công việc
- type (Enum): Loại yêu cầu
  * SKILL: Yêu cầu kỹ năng
  * EXPERIENCE: Yêu cầu kinh nghiệm
  * CERTIFICATION: Chứng chỉ bắt buộc
  * OTHER: Yêu cầu khác
- rawText: Nội dung yêu cầu (text gốc)
- yearsExp: Số năm kinh nghiệm (nếu loại EXPERIENCE)
- normalizedSkill: Skill được mapping (nếu là loại SKILL)
```

**Ứng dụng:**
- Lưu trữ yêu cầu chi tiết dưới dạng structured data
- Xử lý thông tin yêu cầu đa dạng (kinh nghiệm, chứng chỉ, soft skills)

---

### **JobMatch**
**Bảng:** `job_matches`

**Mục đích:** Lưu trữ kết quả matching giữa CV và Job

```
- matchId (Primary Key)
- userId (Foreign Key): Người dùng
- cvId (Foreign Key): CV được kiểm tra
- jobId (Foreign Key): Công việc
- score: Điểm match (0-100 hoặc 0-1)
- scoreBreakdownJson: Chi tiết điểm số theo từng tiêu chí
  {
    "skillMatch": 0.8,
    "experienceMatch": 0.7,
    "levelMatch": 0.9,
    "salaryMatch": 0.6
  }
- missingSkills: Mảng kỹ năng bị thiếu
- matchedSkills: Mảng kỹ năng trùng khớp
- createdAt: Thời gian tính toán
```

**Ứng dụng:**
- Cung cấp score matching cho người dùng biết họ phù hợp bao nhiêu %
- Giúp identify gap kỹ năng cần học
- Hỗ trợ recommender system

**Ví dụ:**
```
CV: John có React, Node.js, 3 năm kinh nghiệm, JUNIOR level
Job: Senior React Dev cần React, TypeScript, Docker, 5 năm, SENIOR level

Match Score: 65%
- skillMatch: 70% (có React nhưng thiếu TypeScript, Docker)
- experienceMatch: 60% (3 năm vs 5 năm)
- levelMatch: 50% (JUNIOR vs SENIOR)
- missingSkills: [TypeScript, Docker, 2 năm experience]
```

---

## 📚 Career Development Entities

### **Roadmap**
**Bảng:** `roadmaps`

**Mục đích:** Lưu trữ lộ trình phát triển kỹ năng của người dùng

```
- roadmapId (Primary Key)
- userId (Foreign Key): Người dùng sở hữu
- targetJobId (Foreign Key): Công việc mục tiêu (nullable)
- goalTitle: Tiêu đề mục tiêu (VD: "Trở thành Senior React Developer")
- timeframeWeeks: Khoảng thời gian dự kiến (tuần)
- status: Trạng thái (DRAFT, IN_PROGRESS, COMPLETED)
- createdAt: Thời gian tạo
```

**Ứng dụng:**
- Lưu trữ lộ trình học tập của người dùng
- Liên kết với công việc mục tiêu
- Theo dõi tiến độ phát triển

---

### **RoadmapItem**
**Bảng:** `roadmap_items`

**Mục đích:** Chi tiết các bước/kỹ năng trong roadmap

```
- itemId (Primary Key)
- roadmapId (Foreign Key): Roadmap cha
- skillId (Foreign Key): Kỹ năng cần học
- priority: Độ ưu tiên (1-5)
- estimatedWeeks: Thời gian dự kiến học kỹ năng này
- resourceId (Foreign Key): Tài liệu học tập khuyến nghị
- notes: Ghi chú thêm
```

**Ứng dụng:**
- Liệt kê các kỹ năng cần học theo thứ tự
- Cung cấp tài liệu học cho từng kỹ năng
- Theo dõi tiến độ từng kỹ năng

---

### **LearningResource**
**Bảng:** `learning_resources`

**Mục đích:** Lưu trữ các khóa học, tài liệu học tập

```
- resourceId (Primary Key)
- title: Tên khóa học/tài liệu
- provider: Nhà cung cấp (Udemy, Coursera, FreeCodeCamp...)
- url: Link tài liệu
- cost: Chi phí (nếu có)
- durationHours: Thời gian hoàn thành (giờ)
- tags: Tags (React, Backend, Certification...)
- language: Ngôn ngữ
```

**Ứng dụng:**
- Cung cấp tài nhiệu học tập cho roadmap
- Hỗ trợ cá nhân hóa lộ trình học

---

## 📄 CV Management Entities

### **CvDocument**
**Bảng:** `cv_documents`

**Mục đích:** Lưu trữ tài liệu CV của người dùng (một người có thể có nhiều phiên bản CV)

```
- cvId (Primary Key)
- userId (Foreign Key): Chủ sở hữu CV
- fileUrl: Link file CV (PDF, DOCX)
- parsedText: Nội dung CV sau khi parse
- language: Ngôn ngữ CV
- uploadedAt: Thời gian upload
- version: Phiên bản (1, 2, 3...)
```

**Mối quan hệ:**
- BelongsTo → User
- HasMany → CvSection
- HasMany → CvSkill
- HasMany → AnalysisRequest
- HasMany → JobMatch

**Ứng dụng:**
- Lưu trữ multiple versions của CV
- Phục vụ cho parsing và extract thông tin
- Cơ sở cho job matching

---

### **CvSection**
**Bảng:** `cv_sections`

**Mục đích:** Chia nhỏ CV thành các phần (Education, Experience, Skills...)

```
- sectionId (Primary Key)
- cvId (Foreign Key): CV cha
- type (Enum): Loại phần
  * EDUCATION: Học vấn
  * EXPERIENCE: Kinh nghiệm làm việc
  * PROJECT: Dự án
  * SKILL: Kỹ năng
  * CERTIFICATION: Chứng chỉ
  * OTHER: Khác
- content: Nội dung phần (text)
- orderIndex: Thứ tự hiển thị
```

**Ứng dụng:**
- Structured representation của CV
- Hỗ trợ parsing và extract thông tin
- Tính toán matching chi tiết theo từng phần

---

### **CvSkill**
**Bảng:** `cv_skills`

**Mục đích:** Liên kết kỹ năng được tìm thấy trong CV với Skill entity

```
- cvSkillId (Primary Key)
- cvId (Foreign Key): CV chứa kỹ năng
- skillId (Foreign Key): Kỹ năng (from Skill table)
- mentionedIn: Phần nào của CV (education, experience, skills section)
- proficiencyLevel: Mức độ thành thạo (BASIC, INTERMEDIATE, ADVANCED)
- yearsOfExperience: Số năm kinh nghiệm (nếu có)
```

**Ứng dụng:**
- Liên kết kỹ năng trong CV với skill database
- Hỗ trợ matching kỹ năng của CV vs Job

---

## 📊 Analysis Entities

### **AnalysisRequest**
**Bảng:** `analysis_requests`

**Mục đích:** Lưu trữ yêu cầu phân tích AI (gap analysis, roadmap generation...)

```
- requestId (Primary Key)
- userId (Foreign Key): Người yêu cầu
- cvId (Foreign Key): CV cần phân tích
- jobId (Foreign Key): Công việc mục tiêu (nullable)
- prompt: Prompt gửi tới AI model
- model: Model được sử dụng (gpt-4, gpt-3.5-turbo...)
- status (Enum): Trạng thái xử lý
  * PENDING: Chờ xử lý
  * RUNNING: Đang xử lý
  * COMPLETED: Hoàn thành
  * FAILED: Lỗi
- createdAt: Thời gian tạo
```

**Mối quan hệ:**
- BelongsTo → User, CvDocument, Job
- HasOne → AnalysisResult

**Ứng dụng:**
- Theo dõi các yêu cầu phân tích AI
- Lưu lịch sử prompt để debug/audit
- Hỗ trợ async processing của analysis

---

### **AnalysisResult**
**Bảng:** `analysis_results`

**Mục đích:** Lưu trữ kết quả phân tích AI

```
- resultId (Primary Key)
- requestId (Foreign Key): Request liên quan (One-to-One)
- summary: Tóm tắt kết quả (text)
- gapAnalysisJson: Kết quả phân tích khoảng cách kỹ năng (JSON)
  {
    "missingSkills": [
      {
        "skill": "TypeScript",
        "importance": "high",
        "reason": "Required for senior role"
      }
    ],
    "experienceGap": {
      "required": 5,
      "current": 3,
      "gap": 2
    }
  }
- recommendedSkills: Mảng kỹ năng được gợi ý học
- roadmapJson: Lộ trình phát triển được đề xuất (JSON)
  {
    "phases": [
      {
        "phase": 1,
        "duration_weeks": 8,
        "skills": ["TypeScript", "Advanced Patterns"]
      }
    ]
  }
- createdAt: Thời gian tạo
```

**Ứng dụng:**
- Lưu trữ kết quả phân tích từ AI model
- Cung cấp insights chi tiết cho người dùng
- Cơ sở cho tạo roadmap tự động

---

### **SearchProfile**
**Bảng:** `search_profiles`

**Mục đích:** Lưu trữ tiêu chí tìm kiếm công việc của người dùng

```
- profileId (Primary Key)
- userId (Foreign Key): Người dùng
- desiredSalaryMin: Mức lương tối thiểu mong muốn
- desiredSalaryMax: Mức lương tối đa mong muốn
- currency: Tỷ giá tiền tệ
- locations: Mảng các địa điểm ưa thích
- targetLevels: Mảng cấp độ công việc ưa thích
- targetTitles: Mảng chức danh ưa thích
- industries: Mảng ngành công nghiệp ưa thích
```

**Ứng dụng:**
- Hỗ trợ personalized job recommendations
- Lọc công việc theo tiêu chí người dùng

---

## 📌 Enums & Constants

### **Role**
```typescript
USER: 'user'      // Người dùng thông thường
ADMIN: 'admin'    // Quản trị viên
```

### **AnalysisStatus**
```typescript
PENDING: 'pending'      // Chờ xử lý
RUNNING: 'running'      // Đang xử lý
COMPLETED: 'completed'  // Hoàn thành
FAILED: 'failed'        // Lỗi xử lý
```

### **JobStatus**
```typescript
ACTIVE: 'active'    // Đang tuyển dụng
CLOSED: 'closed'    // Đã đóng
DRAFT: 'draft'      // Bản nháp
```

### **JobLevel**
```typescript
JUNIOR: 'junior'    // Cấp độ junior (0-2 năm)
MID: 'mid'          // Cấp độ mid (2-5 năm)
SENIOR: 'senior'    // Cấp độ senior (5+ năm)
```

### **CvSectionType**
```typescript
EDUCATION: 'education'          // Học vấn
EXPERIENCE: 'experience'        // Kinh nghiệm
PROJECT: 'project'              // Dự án
SKILL: 'skill'                  // Kỹ năng
CERTIFICATION: 'certification'  // Chứng chỉ
OTHER: 'other'                  // Khác
```

### **RagDocumentType**
```typescript
JOB_MARKET: 'job_market'       // Thông tin thị trường
COURSE: 'course'               // Nội dung khóa học
SKILL_GUIDE: 'skill_guide'     // Hướng dẫn kỹ năng
ROLE_PROFILE: 'role_profile'   // Mô tả công việc
```

### **RequirementType**
```typescript
SKILL: 'skill'               // Yêu cầu kỹ năng
EXPERIENCE: 'experience'     // Yêu cầu kinh nghiệm
CERTIFICATION: 'certification' // Chứng chỉ
OTHER: 'other'               // Khác
```

### **RoadmapStatus**
```typescript
DRAFT: 'draft'            // Bản nháp
IN_PROGRESS: 'in_progress' // Đang thực hiện
COMPLETED: 'completed'    // Hoàn thành
```

### **Currency**
```typescript
USD: 'usd'  // Đôla Mỹ
VND: 'vnd'  // Đồng Việt Nam
EUR: 'eur'  // Euro
```

---

## 🔄 Workflows & Use Cases

### **Workflow 1: Job Matching (Tìm Công Việc Phù Hợp)**

```
1. User upload CV
   └→ CvDocument được tạo
   └→ CvDocument được parse thành CvSection & CvSkill

2. User xem Job
   └→ JobMatch được tạo/cập nhật
   └→ Tính toán score:
      - So sánh CvSkill vs JobSkill
      - So sánh kinh nghiệm
      - So sánh level, location, salary
   └→ Lưu vào JobMatch

3. User xem JobMatch
   └→ Hiển thị score, missingSkills, matchedSkills
```

### **Workflow 2: Gap Analysis & Roadmap Generation (Phân Tích Khoảng Cách)**

```
1. User yêu cầu phân tích gap (Click "Analyze")
   └→ AnalysisRequest được tạo (status: PENDING)
   └→ prompt = "Phân tích khoảng cách kỹ năng giữa CV và Job"

2. System xử lý (Async Job)
   └→ Query RAG documents liên quan
      - RagChunk về job market, skills
      - Retrieve thông tin từ database
   └→ Send prompt + context tới LLM
   └→ LLM sinh: gapAnalysisJson, recommendedSkills, roadmapJson
   
3. AnalysisResult được tạo
   └→ AnalysisRequest.status = COMPLETED
   └→ Dữ liệu lưu trong AnalysisResult

4. System tạo Roadmap tự động (nếu cần)
   └→ Roadmap được tạo từ AnalysisResult.roadmapJson
   └→ RoadmapItem được tạo cho từng skill
   └→ LearningResource được gợi ý/liên kết
```

### **Workflow 3: Knowledge Base Management (Quản Lý Base Kiến Thức)**

```
1. Admin upload tài liệu
   └→ RagDocument được tạo

2. System process tài liệu
   └→ Split thành chunks
   └→ Tính embedding cho từng chunk
   └→ RagChunk được tạo với vector embedding

3. Khi AI cần tìm kiếm
   └→ Convert query thành embedding
   └→ Vector similarity search trên RagChunk
   └→ Retrieve top-k chunks liên quan
   └→ Send chunks + prompt tới LLM
   └→ LLM sinh response dựa trên chunks
```

### **Workflow 4: Job Recommendation by Search Profile**

```
1. User cập nhật SearchProfile
   └→ desiredSalary, locations, targetLevels, industries

2. System recommend jobs
   └→ Query jobs matching SearchProfile criteria
   └→ Tính JobMatch score cho từng job
   └→ Sort by score, show top matches
```

---

## 🎓 Ứng Dụng cho RAG System

### **1. Knowledge Retrieval (Truy Xuất Kiến Thức)**
- RagDocument & RagChunk cung cấp knowledge base
- Vector embedding cho semantic search
- Cho phép AI trả lời chính xác về thị trường, kỹ năng, khóa học

### **2. Context-Aware Analysis (Phân Tích Có Ngữ Cảnh)**
- Khi phân tích CV vs Job, LLM có access tới:
  - RAG documents về job market, trends
  - RAG documents về skill development, best practices
  - Cấu trúc database (Job, Skill, Requirement) cho context
- Kết quả phân tích chính xác, có căn cứ

### **3. Personalized Roadmap Generation (Tạo Lộ Trình Cá Nhân)**
- Dựa trên gap analysis (AnalysisResult)
- Kết hợp với LearningResource database
- Tạo roadmap phù hợp với múi thời gian, budget, level

### **4. Continuous Learning Recommendations**
- LearningResource được liên kết với RoadmapItem
- Giới thiệu khóa học, tutorial phù hợp
- Support multiple providers (Udemy, Coursera...)

---

## 📊 Entity Relationships Diagram

```
User
├── CvDocument
│   ├── CvSection
│   ├── CvSkill ─→ Skill
│   ├── AnalysisRequest
│   │   └── AnalysisResult
│   └── JobMatch ──→ Job
├── SearchProfile
├── Roadmap
│   └── RoadmapItem
│       ├─→ Skill
│       └─→ LearningResource
└── AnalysisRequest

Company
└── Job
    ├── JobSkill ─→ Skill
    ├── JobRequirement ─→ Skill
    ├── AnalysisRequest
    ├── Roadmap
    └── JobMatch ──→ CvDocument

Skill
├── CvSkill ──→ CvDocument
├── JobSkill ──→ Job
└── RoadmapItem ──→ Roadmap

RagDocument
└── RagChunk (with vector embedding)
    └── (used by AI/LLM for semantic search)
```

---

## 🧮 Công Thức Tính Toán (Calculation Formulas)

### **1. Job Matching Score (Điểm Phù Hợp Công Việc)**

**Công thức chính:**
```
Score = 0.55 × f_skill + 0.15 × f_exp + 0.10 × f_level + 0.10 × f_salary + 0.10 × f_location
```

**Trong đó:**

#### **a) Skill Match (f_skill) - 55% trọng số**
```
f_skill = Σ(w_s × p_s) / Σ(w_s)

Trong đó:
- S_j = tập kỹ năng Job yêu cầu
- S_c = tập kỹ năng CV có
- w_s = trọng số kỹ năng từ JobSkill.importance (0-1)
- p_s = proficiency level từ CvSkill.proficiency (0-1)

Ví dụ:
Job yêu cầu: React (w=0.9), Node.js (w=0.8), TypeScript (w=0.7)
CV có: React (p=0.9), Node.js (p=0.7), Docker (p=0.8 - nhưng không yêu cầu)

f_skill = (0.9×0.9 + 0.8×0.7) / (0.9 + 0.8 + 0.7)
        = (0.81 + 0.56) / 2.4
        = 1.37 / 2.4
        = 0.571 → 57.1%
```

#### **b) Experience Match (f_exp) - 15% trọng số**
```
f_exp = min(1, y_cv / y_job)

Trong đó:
- y_cv = số năm kinh nghiệm trong CV
- y_job = số năm kinh nghiệm yêu cầu (từ Job.level hoặc JobRequirement)

Level mapping:
- JUNIOR: 0-2 năm
- MID: 2-5 năm
- SENIOR: 5+ năm

Ví dụ:
CV có 3 năm, Job yêu cầu 5 năm
f_exp = min(1, 3/5) = 0.6 → 60%
```

#### **c) Level Match (f_level) - 10% trọng số**
```
f_level = {
  1.0  nếu cvLevel == jobLevel (exact match)
  0.6  nếu |cvLevel - jobLevel| == 1 level difference
  0.0  nếu khác
}

Mapping:
INTERN (0) → JUNIOR (1) → MID (2) → SENIOR (3) → LEAD (4)

Ví dụ:
CV: JUNIOR (1), Job: MID (2)
f_level = 0.6 (1 level chênh lệch)

CV: JUNIOR (1), Job: SENIOR (3)
f_level = 0.0 (2 level chênh lệch)
```

#### **d) Salary Match (f_salary) - 10% trọng số**
```
f_salary = max(0, (min(u_max, j_max) - max(u_min, j_min))) / (u_max - u_min)

Trong đó:
- [u_min, u_max] = mức lương mong muốn (từ SearchProfile)
- [j_min, j_max] = mức lương Job cung cấp (từ Job.salaryMin/Max)

Ví dụ:
Mong muốn: 2000-3000 USD
Job cung cấp: 2500-3500 USD

f_salary = (min(3000, 3500) - max(2000, 2500)) / (3000 - 2000)
         = (3000 - 2500) / 1000
         = 500 / 1000
         = 0.5 → 50%

Trường hợp không overlap:
Mong muốn: 3000-4000 USD
Job: 1000-2000 USD
f_salary = max(0, ...) = 0.0 → 0%
```

#### **e) Location Match (f_location) - 10% trọng số**
```
f_location = {
  1.0  nếu job.location nằm trong SearchProfile.locations
  0.8  nếu job.remote == true
  0.0  nếu không match
}
```

#### **Final Score Calculation:**
```typescript
// Pseudocode
function calculateJobMatch(cv: CvDocument, job: Job, searchProfile: SearchProfile): JobMatch {
  const fSkill = calculateSkillMatch(cv, job);
  const fExp = calculateExperienceMatch(cv, job);
  const fLevel = calculateLevelMatch(cv, job);
  const fSalary = calculateSalaryMatch(job, searchProfile);
  const fLocation = calculateLocationMatch(job, searchProfile);
  
  const score = 0.55*fSkill + 0.15*fExp + 0.10*fLevel + 0.10*fSalary + 0.10*fLocation;
  
  return {
    score: Math.round(score * 100), // 0-100
    scoreBreakdownJson: {
      skillMatch: Math.round(fSkill * 100),
      experienceMatch: Math.round(fExp * 100),
      levelMatch: Math.round(fLevel * 100),
      salaryMatch: Math.round(fSalary * 100),
      locationMatch: Math.round(fLocation * 100)
    },
    missingSkills: cv_skills - job_skills,
    matchedSkills: cv_skills ∩ job_skills
  };
}
```

---

### **2. Gap Analysis Calculation (Phân Tích Khoảng Cách)**

Được tính dựa trên sự khác biệt giữa CV và Job:

```json
{
  "skillGap": {
    "missing": [
      {
        "skill": "TypeScript",
        "importance": "high",
        "reason": "Required in JobSkill with importance 0.9"
      }
    ],
    "weak": [
      {
        "skill": "React",
        "current_proficiency": 0.6,
        "required_proficiency": 0.9,
        "gap": 0.3
      }
    ]
  },
  "experienceGap": {
    "required_years": 5,
    "current_years": 3,
    "gap_weeks": 104  // 2 years in weeks
  },
  "levelGap": {
    "cv_level": "JUNIOR",
    "job_level": "SENIOR",
    "gap_levels": 2
  },
  "certificationGap": {
    "required": ["AWS Solutions Architect", "Kubernetes CKA"],
    "have": [],
    "missing": ["AWS Solutions Architect", "Kubernetes CKA"]
  }
}
```

---

### **3. Roadmap Generation Logic (Logic Sinh Lộ Trình)**

**Input:** AnalysisResult (gap analysis), Target Job, User profile

**Algorithm:**
```
1. Extract missing skills từ gapAnalysisJson
2. Sort theo:
   a) Importance (high → medium → low)
   b) Prerequisites (học trước dependencies)
   c) Time estimate (quick wins first)
3. For mỗi skill:
   a) Estimate learning time from industry benchmarks
   b) Find LearningResource từ database
   c) Create RoadmapItem với priority & estimated_weeks
4. Group theo phases (không quá 4-5 skill per phase)
5. Calculate total timeframe = Σ(estimated_weeks)
```

**Example Output:**
```json
{
  "phases": [
    {
      "phase": 1,
      "duration_weeks": 8,
      "title": "Foundation",
      "skills": [
        {
          "skill_id": 12,
          "skill_name": "TypeScript",
          "priority": 5,
          "estimated_weeks": 4,
          "recommended_resources": [
            {
              "resource_id": 45,
              "title": "TypeScript Deep Dive",
              "provider": "Udemy",
              "duration_hours": 20
            }
          ]
        },
        {
          "skill_id": 34,
          "skill_name": "Advanced Patterns",
          "priority": 4,
          "estimated_weeks": 4,
          "recommended_resources": [...]
        }
      ]
    },
    {
      "phase": 2,
      "duration_weeks": 10,
      "title": "Applied Skills",
      "skills": [...]
    }
  ],
  "total_weeks": 18,
  "estimated_completion": "2026-07-01",
  "difficulty_level": "MEDIUM"
}
```

---

### **4. Skill Importance Calculation (Tính Trọng Số Kỹ Năng)**

Dùng để xác định `JobSkill.importance`:

```
importance = (frequency_in_jobs × 0.4) + (salary_correlation × 0.3) + (level_requirement × 0.3)

Trong đó:
- frequency_in_jobs: % job trong market require skill này
- salary_correlation: mức lương trung bình require skill / avg salary
- level_requirement: JUNIOR(0.3) < MID(0.6) < SENIOR(1.0)
```

---

### **5. Learning Time Estimation (Ước Lượng Thời Gian Học)**

**Industry Benchmarks:**

```
Level | Time to Learn (hours) | Time in Weeks (20h/week)
------|----------------------|------------------------
Basic Concept | 10-20 | 1 week
Intermediate | 30-50 | 2-3 weeks
Advanced | 50-100 | 3-5 weeks
Expert | 100+ | 5+ weeks

Examples:
- React Basics: 40h = 2 weeks
- TypeScript: 50h = 2-3 weeks
- System Design: 80h = 4 weeks
- DevOps: 120h = 6 weeks
```

---

## 💡 Tips for Implementation

### **For Backend/API Developers:**
1. **CV Parsing**: Implement proper parsing để extract CvSection, CvSkill
2. **Job Matching Service**: Implement calculate functions theo công thức trên:
   ```typescript
   // src/services/job-matching.service.ts
   calculateSkillMatch(cv: CvDocument, job: Job): number { ... }
   calculateExperienceMatch(cv: CvDocument, job: Job): number { ... }
   calculateLevelMatch(cv: CvDocument, job: Job): number { ... }
   calculateSalaryMatch(job: Job, profile: SearchProfile): number { ... }
   calculateLocationMatch(job: Job, profile: SearchProfile): number { ... }
   calculateJobMatchScore(cv, job, profile): JobMatch { ... }
   ```
3. **Gap Analysis Service**: Parse LLM output thành structured gapAnalysisJson
4. **Roadmap Generator**: Implement roadmap generation logic từ gap analysis
5. **RAG Integration**: Implement vector search trên RagChunk (pgvector)
6. **Analysis Job Queue**: Use BullMQ, Redis cho async AnalysisRequest processing
7. **Caching**: Cache frequently accessed:
   - Job data
   - Skill importance weights
   - RagChunk similarity results

### **For AI/LLM Developers:**
1. **RAG Context**: Always include relevant RagChunk trong prompt
   - Include job market insights
   - Include skill development best practices
   - Include role-specific requirements
2. **Structured Output**: Parse LLM output thành structured JSON:
   ```json
   {
     "gapAnalysisJson": { ... },
     "recommendedSkills": [...],
     "roadmapJson": { ... }
   }
   ```
3. **Gap Analysis Generation**: Prompts để:
   ```
   "Given CV: [skills], Job Requirements: [skills],
    Analyze the gap and provide:
    1. Missing skills with importance
    2. Weak skills needing improvement
    3. Experience gap in weeks
    4. Certification requirements
    Output as JSON matching GapAnalysisJson schema"
   ```
4. **Roadmap Generation**: Prompts để:
   ```
   "Create a learning roadmap to bridge the skill gap:
    - Sort skills by importance and prerequisites
    - Estimate weeks for each skill using industry benchmarks
    - Suggest resources from provided database
    - Group into phases (max 4-5 skills per phase)
    Output as JSON matching RoadmapJson schema"
   ```
5. **Error Handling**: Catch LLM failures, set AnalysisRequest.status = FAILED with error details
6. **Validation**: Ensure roadmap:
   - Total weeks <= 52 weeks (1 year default)
   - Each phase has resources
   - Skills are ordered by prerequisites

### **For Database Developers:**
1. **Indexes**: Create indexes on frequently queried fields:
   - `users.email`
   - `jobs.status`
   - `rag_chunks.embedding` (vector index)
2. **Constraints**: Ensure unique (skill name, email) constraints
3. **Performance**: Optimize queries cho job matching (possibly use materialized views)

---

## 🎯 Calculation Reference Sheet (Tờ Tham Chiếu Công Thức)

### **Quick Formula Reference**

| Calculation | Formula | Weight | Output |
|------------|---------|--------|--------|
| Skill Match | Σ(w_s × p_s) / Σ(w_s) | 55% | 0.0-1.0 |
| Exp Match | min(1, y_cv / y_job) | 15% | 0.0-1.0 |
| Level Match | exact:1.0, diff1:0.6, else:0 | 10% | 0.0-1.0 |
| Salary Match | (overlap) / (desired range) | 10% | 0.0-1.0 |
| Location Match | match:1.0, remote:0.8, else:0 | 10% | 0.0-1.0 |
| **Final Score** | **Σ(weight × component)** | **100%** | **0-100** |

### **Score Interpretation**
```
90-100: Excellent fit - Apply immediately
75-89:  Good fit - Can apply confidently
60-74:  Moderate fit - Consider applying with strong motivation
45-59:  Below average - Significant gaps to fill
0-44:   Poor fit - Recommend focusing on other positions
```

### **Implementation Database Functions**

```sql
-- Calculate skill match for a CV vs Job
CREATE OR REPLACE FUNCTION calculate_skill_match(
  cv_id INTEGER,
  job_id INTEGER
) RETURNS FLOAT AS $$
  SELECT COALESCE(
    SUM(js.importance * cs.proficiency) / NULLIF(SUM(js.importance), 0),
    0
  )
  FROM job_skills js
  LEFT JOIN cv_skills cs ON js.skill_id = cs.skill_id AND cs.cv_id = $1
  WHERE js.job_id = $2;
$$ LANGUAGE SQL;

-- Calculate experience match
CREATE OR REPLACE FUNCTION calculate_experience_match(
  cv_years FLOAT,
  job_years FLOAT
) RETURNS FLOAT AS $$
  SELECT LEAST(1.0, COALESCE(cv_years / NULLIF(job_years, 0), 0));
$$ LANGUAGE SQL;

-- Calculate level match
CREATE OR REPLACE FUNCTION calculate_level_match(
  cv_level VARCHAR,
  job_level VARCHAR
) RETURNS FLOAT AS $$
  SELECT CASE
    WHEN cv_level = job_level THEN 1.0
    WHEN ABS(
      CASE cv_level WHEN 'intern' THEN 0 WHEN 'junior' THEN 1 WHEN 'mid' THEN 2 WHEN 'senior' THEN 3 ELSE 4 END -
      CASE job_level WHEN 'intern' THEN 0 WHEN 'junior' THEN 1 WHEN 'mid' THEN 2 WHEN 'senior' THEN 3 ELSE 4 END
    ) = 1 THEN 0.6
    ELSE 0.0
  END;
$$ LANGUAGE SQL;

-- Calculate final job match score
CREATE OR REPLACE FUNCTION calculate_job_match_score(
  cv_id INTEGER,
  job_id INTEGER,
  desired_min_salary BIGINT,
  desired_max_salary BIGINT
) RETURNS FLOAT AS $$
  DECLARE
    f_skill FLOAT;
    f_exp FLOAT;
    f_level FLOAT;
    f_salary FLOAT;
    f_location FLOAT;
    cv_exp FLOAT;
    job_exp FLOAT;
    cv_level VARCHAR;
    job_level VARCHAR;
    salary_overlap BIGINT;
  BEGIN
    -- Calculate components
    SELECT calculate_skill_match(cv_id, job_id) INTO f_skill;
    
    -- Get experience data
    SELECT COALESCE(years_exp, 0) INTO cv_exp FROM cv_skills WHERE cv_id = cv_id LIMIT 1;
    SELECT EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM posted_at) INTO job_exp 
    FROM jobs WHERE job_id = job_id;
    SELECT calculate_experience_match(cv_exp, COALESCE(job_exp, 2)) INTO f_exp;
    
    -- Get level data
    SELECT 'mid' INTO cv_level; -- Replace with actual CV level from database
    SELECT level INTO job_level FROM jobs WHERE job_id = job_id;
    SELECT calculate_level_match(cv_level, job_level) INTO f_level;
    
    -- Calculate salary match
    SELECT GREATEST(0::BIGINT, LEAST(desired_max_salary, max_salary) - GREATEST(desired_min_salary, min_salary))
    INTO salary_overlap FROM jobs WHERE job_id = job_id;
    f_salary := salary_overlap::FLOAT / (desired_max_salary - desired_min_salary);
    
    -- Calculate location match (simplified - hardcoded 1.0 for now)
    f_location := 1.0;
    
    -- Return weighted sum
    RETURN ROUND(
      (0.55 * f_skill + 0.15 * f_exp + 0.10 * f_level + 0.10 * f_salary + 0.10 * f_location) * 100
    );
  END;
$$ LANGUAGE PLPGSQL;
```

### **Vector Similarity Search for RAG**

```sql
-- Find most similar chunks for a query
SELECT 
  chunk_id,
  doc_id,
  content,
  1 - (embedding <=> query_embedding) as similarity_score
FROM rag_chunks
ORDER BY embedding <=> (SELECT embedding FROM get_query_embedding('your query here'))
LIMIT 10;

-- Usage in LLM prompt:
-- 1. Convert user question to embedding
-- 2. Run similarity search above
-- 3. Include top-5 chunks in prompt context
-- 4. LLM generates response using context
```

---

## 📝 Ghi Chú

- Tất cả timestamps (createdAt, updatedAt) được tạo automatically by MikroORM
- Password được hash trước khi lưu (implement bcrypt hashing)
- Vector embedding được compute offline (batch processing)
- AnalysisRequest processing nên async để không block API
- Cân nhắc caching cho RagChunk retrieval (Redis)

### **Scoring Weights Configuration**
Nên lưu trữ trọng số trong config hoặc database để dễ A/B testing:
```json
{
  "scoring_weights": {
    "skill_match": 0.55,
    "experience_match": 0.15,
    "level_match": 0.10,
    "salary_match": 0.10,
    "location_match": 0.10
  },
  "level_mapping": {
    "intern": 0,
    "junior": 1,
    "mid": 2,
    "senior": 3,
    "lead": 4
  },
  "learning_time_benchmarks": {
    "basic": 15,
    "intermediate": 40,
    "advanced": 80,
    "expert": 150
  }
}
```

### **Performance Considerations**
1. **Job Matching**: Compute scores async, cache results 24h
2. **RAG Retrieval**: Use pgvector indexes, cache embeddings
3. **Analysis**: Queue-based processing, prevent duplicate requests
4. **Roadmap Generation**: Cache generated roadmaps, update on-demand

### **Data Quality Notes**
1. **JobSkill.importance**: Phải được validated trong range [0, 1]
2. **CvSkill.proficiency**: Phải được normalized từ parsing
3. **RagChunk.embedding**: Must be 1536 dimensions (text-embedding-3-small)
4. **Job.salary***: Stored as cents (bigint) để tránh floating point issues

---

**Cập nhật lần cuối**: 2026-03-03
**Phiên bản**: 1.1 (Added calculation formulas & implementation details)
