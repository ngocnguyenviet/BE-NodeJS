# Hợp đồng API — Mini Shop API

Tài liệu mô tả hành vi hiện tại; đề xuất thay đổi nằm riêng ở cuối.

Nội dung được đối chiếu với routes, middleware, controller và service hiện tại. Các ví dụ là dữ liệu minh họa, không khẳng định sản phẩm tương ứng đang có trong database. Việc viết tài liệu không thực hiện request hay thay đổi database.

## 1. Phạm vi

Bảy endpoint được mô tả:

- `GET /health`
- `GET /products`
- `GET /products/:id`
- `GET /products/:id/price`
- `POST /products`
- `PATCH /products/:id/price`
- `DELETE /products/:id`

Đường dẫn trong tài liệu là đường dẫn tương đối với địa chỉ server đang chạy. Cổng phụ thuộc cấu hình của server.

## 2. Quy tắc chung

### 2.1. Request và JSON

- Với `POST /products` và `PATCH /products/:id/price`, gửi body là JSON object với header `Content-Type: application/json`.
- Trường number trong JSON phải được gửi dưới dạng số, ví dụ `12000`. Giá trị `"12000"` là string và không đáp ứng validation giá trong body.
- Body JSON được xử lý trước các route, với giới hạn `10kb`.
- Parser JSON hiện dùng chế độ strict mặc định: JSON có giá trị ngoài cùng là object hoặc array có thể đi qua parser; các giá trị ngoài cùng như `null`, string hoặc number bị từ chối tại parser. Array vẫn bị validation của hai endpoint ghi dữ liệu từ chối.
- Thiếu body, body rỗng hoặc body không được parser JSON xử lý sẽ không đáp ứng các trường bắt buộc của hai endpoint ghi dữ liệu, và nhận lỗi validation `400` nếu request đã đi tới middleware tương ứng.
- `GET` và `DELETE` trong tài liệu không yêu cầu body. Parser JSON vẫn chạy trước các route nếu request có body phù hợp để xử lý.
- Các query không được endpoint đọc sẽ không tham gia xử lý. Validation body hiện không từ chối trường thừa; controller chỉ sử dụng những trường được mô tả cho endpoint.

### 2.2. Cấu trúc sản phẩm trong response

Các truy vấn sản phẩm chọn hoặc trả về ba trường:

- `id`: ID sản phẩm.
- `name`: tên sản phẩm.
- `price`: giá sản phẩm.

Trong tài liệu, **Product** là object có ba trường này. **ProductPrice** là object có hai trường `id` và `price`.

Controller gửi các giá trị lấy từ database trực tiếp, không chuyển kiểu trước khi trả JSON. Kiểu JSON thực tế của `id`, `name`, `price`, cũng như khả năng nhận `null`, chưa được xác minh bằng schema database hoặc response thực tế trong lần lập tài liệu này. Giới hạn validation đầu vào không đủ để khẳng định toàn bộ kiểu dữ liệu đầu ra.

Ví dụ dưới đây minh họa Product trong trường hợp `id` và `price` được trả dưới dạng number, `name` dưới dạng string:

```json
{
  "id": 1,
  "name": "Bút",
  "price": 12000
}
```

Các response thành công gửi trực tiếp object hoặc mảng được mô tả. Hiện không có object bọc chung như `{ "data": ... }`.

Đơn vị tiền của `price` chưa được khai báo trong các file source đã đối chiếu.

### 2.3. Quy tắc ID dùng chung

Áp dụng cho các endpoint có `:id`:

- ID được đọc từ path param và chuyển bằng `Number(...)`.
- Giá trị sau chuyển đổi phải là số nguyên từ `1` đến `2147483647`, bao gồm hai đầu mút.
- Validation hiện kiểm tra giá trị số, không giới hạn cách viết chỉ gồm chữ số thập phân. Ví dụ `1e2` được chuyển thành `100` và có thể vượt qua validation.
- ID hợp lệ về giá trị chưa có nghĩa là sản phẩm tồn tại.

