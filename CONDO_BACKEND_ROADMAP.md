# Apartment management backend roadmap

Lộ trình đề xuất ngày 2026-10-18, dựa trên ảnh danh sách tính năng của nhóm và tiến độ học BE-NodeJS. Đây là đề xuất để nhóm thảo luận, chưa phải lựa chọn công nghệ hay phạm vi đã được nhóm chốt. Nhóm xác nhận có 2 người backend và gần 3 tháng đến hạn nộp/demo. Lịch bên dưới quy ước khoảng 12 tuần, chưa phải ngày deadline chính thức. Chưa chốt số giờ làm mỗi tuần, trình độ người còn lại và mức tích hợp thiết bị/cổng thanh toán.

## 1. Điểm xuất phát

- Đã thực hành JavaScript, async/await, HTTP, Express, CRUD, PostgreSQL, JOIN, parameterized queries, validation, controller/service, middleware và transaction.
- Đã tự viết createOrder(pool, { customerId, addressId, items }) trong lab: kiểm tra đầu vào, từ chối productId trùng, kiểm tra quan hệ địa chỉ–khách, lấy tên/giá từ DB, INSERT đơn và dòng hàng trên cùng client, COMMIT hoặc ROLLBACK, release client. Caller quản lý pool/log/exit code.
- Ảnh người học cung cấp xác nhận order21 và item28/29 đã lưu qua script kiểm tra riêng. Bài thử lỗi chủ động sau INSERT trước COMMIT mới được hướng dẫn, chưa có kết quả xác nhận. Không đánh dấu bài đó hoàn tất.
- Lab vẫn dùng mini_shop_relations_lab; API mini-shop vẫn dùng mini_shop. Khi bắt đầu chung cư, tạo project/database riêng theo kế hoạch; không đổi lab hoặc mini-shop thành ứng dụng chung cư trong lúc học.

## 2. Stack đề xuất

| Thành phần | Đề xuất | Vai trò / thời điểm |
|---|---|---|
| Runtime | Node.js bản LTS còn được hỗ trợ | Dùng cùng major version trong nhóm và môi trường deploy |
| HTTP | Express 5, REST API | Tiếp nối kiến thức hiện tại |
| Ngôn ngữ | TypeScript cho project nhóm nếu lịch cho phép | Học type/interface, union, narrowing, async return types, strict, build; không cần học toàn bộ TypeScript trước |
| Database | PostgreSQL | Quan hệ, lịch sử, hóa đơn, ràng buộc và transaction |
| DB access | pg + SQL tham số hóa | Tiếp tục hiểu SQL; chọn một công cụ migration có version, không sửa schema thủ công trên từng máy |
| Validation | Zod | Kiểm tra request tại runtime; TypeScript không thay thế việc này |
| Authentication | Session phía server + cookie cho web trình duyệt | Lưu session ở DB/store phù hợp, cookie HttpOnly/Secure/SameSite, CSRF; không dùng MemoryStore mặc định ở production |
| API contract | OpenAPI + ví dụ request/response | Frontend và backend thống nhất trước khi làm độc lập |
| Verification | node:test + HTTP/database integration tests | Bắt đầu cùng module đầu tiên, tăng ca kiểm thử theo nghiệp vụ |
| Deployment | CI, HTTPS, PostgreSQL, migration, log, backup | Deploy thử từ bản nhỏ; Docker Compose là lựa chọn hỗ trợ môi trường chung |

Kiến trúc ban đầu: một ứng dụng backend chia module nghiệp vụ, một database quan hệ; route → middleware → controller → service → SQL. Service không phụ thuộc req/res. Các hàm SQL trong một transaction phải nhận cùng client nếu sau này tách repository. Không cần microservices, Kubernetes, Redis hay message broker ở bản đầu. Chỉ thêm queue/Redis khi nhu cầu gửi nền, retry hoặc nhiều instance thực sự xuất hiện.

