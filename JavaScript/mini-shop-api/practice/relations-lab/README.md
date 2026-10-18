# Database thực hành: dữ liệu quan hệ

Đây là database học quan hệ và transaction với mô hình shop sáu bảng.
Database này dùng riêng với bài thực hành; API sản phẩm sử dụng database
`mini_shop` và schema trong `db/01-schema.sql`.

Thiết lập local trên Ubuntu đã chạy thành công ngày 2026-10-16 với role
`devuser`: schema, dữ liệu mẫu và truy vấn đọc đã hoạt động. Chạy lại lệnh
setup đã giữ nguyên số dòng hiện có.

## Môi trường riêng

- Dùng server PostgreSQL local dành cho việc học.
- Tạo database mới tên chính xác `mini_shop_relations_lab`, UTF-8.
- Role kết nối là `devuser`; role này cần sở hữu database hoặc có quyền tạo bảng.
- API tiếp tục dùng `mini_shop`; lệnh lab tự chọn `mini_shop_relations_lab`.
- Lệnh setup chỉ khởi tạo database rỗng, giữ dữ liệu đã có và dừng nếu gặp
  schema tạo dở. Không dùng lệnh setup để ghi đè hay reset database.
- Không đưa mật khẩu vào SQL, file thực hành hoặc chat.

Trong công cụ SQL, kết nối đến database quản trị `postgres` trên server local.
Xác nhận địa chỉ/cổng server đúng server thực hành, rồi tự chạy riêng lệnh:

```sql
CREATE DATABASE mini_shop_relations_lab
    OWNER devuser TEMPLATE template0 ENCODING 'UTF8';
```

Role cần có quyền CREATEDB hoặc là superuser. CREATE DATABASE không chạy
trong BEGIN/COMMIT. Sau đó mở một kết nối mới đến `mini_shop_relations_lab`.

## Thứ tự chạy

Trên Ubuntu/Linux, mở Terminal tại thư mục `JavaScript/mini-shop-api`.
Sau khi role và database đã được tạo, cách tiện nhất là:

```bash
npm run db:lab:setup
npm run db:lab:read
```

Lệnh setup dùng cấu hình kết nối local từ `.env` và chọn database lab.
Nếu schema và dữ liệu đã có, setup giữ nguyên dữ liệu. Schema tạo dở cần
được kiểm tra trước khi chạy tiếp; script sẽ dừng thay vì tự thay đổi nó.
Hai lệnh npm trên có thể chạy lại. Lệnh read chỉ đọc dữ liệu để đối chiếu
kết quả.

Các bước `psql` dưới đây dành cho lần khởi tạo thủ công khi database chưa có
bảng. Nếu đã chạy `npm run db:lab:setup`, dùng `npm run db:lab:read` để xem lại
dữ liệu; không chạy lại file schema hoặc seed.

1. Kiểm tra `SELECT current_database();` trả `mini_shop_relations_lab`.
2. Chạy nguyên `01-schema.sql` để tạo sáu bảng và các ràng buộc.
3. Chạy nguyên `02-seed.sql` để thêm dữ liệu hoàn toàn giả định.
4. Chạy nguyên `03-read.sql` để đọc số dòng, chi tiết đơn và tổng tiền.

Trong pgAdmin: chọn database mới, mở Query Tool, mở từng file SQL và chạy toàn
bộ file theo thứ tự. Chọn đúng database trước mỗi lần mở Query Tool. Nếu file
báo lỗi, dừng; nếu session còn transaction lỗi, chạy ROLLBACK trước khi sửa.

Với `psql` trên Ubuntu/Linux, dùng các lệnh sau tại thư mục API.
Nhập mật khẩu tại prompt của `psql`:

