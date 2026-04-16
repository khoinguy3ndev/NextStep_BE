# NextStep BE

## Supabase shared database setup

BE và AI có thể chạy trên máy khác nhau nhưng dùng chung 1 database Supabase.

### Cách cấu hình nhanh

1. Tạo file `.env` trên máy mới.
2. Điền một trong hai kiểu:
   - Cách gọn: chỉ cần `DATABASE_URL` trỏ vào Supabase.
   - Cách tách biến: điền `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.

### Ví dụ

```env
DATABASE_URL=postgresql://<user>:<password>@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Hoặc:

```env
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=<user>
DB_PASSWORD=<password>
DB_NAME=postgres
```

### Quyền truy cập

- Nếu máy khác cần đọc/ghi như AI và BE hiện tại, dùng cùng user Supabase hoặc một user PostgreSQL có quyền INSERT/UPDATE/DELETE/SELECT trên các bảng cần thiết.
- Nếu chỉ cần đọc dữ liệu crawl, cấp quyền chỉ đọc cho user đó.
- Không dùng localhost/Docker DB nếu muốn chia sẻ dữ liệu giữa nhiều máy.

### Kiểm tra

- Chạy app/migration xong, in ra kết nối DB để chắc chắn đang trỏ Supabase.
- Nếu cần, dùng `DATABASE_URL` làm nguồn duy nhất để tránh lệch cấu hình.