NestJS là lựa chọn khác khi nhóm muốn cấu trúc module và dependency injection theo framework, đã có người hiểu TypeScript/Nest hoặc đủ thời gian học. Nó vẫn chạy trên Node.js và mặc định dùng Express. Với người học đang tự làm chủ service/SQL, Express + TypeScript là khuyến nghị hiện tại, không đổi framework chỉ vì danh sách tính năng dài. Chưa đề xuất ORM là yêu cầu bắt buộc; nếu nhóm chọn ORM sau này, vẫn phải giữ kiến thức SQL và transaction.

## 3. Những điều phải chốt trước ERD/API

1. Một tòa hay nhiều tòa? Cùng một tài khoản có thể quản lý nhiều tòa/căn hộ không?
2. Phân biệt chủ sở hữu, người thuê, người thực tế cư trú, đại diện hộ và tài khoản đăng nhập. Một người có thể mang nhiều vai trò.
3. Ai được cập nhật hộ dân cư? Chỉnh trực tiếp hay gửi yêu cầu để admin duyệt? Cư dân đã chuyển đi có được xem lịch sử hóa đơn nào?
4. Trạng thái mua nhà là cập nhật hồ sơ thủ công hay có quy trình giao dịch/hợp đồng? Bản đầu đề xuất quản lý trạng thái và lịch sử, chưa suy diễn thành hệ thống mua bán.
5. Điện/nước: chỉ số đầu/cuối, kỳ tính phí, biểu giá cố định hay bậc thang, hệ số đồng hồ, thay đồng hồ, hạn thanh toán, thời điểm chốt hóa đơn.
6. Thu tiền đầy đủ hay từng phần? Ai được xác nhận chuyển khoản? Có hoàn/hủy không? Thu hộ cho căn hộ khác có được phép không?
7. Bãi xe quản lý sức chứa tổng hay từng ô đỗ? Chỗ trống không đồng nghĩa số vé tháng còn bán được. Số liệu nhập tay, sự kiện mô phỏng hay thiết bị thật?
8. Tình trạng điện/thang máy/báo cháy là trạng thái do kỹ thuật viên nhập hay nhận sự kiện từ thiết bị? Ghi người cập nhật, nguồn sự kiện, thời điểm quan sát để phân biệt dữ liệu cũ.
9. Chỉ thông báo trong web hay thêm email/SMS/push? Ai nhận theo tòa/căn hộ/vai trò?

Các quyết định trên cần được ghi thành ví dụ và ma trận actor–action–resource, không chỉ một cột role.

## 4. Thứ tự học và làm

Mỗi chặng có thể gồm nhiều buổi/chat nhỏ. Kiểm thử, tài liệu API và triển khai thử được làm xuyên suốt; chặng 12 là mốc hoàn thiện, không phải đợi đến đó mới bắt đầu.

### Chặng 1 — Phân tích nghiệp vụ

- Học: use case, actor, luồng thành công/thất bại, trạng thái và chuyển trạng thái, invariant (điều kiện hệ thống phải luôn giữ đúng).
- Áp dụng: phân nhóm toàn bộ tính năng trong ảnh; phân biệt quyền vai trò và quyền đối với căn hộ cụ thể.
- Đầu ra: glossary, ma trận quyền, quyết định phạm vi, sơ đồ trạng thái hóa đơn/phản ánh/xe vào ra.
- Đạt khi: nhóm trả lời được ai làm gì, với dữ liệu nào, trường hợp nào bị từ chối.

### Chặng 2 — Nền project nhóm và TypeScript