```bash
psql -X -h 127.0.0.1 -U devuser -W -d mini_shop_relations_lab -v ON_ERROR_STOP=1 -c 'SELECT current_database();'
psql -X -h 127.0.0.1 -U devuser -W -d mini_shop_relations_lab -v ON_ERROR_STOP=1 -f practice/relations-lab/01-schema.sql
psql -X -h 127.0.0.1 -U devuser -W -d mini_shop_relations_lab -v ON_ERROR_STOP=1 -f practice/relations-lab/02-seed.sql
psql -X -h 127.0.0.1 -U devuser -W -d mini_shop_relations_lab -v ON_ERROR_STOP=1 -f practice/relations-lab/03-read.sql
```

Chỉ khi lệnh schema thành công, chạy lại lệnh `-f` với `02-seed.sql`, rồi
`03-read.sql`. Chưa có database thì tạo bằng công cụ quản trị hoặc mở psql với
`-d postgres` và tự chạy lệnh CREATE DATABASE ở trên. Không dùng `-1`:
các file đã tự bao BEGIN/COMMIT. `-X` bỏ startup script của psql;
`ON_ERROR_STOP=1` dừng file ngay khi gặp lỗi.

## Điều cần đọc trong schema

Bài tiếp theo là [thực hành transaction từng bước](transaction-workshop.md).
Code mẫu `transaction-demo.mjs` chạy bằng:

```bash
npm run db:lab:transaction -- commit
npm run db:lab:transaction -- rollback
```

Mỗi lượt COMMIT lưu thêm một đơn có hai dòng hàng. Lượt ROLLBACK cố ý gây
lỗi quantity=0 ở dòng hàng thứ hai và hủy cả đơn/dòng đầu của lượt đó.

- IDENTITY sinh ID; PRIMARY KEY bảo đảm ID duy nhất và không NULL.
- NOT NULL chặn giá trị NULL; CHECK kiểm tra giá trị.
- FK bảo đảm liên kết hợp lệ; ON DELETE RESTRICT chặn xóa dòng đang được tham chiếu.
- UNIQUE (order_id, product_id) giới hạn một sản phẩm một dòng trong mỗi đơn.
- Giá là INTEGER theo đơn vị VND nguyên đồng, cùng quy ước với schema API
  trong `db/01-schema.sql`.
- Email khách có thể NULL và không mặc định duy nhất. Bài này quản lý khách,
  chưa quy định tài khoản đăng nhập.
- Kiểm tra chuỗi bằng btrim chặn chuỗi rỗng/chỉ dấu cách; chưa xử lý mọi dạng
  khoảng trắng hoặc chuẩn hóa email, tên danh mục.

`orders` giữ thông tin giao hàng lúc mua; `order_items` giữ tên và giá lúc mua.
Khi ứng dụng chọn địa chỉ giao, phải kiểm tra địa chỉ thuộc khách đặt đơn.
FK không bảo đảm một đơn có ít nhất một dòng; luồng tạo đơn sẽ xử lý sau.

## Đối chiếu kết quả

Ngay sau lần seed đầu, số dòng kỳ vọng: customers 2; customer_addresses 2; categories 2;
products 2; orders 2; order_items 3.

Khách mẫu A: 3 áo giá mua 100000 + 1 mũ giá mua 50000 = 350000 VND.
Khách mẫu B: 2 áo giá mua 100000 = 200000 VND.
Giá bán hiện tại của áo là 120000, khác giá mua 100000.
Không giả định các ID là 1, 2 hoặc 101: xem ID thực tế ở kết quả SELECT.

Các file chỉ chạy trên database mới. Schema cố ý không có IF NOT EXISTS và
seed từ chối chạy khi có dữ liệu. Mỗi file có kiểm tra tên database bên trong
transaction; chạy nhầm sẽ phát sinh lỗi trước khi thay đổi bảng/dữ liệu.
Luôn chạy nguyên file để giữ kiểm tra này.

## Nguồn PostgreSQL

- [CREATE DATABASE](https://www.postgresql.org/docs/18/sql-createdatabase.html)
- [Identity columns](https://www.postgresql.org/docs/18/ddl-identity-columns.html)
- [Constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
- [psql](https://www.postgresql.org/docs/18/app-psql.html)
- [Aggregate functions](https://www.postgresql.org/docs/18/functions-aggregate.html)
