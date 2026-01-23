# Git Flow Process
1. Git commands:
  - git pull: Để kéo các thay đổi mới từ branch khác về branch hiện tại.
  - git push: Để đẩy các thay đổi mới từ branch hiện tại lên 1 branch.
  - git merge: Để trộn các thay đổi từ 1 branch khác với branch hiện tại.
  - git cherry-pick: Để lấy 1 hoặc 1 vài commit từ branch khác về branch hiện tại.
  - git rebase: Để đưa commit của branch hiện tại lên HEAD của branch khác.
  - git reset: Để di chuyển HEAD về commit cũ hơn.
2. Basic git flow (Dựa trên Project):
  Tổng quan về các Branch:
  - STAGING: Nhánh phát triển, kém ổn định nhất, dùng cho development.
  - UAT: Nhánh ổn định hơn, chứa code đã được kiểm thử bởi Tester.
  - RELEASE: Nhánh Production, ổn định nhất (Zero Bug).
  - MAIN: Dùng để backup.

  Quy tắc đặt tên:
  - Feature: feat/{User_story_ID} (VD: feat/DR-17)
  - Bugfix: bugfix/{User_story_ID} (VD: bugfix/DR-17)
  - Hotfix: hotfix/{User_story_ID} (Sửa gấp từ PROD -> merge vào RELEASE)
  - Khác: docs, chore, test, style, perf

  Chiến lược phát triển (Branching Strategy):
  - Mỗi User Story là một branch riêng. Các sub-task sẽ checkout từ branch User Story này.
  - Front End:
      1. Checkout branch User Story (DR-17) từ develop (STAGING).
      2. Checkout branch sub-task (DR-18) từ DR-17.
      3. Code & Unit Test xong DR-18 -> Tạo PR merge vào DR-17 (xóa DR-18 sau khi merge).
      4. Lặp lại với các sub-task khác.
      5. Khi xong toàn bộ DR-17 -> Tạo PR merge DR-17 vào develop (STAGING).
  - Back End (BE):
      1. Checkout branch User Story (DR-17) từ develop (STAGING).
      2. Checkout branch sub-task (DR-18) từ DR-17.
      3. Code & Unit Test DR-18 -> Tạo PR merge vào DR-17 -> Tạo PR merge DR-17 vào develop để test (không xóa nhánh).
      4. Tiếp tục dev, merge vào DR-17 -> merge vào develop.
      5. Khi xong toàn bộ DR-17 -> Tạo PR merge DR-17 vào develop (xóa DR-17).

  Quy tắc sau lần Release đầu tiên (Sau First Release):
  - Tất cả working branch phải checkout từ RELEASE.
  - Tuyệt đối không merge branch khác vào working branch (trừ nhánh RELEASE) để giữ code sạch.
  - Quy trình merge để test (VD: muốn merge feature A vào UAT):
      1. Từ working branch A, tạo nhánh trung gian: A-merge-uat.
      2. Merge code mới nhất từ UAT vào A-merge-uat.
      3. Tạo PR merge A-merge-uat vào UAT.
      4. Nếu có bug: Fix trên working branch A -> tạo nhánh trung gian mới -> merge vào UAT.

  Commit & Pull Request (PR):
  - Commit message: Tuân thủ [Commit-lint](https://github.com/conventional-changelog/commitlint).
  - PR Title: type(Scope/ID): Description (VD: feat(DR-80): Handle export file).
  - Merge Strategy: Merge Commit.
  - Yêu cầu: Phải có Reviewer trước khi merge.
3. Git Structure Monolith, Multirepo, Monorepo
  - Monolith: Một ứng dụng duy nhất, các module gắn chặt, build & deploy cùng nhau.
  - Multirepo: Một ứng dụng như chia nhiều repo khác nhau cho từng chức năng hoặc project (FE, BE, ...)
      + Props: Dễ cho access control, build và deploy, scalability.
      + Cons: Phải setup cho thư viện,... cho từng repo, dễ dẫn tới xung đột.
  - Monorepo: Một ứng dụng sử dụng chung 1 repo duy nhất để quản lý
      + Props: Dễ cho dùng chung thư viện, components, utility giữa các dự án. Tất cả dự án đều dùng chung thư viện.
      + Cons: Repo sẽ phình to khi dự án càng lớn: khiến clone, pull,status lâu. CI/CD phức tạp, cần tool hỗ trợ, khó access control

# JSCore
1. Types & Grammar:
  - Variables: Khai báo var, let, const.
  - Data Types: Nguyên thủy (string, number, boolean, null, undefined, symbol), Object (array, object thường, function).
  - Operators: Số học, So sánh, &&, ||, !, Bitwise.
  - Boolean logic: Truthy và Falsy.
  - Functions: hàm thường và Arrow functions.
  - Loops: for, while, do-while,...
2. Scope & Closures:
  - Scope: Global scope, Function scope, Block scope (let/const).
  - Lexical Scope: Phạm vi sống của biến được quyết định bởi block scope.
  - Dynamic scope: Phạm vi sống của biến được quyết định bởi callstack
  - Hoisting: Cơ chế đưa khai báo được đưa lên đầu của hàm và tham số.
  - Closures: Là một hàm mà có thể truy cập biến thuộc scope chứa nó.
3. This and Object Prototypes:
  - this: trỏ tới object hoặc class đang gọi hàm.
  - Prototypes: Kế thừa, chuỗi prototype, __proto__, thuộc tính prototype.
4. Async:
  - Callback: Xử lý bất đồng bộ truyền thống, có thể gây ra callback hell.
  - Promise: Các trạng thái (pending, resolved, rejected), chuỗi (chaining), .then(), .catch(), .all() để xử lý tùy trường hợp.
  - Async/Await: Cú pháp mới cho Promise, giúp code dễ đọc hơn.
  - Event Loop: Có cách thành phần như Call Stack, Web APIs, Callback Queue, Task Queue. Là một cơ chế xử lý bất đồng bộ, các tác vụ bất đồng bộ sẽ được đẩy qua Web APIs xử lý, sau khi xử lý xong tác vụ đó sẽ được đưa cho Task Queue để chờ rồi đến Call Stack để thực thi.
5. ES6 and more:
  - Destructuring, Spread/Rest operators, Template Literals, Classes, Modules, Tham số mặc định.

# HTML CSS
1. Layout & Responsive:
  - Flexbox: Container (flex-direction, justify-content, align-items), Items (flex-grow, flex-basis).
  - Grid: Layout 2 chiều, rows, columns, areas.
  - CSS Specificity: * > Inline > ID > Class > Tag.
  - Responsive: Tùy vào các breakpoint mà điều chỉnh bố cục giao diện, media queries, đơn vị tương đối (rem, em, %, vw, vh).
2. Semantic HTML:
  - Sử dụng các thẻ mang ý nghĩa ngữ nghĩa: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer> thay vì thẻ <div> chung chung. Lợi ích cho SEO và Accessibility.

# Restful API
1. Basics:
  - Methods:
    - GET: Lấy dữ liệu.
    - POST: Tạo mới tài nguyên.
    - PUT: Thay thế/Cập nhật toàn bộ tài nguyên.
    - PATCH: Cập nhật một phần tài nguyên.
    - DELETE: Xóa tài nguyên.
  - Request & Response: Cấu trúc (Head, Body).
2. Headers & Configuration:
  - Headers: Authorization (Tokens), Content-Type, Accept.
  - Content-Type: application/json, multipart/form-data,...
  - Allow Origin: CORS (Cross-Origin Resource Sharing) headers để kiểm soát truy cập từ các domain khác.
3. Error Status Codes:
  - 401 Unauthorized: Yêu cầu xác thực hoặc xác thực thất bại.
  - 403 Forbidden: Đã xác thực nhưng không có quyền truy cập.
  - Các dải phổ biến: 2xx (Thành công), 3xx (Chuyển hướng), 4xx (Lỗi phía Client), 5xx (Lỗi phía Server).
4. Advanced:
  - FormData: Xử lý upload file và dữ liệu form thông qua lập trình.
  - XML Request: Là công cụ xử lý request, xử lý định dạng XML cũ.

# TypeScript
1. Understand what is TypeScript and how it works:
  - Khái niệm: TypeScript là một superset của JavaScript, bổ sung static typing (kiểu tĩnh). TS Code được biên dịch thành JS thuần để chạy.
  - Advantages:
    + Static Typing: Giúp phát hiện lỗi ngay lúc compile thay vì lúc chạy runtime.
    + IntelliSense: Code suggestion và auto-completion mạnh mẽ.
    + Hỗ trợ tốt cho dự án lớn, OOP và Modular.
  - Features: Static Types, ES6+ Support, Classes, Modules, Interfaces, Generics.
2. Data Types and Core Concepts:
  - Basic Data Types: string, number, boolean, null, undefined, symbol.
  - Special Types:
    + void: Dùng cho hàm không trả về giá trị.
    + never: Dùng cho hàm bắn lỗi hoặc lặp vô tận.
    + any: Tắt kiểm tra kiểu (bypass), cho phép gán mọi thứ (nên hạn chế).
    + unknown: Giống any nhưng an toàn hơn, bắt buộc phải kiểm tra kiểu trước khi thao tác.
    + undefine: undefined là một giá trị cụ thể, thường được dùng khi biến chưa được gán, hàm không trả về gì hoặc optional
  - Type annotations: Cú pháp : Type để khai báo kiểu rõ ràng. VD: let count: number = 5;.
  - Type inference: TS tự động suy luận kiểu nếu không khai báo. VD: let x = 10 -> x là number.
  - Type assertion: Ép kiểu với từ khóa as. VD: let len = (someValue as string).length;.
3. Interface, Type, Enum:
  - Interface: Dùng để định nghĩa cấu trúc của Object. Hỗ trợ extends, implements và có thể gộp khai báo.
  - Type Alias: Dùng định nghĩa mọi loại kiểu (Object, Primitive, Union, Intersection, Tuple).
  - Enum: Định nghĩa tập hợp các hằng số có tên VD: enum Role { Admin, User }.
4. Type Operators & Utilities:
  - keyof: Lấy danh sách các keys của một Type dưới dạng Union. VD: type PKeys = keyof Person;.
  - typeof: Lấy kiểu dữ liệu của một biến/object đã tồn tại. VD: type User = typeof userObj;.
  - Utility Types phổ biến như:
    + Partial<T>: Biến tất cả thuộc tính của T thành optional.
    + Required<T>: Biến tất cả thuộc tính thành bắt buộc.
    + Omit<T, K>: Loại bỏ các thuộc tính K khỏi T.
    + Pick<T, K>: Chỉ lấy các thuộc tính K từ T.
    + Record<K, V>: Tạo object type với key K và value V.
5. OOP and other:
  - OOP: Classes, Interfaces, Inheritance.
  - Modifiers: public, private , protected, readonly.
  - Abstract class: Lớp trừu tượng, không thể khởi tạo đối tượng, dùng làm class cha cho các class khác kế thừa.
  - Generic Type <T>: Cho phép viết code linh hoạt làm việc với nhiều kiểu dữ liệu khác nhau mà vẫn giữ type-safe. VD: class Box<T> { value: T; }.
  - Decorators: Cú pháp @Function dùng để thêm metadata hoặc thay đổi hành vi của class, method, property.
    + Class Decorator: Áp dụng cho các class.
    + Method Decorator: Áp dụng cho các method của class.
    + Property Decorator: Áp dụng cho các property của class.
    + Parameter Decorator: Áp dụng cho các parameter của method trong class

# Database Design
1. Overview & Base Concepts:
  - Database Design: Là quá trình tổ chức dữ liệu theo data model. Bao gồm xác định tables, columns, relations.
  - Steps to create DB: Requirement Analysis -> Conceptual Design (ERD) -> Logical Design (Schema) -> Physical Design (SQL DDL).
  - ERD (Entity Relationship Diagram): Biểu đồ thực thể liên kết, dùng để mô hình hóa cấu trúc dữ liệu và quan hệ giữa chúng trước khi tạo bảng.

2. Data Types & Constraints:
  - Data Types Common:
    + Int/BigInt: Số nguyên.
    + Varchar/Text: Chuỗi ký tự (Varchar có giới hạn, Text thì không).
    + Boolean: True/False.
    + Date/Timestamp: Ngày giờ.
    + JSON/JSONB: Lưu dữ liệu dạng JSON (JSONB lưu nhị phân, query nhanh hơn).
    + UUID: Universally Unique Identifier, dùng làm Primary Key phân tán tốt hơn Int tự tăng.
  - Constraints (Ràng buộc):
    + Primary Key (PK): Khóa chính, định danh duy nhất cho mỗi dòng, không Null.
    + Foreign Key (FK): Khóa ngoại, tham chiếu đến PK của bảng khác để tạo quan hệ.
    + Unique: Giá trị trong cột không được trùng lặp.
    + Not Null: Không cho phép giá trị rỗng.
    + Check: Đảm bảo giá trị thỏa mãn điều kiện logic.
    + Default: Giá trị mặc định nếu không insert.

3. Table Relations:
  - One-to-One (1-1): Một dòng bảng A chỉ liên kết với một dòng bảng B (Ít dùng, thường gộp bảng).
  - One-to-Many (1-n): Một dòng bảng A liên kết nhiều dòng bảng B. FK đặt ở bảng B (User - 1-n - Post).
  - Many-to-Many (n-n): Một dòng bảng A liên kết nhiều dòng bảng B và ngược lại. Cần bảng trung gian (Pivot Table) chứa 2 FK.

4. Basic Query & Flow:
  - Logical Query Processing Order: FROM/JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT/OFFSET.
  - Basic Commands:
    + SELECT: Lấy dữ liệu (VD: SELECT * FROM Users).
    + INSERT: Thêm dữ liệu (VD: INSERT INTO Users(name) VALUES('A')).
    + UPDATE: Cập nhật (VD: UPDATE Users SET name='B' WHERE id=1).
    + DELETE: Xóa dữ liệu (VD: DELETE FROM Users WHERE id=1).
    + UNION: Gộp kết quả 2 câu select (loại trùng lặp).
    + UNION ALL: Gộp kết quả 2 câu select (giữ cả dòng trùng).

5. Joins & Advanced Query:
  - Joins:
    + Inner Join: Lấy bản ghi khớp ở cả 2 bảng.
    + Left Join: Lấy tất cả bảng trái + bản ghi khớp bảng phải (Null nếu không khớp).
    + Right Join: Lấy tất cả bảng phải + bản ghi khớp bảng trái.
    + Full Outer Join: Lấy tất cả bản ghi từ cả 2 bảng.
  - Aggregated Functions: COUNT(), SUM(), AVG(), MAX(), MIN() (Thường đi kèm GROUP BY).
  - Window Functions: Thực hiện tính toán trên tập dòng liên quan dòng hiện tại mà không gom nhóm lại như Group By. VD: ROW_NUMBER() OVER(PARTITION BY dept_id ORDER BY salary).
  - Subquery: Câu truy vấn lồng nhau.
  - N+1 Query Issue: Vấn đề hiệu năng khi lấy list (1 query) sau đó loop để lấy detail từng item (N queries). Giải quyết: Join, Eager Loading hoặc Batch Loading.
 
6. Advanced Database Concepts:
  - Normalization (Chuẩn hóa):
    + 1NF: Không chứa nhóm lặp, giá trị trong ô là đơn trị.
    + 2NF: Đạt 1NF và các thuộc tính không khóa phụ thuộc hoàn toàn vào khóa chính (Composite Key).
    + 3NF: Đạt 2NF và không có phụ thuộc bắc cầu (thuộc tính không khóa phụ thuộc vào thuộc tính không khóa khác).
  - Indexes: Cấu trúc giúp tăng tốc độ tìm kiếm (Select nhanh) nhưng làm chậm thao tác ghi (Insert/Update chậm). Các loại: B-Tree, Hash, GIN (cho JSONB).
  - Transaction (ACID):
    + Atomicity: Tất cả thành công hoặc rollback toàn bộ.
    + Consistency: Dữ liệu luôn hợp lệ trước và sau transaction.
    + Isolation: Các transaction chạy song song không ảnh hưởng lẫn nhau.
    + Durability: Dữ liệu đã commit sẽ được lưu vĩnh viễn dù hệ thống lỗi.
  - Migrations: Version control cho Database Schema, giúp đồng bộ cấu trúc DB giữa các môi trường (Dev, Prod) thông qua code.
  - Stored Procedures: Tập lệnh SQL lưu trên server, chạy nhanh hơn do đã được biên dịch, bảo mật tốt hơn.
  - Views: Bảng ảo tạo từ câu query, giúp đơn giản hóa query phức tạp hoặc bảo mật cột nhạy cảm.
  - Triggers: Hàm tự động chạy khi có sự kiện Insert/Update/Delete xảy ra.