- Học: type/interface, optional/null, union trạng thái, narrowing, Promise<T>, strict, unknown/error, build; runtime validation; cấu trúc module, dependency, cấu hình môi trường.
- Áp dụng: một module nhỏ với route/controller/service, lỗi thống nhất, phân trang, request ID và log. Git branch/PR, lint/format, lockfile và OpenAPI cơ bản.
- Đầu ra: server khởi động, health endpoint, config validation, một API đọc mẫu, test đầu tiên, bản deploy thử.
- Đạt khi: máy thành viên khác chạy từ README; không cần chia sẻ .env thật. TypeScript không dùng any cho toàn bộ dữ liệu DB/request.

### Chặng 3 — Thiết kế DB, migration và truy vấn

- Học: ERD, khóa ngoại, unique/check/not-null, bảng liên kết, index, migration/seed, tổng hợp GROUP BY, ngày giờ và khoảng thời gian hiệu lực.
- Áp dụng: buildings, floors, units, people, users; bảng liên kết chủ sở hữu/cư trú tách riêng. Chỉ lưu trường thực sự cần trong phạm vi nhóm.
- Đầu ra: tạo database rỗng bằng migration, seed demo, CRUD cấu trúc tòa–tầng–căn.
- Đạt khi: không có số căn trùng trong cùng phạm vi; quan hệ người–căn có lịch sử; không xóa cascade mất hóa đơn/lịch sử quan trọng.

### Chặng 4 — Đăng nhập, đăng xuất

- Học: băm/kiểm tra mật khẩu, session/cookie, hết hạn và thu hồi session, CSRF, rate limit đăng nhập, lỗi đăng nhập không tiết lộ quá nhiều thông tin.
- Áp dụng: AUTH-01/02; tài khoản demo được admin tạo/seed. Đăng ký công khai không có trong yêu cầu nên chưa tự thêm.
- Đầu ra: login, logout, me; khóa tài khoản; password không xuất hiện trong response/log.
- Đạt khi: logout làm session cũ không dùng được; người chưa đăng nhập bị chặn. Quên mật khẩu AUTH-03 là mở rộng với token một lần, hết hạn và luồng gửi thực.

### Chặng 5 — Phân quyền vai trò và phạm vi dữ liệu

- Học: authentication khác authorization; RBAC; kiểm tra quan hệ tài khoản–người–căn/tòa; phòng truy cập dữ liệu bằng cách đổi ID.
- Áp dụng: AUTH-04; admin, chủ sở hữu/cư dân, kỹ thuật viên, nhân sự và hộ kinh doanh theo phạm vi đã chốt.
- Đầu ra: middleware xác thực; policy trong service/truy vấn; test với tài khoản A/B khác căn.
- Đạt khi: A không đọc/sửa hóa đơn, cư dân, xe hoặc phản ánh của B chỉ bằng cách đổi path/body ID. Danh tính lấy từ session đã xác thực, không tin userId do frontend gửi. Đây là bước mở rộng ý tưởng addressId phải thuộc customerId đã học.

### Chặng 6 — Căn hộ, hộ dân cư và lịch sử

- Học: quan hệ nhiều–nhiều có thời gian, transaction nhiều bảng, quy trình cập nhật/duyệt, tránh ghi đè thay đổi đồng thời.
- Áp dụng: ROOM-01/02; chủ sở hữu, thành viên hộ, người thuê, chuyển đến/đi, trạng thái căn hộ.
- Đầu ra: tạo/cập nhật hộ, chuyển cư trú, lịch sử sở hữu/cư trú; phân trang/lọc theo tòa/tầng/căn.
- Đạt khi: chuyển người ở không làm mất lịch sử; người dùng chỉ được cập nhật phần thuộc quyền; các thay đổi liên quan cùng thành công hoặc cùng rollback.

### Chặng 7 — Chỉ số điện nước, biểu phí, hóa đơn và công nợ