ID không hợp lệ nhận `400` với body:

```json
{
  "error": "ID phải là số nguyên dương thuộc khoảng 1 đến 2147483647"
}
```

Trường `error` là string. Response này không có trường `code`.

### 2.4. Lỗi dùng chung

Các lỗi sau có thể xảy ra ngoài các lỗi riêng của từng endpoint.

**Body JSON sai cú pháp hoặc bị parser JSON strict từ chối:** status `400`.

```json
{
  "code": "INVALID_JSON",
  "error": "Body phải là JSON hợp lệ"
}
```

`code` và `error` đều là string.

**Body vượt giới hạn parser JSON `10kb`:** status `413`.

```json
{
  "error": "Body vượt quá giới hạn 10kb"
}
```

**Request đi tới fallback vì chưa được route xử lý:** status `404`. Ví dụ đường dẫn `/unknown`:

```json
{
  "path": "/unknown",
  "error": "Route không tồn tại"
}
```

`path` là string lấy từ đường dẫn request, không bao gồm query string; `error` là string. Response này không có `code`.

**Lỗi được đưa tới error handler nhưng không thuộc các nhánh JSON hoặc AppError được xử lý riêng:** status `500`.

```json
{
  "error": "Lỗi server"
}
```

Ví dụ lỗi truy vấn database được đưa tới error handler sẽ nhận response này.

Nếu parser JSON từ chối request, việc xử lý dừng trước validation ID, query hoặc body của endpoint. Khi nhiều đầu vào cùng sai, client không nhận danh sách tất cả lỗi cùng lúc.

## 3. GET /health

**Mục đích:** Cho biết ứng dụng có thể trả lời request tại endpoint health. Handler hiện không truy vấn database.

**Request:** Không có path params; không sử dụng query; không yêu cầu body.

**Thành công:** Status `200`; body là object có trường `status`, kiểu string, giá trị `"ok"`.

```json
{
  "status": "ok"
}
```

**Lỗi:** Handler không có nhánh lỗi nghiệp vụ riêng. Các lỗi dùng chung ở mục 2.4 vẫn áp dụng khi phát sinh trước handler.

## 4. GET /products

**Mục đích:** Lấy danh sách sản phẩm, hỗ trợ lọc khoảng giá và phân trang.

**Request:** Không có path params; không yêu cầu body. Các query sau đều tùy chọn:

- `page`: mặc định `1`. Khi được cung cấp, phải là một string không rỗng sau `trim()`. Sau `Number(...)`, phải là số nguyên an toàn từ `1`.
- `limit`: mặc định `10`. Khi được cung cấp, phải là một string không rỗng sau `trim()`. Sau `Number(...)`, phải là số nguyên an toàn từ `1` đến `100`.
- `minPrice`: không có mặc định. Khi được cung cấp, phải là một string không rỗng sau `trim()`. Sau `Number(...)`, phải là số hữu hạn, không âm.
- `maxPrice`: không có mặc định. Quy tắc kiểu và giá trị giống `minPrice`.

**Quy tắc lọc và phân trang:**

- Chỉ có `minPrice`: lấy sản phẩm có `price >= minPrice`.
- Chỉ có `maxPrice`: lấy sản phẩm có `price <= maxPrice`.
- Có cả hai: áp dụng cả hai điều kiện; yêu cầu `minPrice <= maxPrice`.
- Hai đầu mút bằng nhau được chấp nhận.
- Bộ lọc giá chấp nhận số thập phân; không áp dụng giới hạn số nguyên của trường `price` trong body.
- Không có bộ lọc giá: không lọc theo giá.
- Sắp xếp theo `id` tăng dần trước khi phân trang.
- Tính `offset = (page - 1) * limit`; `offset` phải là số nguyên an toàn.
- Các query số dùng `Number(...)`; code hiện không yêu cầu cách viết chỉ gồm chữ số thập phân.
- Query lặp cùng tên có thể được parser biểu diễn thành array; validation yêu cầu từng query trên là string, nên giá trị array sẽ bị từ chối.

