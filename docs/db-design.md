# Database Design - Danh sách bảng và công dụng

Tài liệu này liệt kê toàn bộ bảng được khai báo qua các entity trong `src/entities`.

| STT | Tên bảng | Công dụng |
|---|---|---|
| 1 | `users` | Lưu thông tin tài khoản người dùng (email, mật khẩu, tên, vai trò, thời gian tạo/cập nhật). |
| 2 | `companies` | Lưu hồ sơ công ty tuyển dụng (tên, website, ngành nghề, quy mô, địa điểm, logo). |
| 3 | `jobs` | Lưu bài đăng việc làm (title, level, lương, mô tả, nguồn crawl, trạng thái). |
| 4 | `skills` | Danh mục kỹ năng chuẩn hoá dùng chung cho job, CV và roadmap. |
| 5 | `job_skills` | Bảng liên kết job - skill, thể hiện kỹ năng yêu cầu và mức độ quan trọng. |
| 6 | `job_requirements` | Lưu từng requirement trích từ JD (loại requirement, raw text, số năm kinh nghiệm, skill chuẩn hoá nếu có). |
| 7 | `cv_documents` | Lưu CV người dùng (file URL, văn bản đã parse, ngôn ngữ, version, thời điểm upload). |
| 8 | `cv_sections` | Lưu các section trong CV (education/experience/...) theo thứ tự hiển thị. |
| 9 | `cv_skills` | Bảng liên kết CV - skill, lưu mức độ thành thạo, số năm kinh nghiệm và bằng chứng trích đoạn. |
| 10 | `search_profiles` | Lưu hồ sơ tìm việc của user (mức lương mong muốn, địa điểm, cấp bậc, vị trí, ngành). |
| 11 | `job_matches` | Lưu kết quả matching giữa CV và job (điểm phù hợp, kỹ năng thiếu/khớp, breakdown). |
| 12 | `analysis_requests` | Lưu yêu cầu phân tích AI (người gửi, CV, job mục tiêu, prompt, model, trạng thái). |
| 13 | `analysis_results` | Lưu kết quả trả về từ phân tích AI (summary, gap analysis, skills đề xuất, roadmap JSON). |
| 14 | `roadmaps` | Lưu kế hoạch học tập/phát triển nghề nghiệp cho user theo mục tiêu cụ thể. |
| 15 | `roadmap_items` | Lưu từng hạng mục trong roadmap (skill cần học, độ ưu tiên, thời lượng, ghi chú, resource). |
| 16 | `learning_resources` | Lưu nguồn học tập (khóa học/tài liệu) dùng để gợi ý trong roadmap. |
| 17 | `rag_documents` | Lưu tài liệu nguồn cho hệ thống RAG (loại tài liệu, nội dung, nguồn, ngôn ngữ). |
| 18 | `rag_chunks` | Lưu các đoạn chunk từ tài liệu RAG kèm embedding vector để truy vấn ngữ nghĩa. |

## Ghi chú

- Các enum PostgreSQL tương ứng (ví dụ: `job_status`, `job_level`, `currency`, `analysis_status`, ...) được dùng để ràng buộc giá trị một số cột, nhưng không phải bảng dữ liệu độc lập.
- Một số bảng đóng vai trò bảng liên kết nhiều-nhiều có thêm thuộc tính nghiệp vụ: `job_skills`, `cv_skills`.