- Học: kỳ hóa đơn, NUMERIC/số nguyên tiền VND với giới hạn rõ, đơn vị và quy tắc làm tròn; transaction; chống phát hành trùng; lưu snapshot giá; tổng hợp công nợ.
- Áp dụng: chỉ số điện/nước từng căn, phí tòa nhà và công nợ. Tiền thuê/sửa chữa có thể dùng chung cơ chế dòng hóa đơn ở chặng mở rộng.
- Đầu ra: meters, meter_readings, fee_rules, billing_periods, invoices, invoice_items; lập hóa đơn theo kỳ và xem số còn phải trả.
- Đạt khi: giữ được lịch sử biểu giá; chỉ số sai bị chặn; gọi tạo cùng kỳ hai lần không sinh hóa đơn trùng; tiền do backend tính. Số lượng đo lẻ phải dùng độ chính xác phù hợp, không ép mọi giá trị về integer.
- Ví dụ: chỉ số cuối 125, đầu 100 → tiêu thụ 25 đơn vị; kết quả tiền theo biểu giá nhóm đã chốt.

### Chặng 8 — Thanh toán, đối soát và xử lý đồng thời

- Học: payment khác invoice; trạng thái thanh toán; idempotency (gửi lặp vẫn một kết quả nghiệp vụ); unique external reference; khóa hàng/cập nhật có điều kiện; callback/webhook và xác minh nguồn; retry có kiểm soát.
- Áp dụng: thanh toán điện/nước, phí tòa; bắt đầu ghi nhận tiền mặt/chuyển khoản có người xác nhận, sau đó sandbox cổng thanh toán nếu thuộc phạm vi.
- Đầu ra: payments, payment_allocations nếu cần, payment_events; cập nhật thanh toán và số dư trong cùng transaction. Có audit người xác nhận, số tiền, thời điểm và mã tham chiếu.
- Đạt khi: hai request hoặc callback trùng không thu/ghi nhận hai lần; browser báo thành công không tự làm hóa đơn paid; lỗi giữa chừng không để trạng thái lệch. Quy tắc thu thiếu/thừa, hoàn/hủy phải được chốt trước.

### Chặng 9 — Thông báo, nhắc hạn, phản ánh

- Học: phân phối thông báo theo đối tượng, read/unread; công việc định kỳ; retry/chống gửi trùng; trạng thái nghiệp vụ; upload an toàn nếu có ảnh; audit log.
- Áp dụng: ANNC-01/02, ALRT-01, gửi phản ánh và admin tiếp nhận/xử lý.
- Đầu ra: announcements, notifications, tickets, ticket_comments/history; job nhắc hạn chạy lặp an toàn. Thông báo trong web trước; email/SMS theo phạm vi.
- Đạt khi: người đúng tòa nhận thông báo; nhắc hạn không gửi mãi cùng một nhắc; người dân theo dõi trạng thái phản ánh của mình. Không gửi email trong lúc giữ transaction thanh toán mở; có cơ chế ghi nhận công việc chờ gửi sau commit.

### Chặng 10 — Bãi xe và kỹ thuật tòa nhà

- Học: event vào/ra, state machine, transaction/cạnh tranh cập nhật, truy vấn sức chứa; asset/status history, thời điểm/nguồn trạng thái.
- Áp dụng bắt buộc theo ảnh: xe vào/ra, vé tháng/vé lượt, số chỗ trống từng hầm; tình trạng điện từng tầng.
- Đầu ra: parking_areas, vehicles, parking_passes, parking_sessions; assets, asset_status_history. Dùng sự kiện nhập tay/mô phỏng trước nếu nhóm chưa có tích hợp.
- Đạt khi: xe không có hai lượt gửi đang mở trái quy tắc; request trùng không tạo hai lượt; chỗ trống không âm; hai thao tác đồng thời không vượt sức chứa.
- Mở rộng: map ô đỗ khi đã có dữ liệu từng ô; trạng thái/cảnh báo thang máy và báo cháy. Website ghi nhận/truyền sự kiện theo tích hợp được thống nhất; điều khiển thiết bị và hệ thống báo cháy chuyên dụng là một phạm vi riêng cần đặc tả.