Ví dụ request:

```http
GET /products?minPrice=10000&maxPrice=50000&page=2&limit=3
```

Request này lọc khoảng giá gồm hai đầu mút, bỏ qua ba sản phẩm đầu trong kết quả đã sắp xếp, rồi lấy tối đa ba sản phẩm tiếp theo.

**Thành công:** Status `200`; body là mảng Product.

Ví dụ minh họa theo giả định kiểu dữ liệu ở mục 2.2:

```json
[
  {
    "id": 4,
    "name": "Bút",
    "price": 12000
  }
]
```

Khi không có sản phẩm trong trang được yêu cầu, body là `[]` và status vẫn là `200`.

Response hiện không có `page`, `limit`, `total`, `totalPages` hoặc `hasNext`. Số phần tử trong mảng không vượt quá `limit`; có thể ít hơn `limit`.

**Lỗi validation:** Tất cả trường hợp dưới đây trả `400`, body là `{ "error": "thông báo tương ứng" }`, với `error` là string:

- `page` không phải string không rỗng, hoặc giá trị chuyển đổi không phải số nguyên an toàn từ `1`: `"page phải là số nguyên dương"`.
- `limit` không phải string không rỗng: `"limit phải là số nguyên dương"`.
- `limit` sau chuyển đổi không phải số nguyên an toàn trong khoảng `1..100`: `"limit phải là số nguyên dương thuộc từ 1 đến 100"`.
- `maxPrice` không phải string không rỗng, hoặc chuyển đổi không thành số hữu hạn không âm: `"maxPrice phải là số không âm"`.
- `minPrice` không phải string không rỗng, hoặc chuyển đổi không thành số hữu hạn không âm: `"minPrice phải là số không âm"`.
- `minPrice > maxPrice`: `"minPrice phải nhỏ hơn maxPrice"`.
- `offset` không phải số nguyên an toàn: `"Giá trị phân trang quá lớn"`.

Controller kiểm tra theo thứ tự `page`, `limit`, `maxPrice`, `minPrice`, quan hệ hai đầu mút, rồi `offset`. Trường hợp lỗi được phát hiện trước sẽ được trả trước. Các lỗi dùng chung cũng áp dụng.

## 5. GET /products/:id

**Mục đích:** Lấy thông tin một sản phẩm theo ID.

**Request:** Path param `id` bắt buộc, theo mục 2.3; không sử dụng query; không yêu cầu body.

Ví dụ đường dẫn: `GET /products/1`.

**Thành công:** Status `200`; body là một Product, với cấu trúc và ví dụ ở mục 2.2.

**Lỗi:**

