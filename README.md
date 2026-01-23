# Todo App Backend

Đây là backend service cho ứng dụng Todo, được xây dựng dựa trên NestJS và GraphQL.

## 🛠 Công nghệ sử dụng

- **Core**: NestJS
- **API Standard**: GraphQL
- **Database**: PostgreSQL
- **ORM**: MikroORM
- **Authentication**: JWT (Access Token & Refresh Token)

## 🚀 Chạy ứng dụng

**Môi trường Development (có watch mode):**
```bash
npm run start:dev
```
Server sẽ chạy tại `http://localhost:3003`.

## 📖 Hướng dẫn cho Frontend

### 1. GraphQL Playground
Truy cập `http://localhost:3003/graphql` để xem tài liệu chi tiết (Schema & Docs) và test thử API.

### 2. Authentication Flow
Hệ thống sử dụng cơ chế bảo mật JWT.
1. **Đăng ký (Register)**: Dùng mutation `register` để tạo user.
2. **Đăng nhập (Login)**: Dùng mutation `login` với email/password.
   - Response trả về: `{ accessToken, refreshToken }`
3. **Gửi Request**:
   - Với các query/mutation cần bảo vệ (Private), cần đính kèm **AccessToken** vào Header.
   - Header Key: `Authorization`
   - Header Value: `Bearer <accessToken>`

### 3. Chi tiết Data Model & Entities

#### User Entity
Đại diện cho người dùng trong hệ thống.
- **userId** (`ID`): Khóa chính, tự động tăng.
- **email** (`String`): Email duy nhất, dùng để đăng nhập.
- **name** (`String`): Tên người dùng.
- **password**: Được mã hóa trong DB, **không** trả về qua API.
- **todos**: Danh sách các công việc (`Todo[]`) của user này.

#### Todo Entity
Đại diện cho một công việc cụ thể.
- **todoId** (`ID`): Khóa chính.
- **title** (`String`): Tiêu đề công việc.
- **description** (`String?`): Mô tả (có thể null).
- **startDate** (`DateTime`): Thời gian bắt đầu.
- **endDate** (`DateTime`): Thời gian kết thúc.
- **completed** (`Boolean`): Trạng thái hoàn thành (mặc định `false`).
- **user**: User sở hữu công việc này.

---

### 4. API Reference (Chi tiết)

#### Authentication (Public)
Không yêu cầu Header `Authorization`.

**1. Register**
Tạo tài khoản mới.
```graphql
mutation {
  register(registerInput: { 
    email: "user@example.com", 
    password: "123", 
    name: "User Name" 
  })
}
# Returns: String message
```

**2. Login**
Đăng nhập để lấy token.
```graphql
mutation {
  login(loginInput: { 
    email: "user@example.com", 
    password: "123" 
  }) {
    accessToken
    refreshToken
  }
}
```

**3. Refresh Token**
Cấp lại AccessToken mới khi hết hạn.
```graphql
mutation {
  refreshToken(refreshToken: "abcd...") {
    accessToken
    refreshToken
  }
}
```

#### User APIs (Private)
Yêu cầu Header `Authorization: Bearer <token>`.

**1. Get User Info**
Lấy thông tin chi tiết user (bao gồm thông tin profile).
```graphql
query {
  user(userId: 1) {
    userId
    email
    name
    createdAt
  }
}
```

#### Todo APIs (Private)
Yêu cầu Header `Authorization: Bearer <token>`.

**1. Create Todo**
Tạo công việc mới. Date format chuẩn ISO (ví dụ: `2023-11-20T09:00:00Z`).
```graphql
mutation {
  createTodo(createTodoInput: {
    title: "Học NestJS",
    description: "Học module GraphQL",
    startDate: "2023-10-27T00:00:00Z",
    endDate: "2023-10-28T00:00:00Z"
  }) {
    todoId
    title
    completed
  }
}
```

**2. Get Todo Detail**
Lấy chi tiết một Todo theo ID.
```graphql
query {
  getTodoById(todoId: 1) {
    todoId
    title
    user {
      name
    }
  }
}
```

**3. Update Todo Status**
Đảo ngược trạng thái `completed` của Todo (True <-> False).
```graphql
mutation {
  updateTodoStatus(todoId: 1) {
    todoId
    title
    completed
  }
}
```