### Chặng 11 — Các module mở rộng trong ảnh

- Quên mật khẩu: token một lần, thời hạn, gửi mail, chống dò tài khoản.
- Phí sửa chữa: phiếu việc/chi phí → dòng hóa đơn → dùng luồng thanh toán chung.
- Hộ kinh doanh: hợp đồng thuê, kỳ thuê, phí định kỳ, đơn xin phép và quy trình duyệt.
- Nhân sự: nhân viên/vai trò công việc, ca trực, lịch phân công, kiểm tra ca trùng.
- Khách ra/vào: đăng ký khách, người bảo lãnh/căn hộ, check-in/out, phạm vi xem dữ liệu.
- Đạt khi: mỗi module bổ sung dùng lại auth/quyền/thanh toán/thông báo sẵn có, có trạng thái và quyền rõ ràng. Chỉ triển khai sau phần bắt buộc hoặc theo phân công độc lập đã thống nhất.

### Chặng 12 — Hoàn thiện kiểm thử và triển khai

- Học/làm xuyên suốt: unit test logic tiền/trạng thái, integration HTTP+PostgreSQL, kiểm tra phân quyền, transaction và gọi lặp/đồng thời; CI, môi trường test riêng, seed demo, OpenAPI.
- Vận hành: HTTPS, cookie/CORS/CSRF theo cách host frontend/backend, giới hạn request/upload, che dữ liệu nhạy cảm trong log, health check, shutdown trả kết nối, migration deploy, backup và thử restore.
- Đạt khi: nhóm tái tạo được ứng dụng từ repository; chạy lại được demo từ DB sạch; lỗi có dấu vết log; có test cho luồng quan trọng và hướng dẫn khôi phục dữ liệu.

## 5. Đối chiếu toàn bộ tính năng trong ảnh

Giữ nguyên mức ưu tiên người dùng cung cấp. Thứ tự giao bản bên dưới là đề xuất, không tự đổi Must have thành Nice to have.

| Tính năng | Ưu tiên ảnh | Chặng chính |
|---|---|---|
| Đăng nhập, đăng xuất | Must have | 4 |
| Quên mật khẩu | Nice to have | 11 |
| Phân quyền người dùng | Must have | 5 |
| Cập nhật hộ dân cư; trạng thái mua nhà | Must have | 6 |
| Chỉ số điện nước từng nhà | Must have | 7 |
| Tình trạng điện từng tầng | Must have | 10 |
| Tình trạng thang máy; tình trạng báo cháy | Nice to have | 10 mở rộng |
| Map trạng thái ô đỗ | Nice to have | 10 mở rộng |
| Số chỗ trống từng hầm; xe vào/ra và vé tháng/vé lượt | Must have | 10 |
| Theo dõi công nợ | Must have | 7–8 |
| Thanh toán phí điện nước; phí tòa nhà | Must have | 7–8 |
| Thanh toán hóa đơn sửa chữa | Nice to have | 11, tái dùng 7–8 |
| Cảnh báo hạn thanh toán | Must have | 9 |
| Cảnh báo thang máy; cháy nhà | Nice to have | 10 mở rộng + 9 |
| Đăng/nhận thông báo | Must have | 9 |
| Quản lý ca bảo vệ, lễ tân, lao công | Nice to have | 11 |
| Phí thuê hàng tháng của hộ kinh doanh | Nice to have | 11, tái dùng 7–8 |
| Đơn xin phép online | Nice to have | 11 |
| Feedback/phản ánh; tiếp nhận/xử lý đơn | Must have | 9 |
| Quản lý khách ra/vào | Nice to have | 11 |

## 6. Các mốc giao bản đề xuất