- ID không hợp lệ: `400`, body theo mục 2.3.
- ID hợp lệ nhưng không có sản phẩm: `404`, body dưới đây.
- Các lỗi dùng chung ở mục 2.4.

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "error": "Không tìm thấy sản phẩm"
}
```

`code` và `error` đều là string.

## 6. GET /products/:id/price

**Mục đích:** Lấy ID và giá của một sản phẩm.

**Request:** Path param `id` bắt buộc, theo mục 2.3; không sử dụng query; không yêu cầu body.

Ví dụ đường dẫn: `GET /products/1/price`.

**Thành công:** Status `200`; body là một ProductPrice, gồm `id` và `price`, không có `name`. Kiểu đầu ra cần xác minh như mục 2.2.

Ví dụ minh họa:

```json
{
  "id": 1,
  "price": 12000
}
```

**Lỗi:**

- ID không hợp lệ: `400`, body theo mục 2.3.
- ID hợp lệ nhưng không có sản phẩm: `404`, body dưới đây.
- Các lỗi dùng chung ở mục 2.4.

```json
{
  "error": "Không tìm thấy sản phẩm"
}
```

`error` là string. Nhánh này hiện không có trường `code`.

## 7. POST /products

**Mục đích:** Tạo một sản phẩm.

**Request:** Không có path params; không sử dụng query. Body JSON object có hai trường bắt buộc:

- `name`: string. Sau `trim()`, độ dài phải từ `1` đến `50`, tính bằng `.length` của string JavaScript.
- `price`: number nguyên từ `0` đến `2147483647`, bao gồm hai đầu mút.

Trường thừa không bị validation từ chối và không được controller chuyển cho thao tác tạo sản phẩm. Tên được `trim()` trước khi lưu.

Ví dụ body hợp lệ:

```json
{
  "name": "Bút",
  "price": 12000
}
```

**Thành công:** Status `201`; body là Product được trả về từ thao tác tạo, gồm `id`, `name`, `price`. Cấu trúc và ví dụ ở mục 2.2. Handler hiện không đặt header `Location`.

**Lỗi validation:** Nếu body đã qua parser nhưng thiếu trường bắt buộc, sai kiểu hoặc không đáp ứng giới hạn trên, trả `400`:

```json
{
  "error": "Dữ liệu sản phẩm không hợp lệ"
}
```

`error` là string. Các lỗi dùng chung ở mục 2.4 cũng áp dụng, bao gồm lỗi database.

## 8. PATCH /products/:id/price

**Mục đích:** Cập nhật giá của một sản phẩm theo ID.

**Request:** Path param `id` bắt buộc, theo mục 2.3; không sử dụng query. Body JSON object có trường bắt buộc:

- `price`: number nguyên từ `0` đến `2147483647`, bao gồm hai đầu mút.

Trường thừa không bị validation từ chối và không tham gia cập nhật. Ví dụ gửi thêm `name` sẽ không cập nhật tên sản phẩm.

Ví dụ body hợp lệ:

```json
{
  "price": 15000
}
```

**Thành công:** Status `200`; body là Product sau cập nhật, gồm đủ `id`, `name`, `price`. Cấu trúc ở mục 2.2.

**Lỗi:**

- ID không hợp lệ: `400`, body theo mục 2.3.
- Body đã qua parser nhưng không đáp ứng validation giá: `400`, body `{ "error": "Dữ liệu sản phẩm không hợp lệ" }`.
- ID hợp lệ, body hợp lệ nhưng không có sản phẩm: `404`, body `{ "error": "Không tìm thấy sản phẩm" }`.
- Các lỗi dùng chung ở mục 2.4.

`error` trong hai response body trên là string; cả hai không có `code`.

Sau parser JSON, middleware ID chạy trước middleware giá. Thao tác cập nhật database chỉ được gọi khi cả ID và body đã qua validation.

## 9. DELETE /products/:id

**Mục đích:** Xóa một sản phẩm theo ID.

**Request:** Path param `id` bắt buộc, theo mục 2.3; không sử dụng query; không yêu cầu body.

Ví dụ đường dẫn: `DELETE /products/1`.

**Thành công:** Status `200`; body là Product vừa bị xóa, gồm `id`, `name`, `price`. Cấu trúc ở mục 2.2. Hiện không trả `204` hoặc body rỗng khi xóa thành công.

**Lỗi:**

- ID không hợp lệ: `400`, body theo mục 2.3.
- ID hợp lệ nhưng không có sản phẩm để xóa: `404`, body dưới đây.
- Các lỗi dùng chung ở mục 2.4.

```json
{
  "error": "Không tìm thấy sản phẩm"
}
```

`error` là string. Response này không có `code`.

## 10. Điểm cần làm rõ và đề xuất

Các nội dung dưới đây là nhận xét và đề xuất; chưa được triển khai trong ứng dụng.

### 10.1. Cấu trúc lỗi chưa thống nhất

- Hiện tại: `GET /products/:id` trả lỗi không tìm thấy với `code` và `error`; GET giá, PATCH giá và DELETE chỉ có `error`. Lỗi JSON sai cú pháp có `code`; các lỗi validation khác hiện không có `code`.
- Vị trí: `src/controllers/product.controller.mjs` và `src/middlewares/error-handler.middleware.mjs`.
- Ảnh hưởng: client không thể giả định mọi response lỗi đều có `code`.
- Đề xuất: thống nhất quy tắc trường lỗi và mã lỗi trước khi thay đổi code, sau đó cập nhật tài liệu. Chưa lựa chọn một envelope response mới trong bài này.

### 10.2. Thông báo khoảng giá chưa khớp điều kiện

- Hiện tại: code chỉ từ chối `minPrice > maxPrice`, nhưng thông báo nói `minPrice phải nhỏ hơn maxPrice`.
- Vị trí: `getProducts` trong `src/controllers/product.controller.mjs`.
- Ảnh hưởng: người đọc thông báo có thể hiểu nhầm rằng hai đầu mút bằng nhau bị từ chối.
- Đề xuất: điều chỉnh thông báo để mô tả đúng quy tắc `minPrice <= maxPrice` đang được áp dụng.

### 10.3. Kiểu dữ liệu đầu ra và đơn vị giá cần xác minh

- Hiện tại: controller gửi trực tiếp các giá trị của row từ database; các file đã đọc chưa cung cấp schema hoặc response thực tế để xác nhận đầy đủ kiểu JSON và nullability. Đơn vị tiền chưa được khai báo.
- Vị trí: `src/services/product.service.mjs` và `src/controllers/product.controller.mjs`.
- Ảnh hưởng: client cần kiểu JSON và đơn vị rõ ràng để hiển thị, tính toán hoặc định dạng giá.
- Đề xuất: đối chiếu schema hoặc response đã quan sát, rồi ghi kiểu, nullability và đơn vị đã xác nhận vào mục 2.2. Nếu chọn chuyển kiểu trong ứng dụng, cần đánh giá ảnh hưởng tới client trước.

### 10.4. Danh sách chưa có thông tin tổng số trang

- Hiện tại: response là mảng; chưa có truy vấn tổng số sản phẩm hoặc metadata phân trang.
- Vị trí: `listProducts` trong `src/services/product.service.mjs` và `getProducts` trong controller.
- Ảnh hưởng: client không nhận trực tiếp tổng số sản phẩm, tổng số trang hoặc thông báo chắc chắn còn trang tiếp theo.
- Đề xuất: chỉ bổ sung khi có yêu cầu từ client. Nếu đổi mảng thành object chứa `items` và metadata, phải xem đó là thay đổi cấu trúc hợp đồng và cập nhật phía client tương ứng.

### 10.5. Cách viết tham số số và trường thừa

- Hiện tại: path ID và các query số dùng `Number(...)`; body hợp lệ có trường thừa vẫn được chấp nhận, nhưng trường thừa không được sử dụng.
- Vị trí: `src/middlewares/product-id.middleware.mjs`, `getProducts` trong controller và các middleware validation body.
- Ảnh hưởng: tài liệu không thể hứa chỉ nhận chuỗi chữ số hoặc tự động từ chối trường body không được khai báo.
- Đề xuất: thống nhất yêu cầu này khi cần; nếu thay đổi validation, cập nhật hợp đồng và đánh giá các request mà client hiện đang gửi.

## 11. Nguồn đối chiếu

- [Cấu hình app và fallback](../src/app.mjs)
- [Routes health](../src/routes/health.routes.mjs)
- [Controller health](../src/controllers/health.controller.mjs)
- [Routes sản phẩm](../src/routes/product.routes.mjs)
- [Controller sản phẩm](../src/controllers/product.controller.mjs)
- [Validation ID](../src/middlewares/product-id.middleware.mjs)
- [Validation tạo sản phẩm](../src/middlewares/product-create.middleware.mjs)
- [Validation giá](../src/middlewares/product-price.middleware.mjs)
- [Error handler](../src/middlewares/error-handler.middleware.mjs)
- [AppError](../src/errors/app-error.mjs)
- [Service sản phẩm](../src/services/product.service.mjs)

Quy tắc parser JSON strict được đối chiếu với dependency đang cài tại `node_modules/body-parser/lib/types/json.js`. Chưa chạy server, kiểm thử HTTP hoặc truy vấn database để xác minh tài liệu này.
