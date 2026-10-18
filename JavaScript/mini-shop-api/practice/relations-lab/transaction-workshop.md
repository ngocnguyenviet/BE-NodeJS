# Thực hành COMMIT và ROLLBACK bằng Node.js

Mục tiêu: thêm một đơn hàng và hai dòng hàng trong cùng transaction. Lượt
COMMIT giữ cả ba dòng; lượt ROLLBACK hủy cả đơn và dòng hàng đã thêm thành công.
Đây là ví dụ nhỏ để học transaction; phần tạo đơn API đầy đủ là bước sau.

## Chuẩn bị

Mở Terminal ở `JavaScript/mini-shop-api`. Database lab đã có schema và dữ liệu.
Không cần khởi động Express để chạy ví dụ này.

```bash
npm run db:lab:read
```

Code mẫu có đánh số bước nằm trong `transaction-demo.mjs`. Bạn có thể gõ từng
đoạn vào `transaction-practice.mjs` cùng thư mục để luyện, rồi chạy từ thư mục API:

```bash
node --env-file=.env practice/relations-lab/transaction-practice.mjs commit
```

## Bước 1: chọn database và tình huống

```js
import pg from "pg";

const mode = process.argv[2];
const pool = new pg.Pool({
    database: "mini_shop_relations_lab",
    connectionTimeoutMillis: 5000,
});
```

`--env-file=.env` cung cấp host, port, role, password. `database` ở đây ghi đè
PGDATABASE của API để bài học luôn chạy trên lab. `process.argv[2]` lấy đối số
`commit` hoặc `rollback`; đây là cách demo chọn dữ liệu đầu vào.

## Bước 2: viết vòng đời transaction

Khung quan trọng nhất (đặt trong hàm async):

```js
const client = await pool.connect();
try {
    await client.query("BEGIN");
    // Lấy dữ liệu, thêm orders và order_items bằng client.query tại đây.
    await client.query("COMMIT");
} catch (error) {
    await client.query("ROLLBACK");
    throw error;
} finally {
    client.release();
}
```

Dùng cùng `client` trong transaction. `client.release()` trả kết nối cho pool;
nó không có nghĩa là COMMIT. Trong script chạy một lần, đóng `pool.end()` tại
cuối chương trình, kể cả khi kết nối lỗi. API không đóng pool sau mỗi request.

Bản demo có thêm phần nhận biết lỗi được cố ý tạo và đọc dữ liệu sau transaction.
Với lỗi ngoài dự kiến, script vẫn báo thất bại và kết thúc với mã lỗi khác 0.

## Bước 3: lấy dữ liệu và INSERT đơn

Đọc phần Bước 2–3 của file mẫu. Demo chọn một địa chỉ của khách đang hoạt động
và hai sản phẩm đang hoạt động. Nó dùng ID thực tế từ SELECT.

```js
const orderResult = await client.query(`
    INSERT INTO public.orders (
        customer_id, recipient_name, recipient_phone, shipping_address
    ) VALUES ($1, $2, $3, $4)
    RETURNING id
`, [address.customer_id, address.recipient_name, address.recipient_phone, address.address_text]);

orderId = orderResult.rows[0].id;
```

`$1`…`$4` là các vị trí nhận giá trị trong mảng. `RETURNING id` trả ID vừa sinh
để bước sau liên kết các dòng hàng với đơn này. Thông tin giao hàng được chụp
từ địa chỉ tại lúc tạo đơn.

## Bước 4: INSERT hai dòng hàng

Đọc phần Bước 4 trong file mẫu:

```js
for (const [index, product] of productsResult.rows.entries()) {
    const quantity = mode === "rollback" && index === 1 ? 0 : 1;
    await client.query(`
        INSERT INTO public.order_items (
            order_id, product_id, product_name, quantity, unit_price
        ) VALUES ($1, $2, $3, $4, $5)
    `, [orderId, product.id, product.name, quantity, product.price]);
}
```

Lượt `commit`: cả hai dòng đều có quantity = 1. Lượt `rollback`: dòng thứ nhất
hợp lệ, dòng thứ hai có quantity = 0. Database từ chối dòng thứ hai do CHECK
(quantity > 0), trả SQLSTATE 23514, và JavaScript chuyển vào catch.

Tên và giá mua được lấy từ dữ liệu sản phẩm của server, rồi lưu vào dòng hàng.
Hai sản phẩm khác nhau đáp ứng UNIQUE (order_id, product_id).

## Bước 5: chạy COMMIT

```bash
npm run db:lab:transaction -- commit
```

Trong transaction sau dòng hàng đầu: `orders_found = 1`, `items_found = 1`.
Sau COMMIT: `orders_found = 1`, `items_found = 2`. Dữ liệu đã lưu và lượt chạy
commit tiếp theo sẽ thêm một đơn mới. Ghi lại order_id được in ra.

## Bước 6: chạy ROLLBACK

```bash
npm run db:lab:transaction -- rollback
```

Bạn sẽ thấy dòng đầu INSERT thành công, tiếp theo lỗi quantity của dòng hai.
Sau ROLLBACK: `orders_found = 0`, `items_found = 0` cho order_id vừa in ra.
Đơn từ lượt COMMIT trước vẫn còn. ROLLBACK chỉ hủy transaction đang mở.

## Kiểm tra độc lập bằng psql

```bash
psql -h 127.0.0.1 -U devuser -d mini_shop_relations_lab -W
```

Nhập mật khẩu trong `.env`, sau đó thay `123` bằng order_id từ mỗi lượt chạy:

```sql
SELECT * FROM public.orders WHERE id = 123;
SELECT * FROM public.order_items WHERE order_id = 123;
```

Có thể dùng `npm run db:lab:read` để xem toàn bộ dữ liệu. Sau một COMMIT đầu
tiên và một ROLLBACK, lab từ 2 đơn/3 dòng hàng thành 3 đơn/5 dòng hàng.
Con số này tăng nếu bạn chạy COMMIT thêm.

ID có thể bị nhảy sau ROLLBACK: sequence sinh identity không lùi lại.
Biến JavaScript orderId vẫn giữ số đã nhận; số đó không bảo đảm dòng còn lưu.

## Tự kiểm tra

1. Dòng hàng đầu đã INSERT thành công, vì sao sau ROLLBACK không còn nữa?
2. `client.release()` có thay cho COMMIT được không?
3. Nếu bỏ BEGIN nhưng vẫn INSERT tuần tự, lỗi dòng thứ hai có tự hủy đơn không?

## Nguồn

- [node-postgres: Transactions](https://node-postgres.com/features/transactions)
- [PostgreSQL 18: Transactions](https://www.postgresql.org/docs/18/tutorial-transactions.html)
- [PostgreSQL 18: Sequence functions](https://www.postgresql.org/docs/18/functions-sequence.html)