1. **Lát cắt đầu tiên:** admin tạo căn và liên kết tài khoản cư dân → cư dân đăng nhập → chỉ xem hồ sơ/căn mình. Có test A/B và deploy thử.
2. **Nghiệp vụ tài chính:** nhập số điện nước → lập hóa đơn → cư dân xem công nợ → xác nhận thanh toán → số dư thay đổi đúng; có rollback và chống lặp.
3. **Giao tiếp:** thông báo, nhắc hạn, phản ánh và xử lý; kiểm tra người nhận/quyền.
4. **Đủ nhóm tính năng bắt buộc trong ảnh:** bãi xe, số chỗ trống và tình trạng điện; tích hợp và kiểm thử tổng thể các nhóm trên.
5. **Mở rộng:** các Nice to have theo thời gian còn lại và yêu cầu giảng viên/khách hàng.

Bản lát cắt đầu tiên là mốc nội bộ, chưa được coi là đã đáp ứng toàn bộ Must have. Tích hợp thanh toán/thiết bị thật có phụ thuộc tài khoản, sandbox, thiết bị, tài liệu và quyền truy cập; không suy ra đã được cung cấp.

## 7. Cách tiếp tục học

- Kết thúc bài rollback service hiện tại rồi chuyển ví dụ sang chung cư. Không cần hoàn thành toàn bộ order API mini-shop trước nếu mục tiêu nhóm đã đổi.
- Mỗi chương kiến thức mới dùng một chat riêng theo sở thích đã lưu. Trong chương, giải thích vấn đề → người học tự viết một phần chạy được → review → mở rộng.
- Bắt đầu chương chung cư bằng phân tích actor/căn hộ/cư trú và vẽ ERD nhỏ. Chỉ tạo project/implementation khi người học yêu cầu.
- Điểm nối kiến thức: order/order_items → invoice/invoice_items; snapshot giá sản phẩm → snapshot biểu phí; address thuộc customer → invoice/căn thuộc quyền user; transaction tạo đơn → phát hành hóa đơn/ghi nhận thanh toán.

## 8. Kế hoạch tham khảo cho 2 người, khoảng 12 tuần

Mục tiêu là đến tuần 8 có toàn bộ luồng Must have chạy trên môi trường demo; tuần 9–12 dành cho nghiệm thu, mở rộng có chọn lọc, sửa lỗi và bàn giao. Khả năng thực hiện phụ thuộc thời lượng thực tế và tích hợp bên ngoài; đây là kế hoạch đề xuất, không phải cam kết hoàn thành. Học nền TypeScript/kiến trúc ngắn rồi áp dụng ngay, không học tuần tự cả 12 chặng rồi mới làm project.

Đề xuất hai người chia module, cùng giữ quy ước schema/API và review chéo:

- Backend A: xác thực/phân quyền và tài chính (điện nước, hóa đơn, thanh toán).
- Backend B: căn hộ/cư dân, thông báo/phản ánh, bãi xe và trạng thái kỹ thuật.
- Cả hai cùng thiết kế quan hệ user–person–unit, làm test quyền và test tích hợp. Tải việc cần điều chỉnh sau mỗi tuần; phân công này không bắt buộc theo tên người học.

