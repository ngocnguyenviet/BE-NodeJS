# Mini Shop API trên Ubuntu

Node.js 24 và PostgreSQL 18 được dùng cho môi trường học hiện tại.

## Cấu hình database

- `devuser`: role đăng nhập của ứng dụng, không cần quyền superuser/CREATEDB.
- `mini_shop`: database API, bảng `products(id, name, price)`.
- `mini_shop_relations_lab`: database riêng cho bài quan hệ và transaction.

Nếu cài lại máy, khởi động PostgreSQL rồi mở psql bằng role quản trị:

```bash
sudo pg_ctlcluster 18 main start
sudo -u postgres psql -X -d postgres
```

Trong psql, chạy file tạo role/database (đổi đường dẫn nếu chuyển project):

```sql
\i '/home/ngocnguyen/Documents/2026.1/BE-NodeJS/JavaScript/mini-shop-api/db/00-create-databases.sql'
\password devuser
\q
```

`\password` hỏi mật khẩu hai lần và không ghi mật khẩu vào lịch sử câu SQL.
Script tạo database không xóa dữ liệu và giữ nguyên role/database đã tồn tại.

Trong thư mục `JavaScript/mini-shop-api`, sao chép `.env.example` thành `.env`
nếu chưa có file, rồi điền mật khẩu `devuser` vừa đặt. Các lệnh npm tự nạp
`.env` bằng tính năng `--env-file` của Node.js. `.env` và bản sao lưu `.env.*`
được Git bỏ qua; `.env.example` chỉ chứa mẫu cấu hình.

```bash
npm ci
npm run db:setup
npm run db:check
npm run db:lab:setup
npm start
```

`db:setup` tạo bảng nếu chưa có, và chỉ thêm hai sản phẩm mẫu khi bảng rỗng.
Lab giữ nguyên dữ liệu nếu đã có, từ chối ghi chồng schema khác/chưa đầy đủ.
Chạy lại `npm run db:lab:read` để xem số dòng và tổng tiền đơn hàng lab.

## Kết nối bằng psql

```bash
psql -h 127.0.0.1 -p 5432 -U devuser -d mini_shop -W
```

Nhập mật khẩu trong `.env` tại prompt psql. Có thể dùng
`\c mini_shop_relations_lab` để chuyển sang database lab trong cùng session.
`devuser` là role PostgreSQL, tách biệt với user Linux.

## Kiểm tra API

```bash
curl http://localhost:3000/health
curl http://localhost:3000/products
```

Khi API đang chạy, mở Terminal khác trong thư mục project để chạy các bài kiểm tra hiện có:

```bash
node --test practice/product-create.unit.test.mjs practice/api.test.mjs
```

Thiết lập này tạo dữ liệu mẫu mới. Muốn phục hồi dữ liệu Windows cần bản
backup PostgreSQL (`.sql`/`.dump`/`.backup`) hoặc ổ đĩa cũ còn dữ liệu.
