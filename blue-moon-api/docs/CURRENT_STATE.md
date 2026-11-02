# Điểm dừng hiện tại

Cập nhật: 01/11/2026. Đã review module mật khẩu, chạy typecheck/build và thực thi năm assertions Argon2 thật; chỉ cập nhật tài liệu, không ghi hoặc truy vấn database.

## Mở lại thì đọc gì?

1. File này để biết việc tiếp theo.
2. [README](../README.md) để nhớ mô hình và luồng.
3. [Error middleware](../src/middleware/error.middleware.ts), [app](../src/app.ts), [schema](../prisma/schema.prisma).

## Phần vừa kiểm tra

- `src/security/password.ts` dùng argon2 0.45.1, Argon2id, memoryCost 19 * 1024 KiB, timeCost 2, parallelism 1; hashPassword trả chuỗi encoded hash; verifyPassword gọi đúng thứ tự argon2.verify(storedHash, password).
- Không trim mật khẩu, không nuốt lỗi bằng catch trả false; module không phụ thuộc Express/Prisma.
- `npx tsc --noEmit`, `npx tsc` và `node dist/scripts/password-check.js` đều exit 0. Đã chạy thực tế năm assertions: hai hash khác nhau, cùng mật khẩu khớp cả hai, sai mật khẩu false, thêm khoảng trắng false.
- account-auth-check đã đổi key boolean thành hasPassword; không in hash. Schema/migration auth đã được review ở lượt trước; người học báo đã áp dụng trên DB. Agent chưa tự xác minh DB trong lượt này.

## Bài mới: cấp mật khẩu cho tài khoản demo

- Người học tự thêm DEMO_ADMIN_PASSWORD, DEMO_HOMEOWNER_A_PASSWORD, DEMO_HOMEOWNER_B_PASSWORD vào .env local; không ghi giá trị mật khẩu vào code/tài liệu/Git.
- Tạo `src/scripts/demo-password-setup.ts`, dùng prisma và hashPassword; không sửa account-seed để mỗi lần seed lại tự reset mật khẩu.
- Đọc và kiểm tra đủ ba biến trước khi bắt đầu ghi. Mật khẩu được giữ nguyên, không trim.
- Với từng username cố định admin_a/homeowner_a/homeowner_b: findUnique select id/passwordHash; thiếu tài khoản thì báo lỗi; hash khác null thì bỏ qua; hash null thì tạo hash rồi updateMany với where id/passwordHash:null, data chỉ passwordHash.
- Kiểm tra count: 1 là đã cấp; 0 là tài khoản đã thay đổi trước lúc ghi, bỏ qua; không ghi đè. Giữ nguyên status/role và các quan hệ.
- Log username và kết quả thao tác, không log mật khẩu/hash. DemoPasswordSetupError dành cho thông báo cấu hình/tài khoản do script kiểm soát; lỗi ngoài dự kiến chỉ log tên loại, tránh dump query có chứa hash.
- Các tài khoản được xử lý độc lập, không phải một transaction chung. Nếu dừng giữa chừng, chạy lại chỉ tiếp tục các tài khoản còn hash null.
- Người học chạy typecheck/build, chạy script setup trên DB phát triển, chạy account-auth-check rồi chạy lại setup để xác nhận bỏ qua các tài khoản đã có hash. hasPassword true chỉ xác nhận có giá trị; chưa chứng minh login hoặc mật khẩu người nhập khớp.

Script setup chưa được agent tạo hoặc chạy. Sau khi người học hoàn thành: review và kiểm chứng tính không ghi đè, rồi triển khai đăng nhập và lưu phiên.

## Ngữ cảnh cần giữ

- Chuyển chủ vẫn chỉ gọi qua script; model tài khoản chưa là hệ thống đăng nhập hoàn chỉnh. Service không lấy danh tính đáng tin cậy từ request body.
- Lỗi nghiệp vụ service đã được review trước đó với 19 kiểm tra transaction giả lập; chưa kiểm chứng lại rollback/cạnh tranh thật trong lượt này.
- Snapshot database kiểm tra gần nhất ngày 28/10: A có A102; B có A101 và B201. Không coi đây là dữ liệu vừa truy vấn hôm nay.

## Git

Nhánh hiện tại main, đích đã cho phép origin/main. Kiểm tra filesystem hôm nay vẫn xác nhận .git chỉ đọc; không thể stage/commit trong sandbox này. Lần kiểm tra remote trước thất bại vì không phân giải được github.com; chưa xác minh quyền ghi tài khoản GitHub. Chưa có commit/push cho các mốc đang nằm trong working tree; không gom các thay đổi khác, node_modules, dist, .env hoặc generated client. Không nâng quyền để vượt giới hạn.

## Ghi cuối buổi (3–5 phút)

```text
Ngày:
Mục tiêu chức năng:
Đã thay đổi gì / vì sao:
Đã kiểm tra bằng lệnh nào / kết quả:
Đang dở hoặc còn chưa hiểu:
Bước đầu tiên buổi tới (file + hành động cụ thể):
```