| Tuần | Backend A | Backend B | Mốc chung |
|---|---|---|---|
| 1 | Cùng chốt nghiệp vụ, quyền, schema nền, TypeScript/API convention | Cùng dựng project, migration/seed và môi trường chạy | ERD nhỏ, ma trận quyền, health endpoint, CI/deploy thử |
| 2 | Login/logout/me, session, policy nền | CRUD tòa/tầng/căn, liên kết tài khoản–người–căn | Cư dân đăng nhập và chỉ xem căn mình; frontend có API contract |
| 3 | Hoàn thiện quyền theo đối tượng; test A/B; hợp đồng API tài chính | Hộ dân cư, sở hữu/cư trú, chuyển đến/đi và trạng thái căn | Lát cắt đầu tiên chạy và có test quyền/lịch sử |
| 4 | Chỉ số điện/nước, kỳ và biểu phí | Đăng/nhận thông báo; gửi/tiếp nhận phản ánh | Demo dữ liệu và API từng module |
| 5 | Hóa đơn, dòng hóa đơn, chống phát hành trùng, công nợ | Phản ánh hoàn chỉnh; xe/vé/bãi, sự kiện vào/ra | Hóa đơn đúng số liệu; phân quyền module B đầy đủ |
| 6 | Ghi nhận thanh toán, transaction/chống lặp, lịch sử xác nhận | Sức chứa bãi xe, số chỗ trống; tình trạng điện từng tầng | Luồng tài chính và vận hành đều có bản chạy |
| 7 | Cổng thanh toán sandbox nếu đã chốt và có tài liệu/tài khoản; nếu chưa thì hoàn thiện đối soát/test tài chính | Job nhắc hạn dựa trên API/DB contract hóa đơn; hoàn thiện lịch sử và lỗi module vận hành | Tích hợp frontend; không tự coi ghi nhận thủ công là tích hợp thanh toán online |
| 8 | Cùng kiểm thử tài chính, phân quyền, request lặp/đồng thời | Cùng kiểm thử vận hành và frontend | Toàn bộ Must have theo phạm vi đã chốt chạy trên demo |
| 9 | Sửa lỗi nghiệm thu, dữ liệu lệch, quyền và hiệu năng truy vấn | Sửa lỗi nghiệm thu, trạng thái và luồng giao diện | Giữ hệ thống ổn định trước khi mở rộng |
| 10 | Chọn Nice to have nhỏ theo nhu cầu, ví dụ quên mật khẩu | Chọn Nice to have nhỏ, ví dụ phí sửa chữa tái dùng hóa đơn | Chỉ mở rộng khi phần bắt buộc đạt |
| 11 | Cùng khóa phạm vi, kiểm thử hồi quy, migration, backup/restore | Cùng hoàn thiện OpenAPI/README, seed và demo | Bản dự kiến bàn giao; ngừng thêm tính năng |
| 12 | Dự phòng lỗi, diễn tập deploy và hỗ trợ demo | Dự phòng lỗi, diễn tập demo và tài liệu | Bàn giao |

Quy tắc thực hiện:

- Merge và demo luồng liên module mỗi tuần, không đợi tuần cuối mới ghép. Mỗi module có test và tài liệu API cùng thời điểm viết.
- Các nhánh làm song song phải thống nhất contract trước: identity/quyền ở tuần 1–2; hóa đơn/công nợ cho job nhắc hạn trước tuần 7.
- Đề xuất baseline nhập tay/mô phỏng sự kiện bãi xe/thiết bị và ghi nhận thanh toán có người xác nhận. Nhóm chưa xác nhận baseline này. Nếu yêu cầu thật, cần chốt tài liệu, tài khoản sandbox, thiết bị và đầu mối tích hợp ngay tuần 1 rồi điều chỉnh lịch.
- Không coi thu tiền thủ công là thanh toán trực tuyến thật. Không tự đưa OCR biển số, điều khiển barie hoặc điều khiển báo cháy vào phạm vi.
- Mỗi tuần hoàn thành một lát cắt chạy được thay vì gom toàn bộ database rồi toàn bộ backend. Nếu tuần 3 chưa có luồng đăng nhập–căn hộ với quyền đúng, giảm phần mở rộng và xử lý vướng mắc trước.

## 9. Tài liệu chính thức tham khảo

- Node.js LTS: https://nodejs.org/en/about/previous-releases
- Express security: https://expressjs.com/en/advanced/best-practice-security/
- Express sessions: https://expressjs.com/en/resources/middleware/session/
- TypeScript: https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- Zod runtime validation: https://zod.dev/
- PostgreSQL locking: https://www.postgresql.org/docs/current/explicit-locking.html
- NestJS architecture and HTTP adapters: https://docs.nestjs.com/
- Node test runner: https://nodejs.org/api/test.html
