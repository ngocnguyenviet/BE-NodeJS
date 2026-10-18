import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const outputDir = new URL('.', import.meta.url).pathname;
const features = [
  ['AUTH-01', 'Đăng nhập', 'Authentication', 'Must have', 'All', 'Gốc', 'WYP'],
  ['AUTH-02', 'Đăng xuất', 'Authentication', 'Must have', 'All', 'Gốc', ''],
  ['AUTH-03', 'Quên mật khẩu', 'Authentication', 'Nice to have', 'All', 'Gốc', ''],
  ['AUTH-04', 'Phân quyền người dùng', 'Authentication', 'Must have', 'Admin', 'Gốc', ''],
  ['ROOM-01', 'Cập nhật hộ dân cư', 'Room management', 'Must have', 'Chủ nhà', 'Gốc', ''],
  ['ROOM-02', 'Trạng thái mua nhà', 'Room management', 'Must have', 'Admin', 'Gốc', ''],
  ['UTIL-01', 'Theo dõi chỉ số điện nước từng nhà', 'Utilities (đề xuất)', 'Must have', 'Admin', 'Đề xuất', ''],
  ['TECH-01', 'Cập nhật tình trạng điện từng tầng', 'Technical operations (đề xuất)', 'Must have', 'Kỹ thuật viên', 'Đề xuất', ''],
  ['TECH-02', 'Cập nhật tình trạng thang máy', 'Technical operations (đề xuất)', 'Nice to have', 'Kỹ thuật viên', 'Đề xuất', ''],
  ['TECH-03', 'Cập nhật tình trạng báo cháy', 'Technical operations (đề xuất)', 'Nice to have', 'Kỹ thuật viên', 'Đề xuất', ''],
  ['PARK-01', 'Trạng thái lot đỗ của hầm xe (map)', 'Parking (đề xuất)', 'Nice to have', 'Chủ nhà + Admin', 'Đề xuất', ''],
  ['PARK-02', 'Số chỗ trống của từng hầm', 'Parking (đề xuất)', 'Must have', 'Chủ nhà + Admin', 'Đề xuất', ''],
  ['PARK-03', 'Xe vào hầm, xe ra hầm, phân loại vé tháng vé lượt', 'Parking (đề xuất)', 'Must have', 'Admin', 'Đề xuất', ''],
  ['BILL-01', 'Theo dõi công nợ', 'Billing (đề xuất)', 'Must have', 'Admin', 'Đề xuất', ''],
  ['BILL-02', 'Thanh toán phí điện nước', 'Billing (đề xuất)', 'Must have', 'Chủ nhà', 'Đề xuất', ''],
  ['BILL-03', 'Thanh toán hóa đơn sửa chữa', 'Billing (đề xuất)', 'Nice to have', 'Chủ nhà', 'Đề xuất', ''],
  ['BILL-04', 'Thanh toán phí tòa nhà', 'Billing (đề xuất)', 'Must have', 'Chủ nhà', 'Đề xuất', ''],
  ['ALRT-01', 'Cảnh báo hạn thanh toán', 'Alert', 'Must have', 'Chủ nhà', 'Gốc', ''],
  ['ALRT-02', 'Cảnh báo tình trạng thang máy', 'Alert', 'Nice to have', 'All', 'Gốc', ''],
  ['ALRT-03', 'Cảnh báo cháy nhà', 'Alert', 'Nice to have', 'All', 'Gốc', ''],
  ['ANNC-01', 'Đăng thông báo toàn tòa nhà', 'Announcement', 'Must have', 'Admin', 'Gốc', ''],
  ['ANNC-02', 'Nhận thông báo', 'Announcement', 'Must have', 'Chủ nhà', 'Gốc', ''],
  ['HR-01', 'Quản lý ca trực của bảo vệ, lễ tân, lao công', 'Staff scheduling (đề xuất)', 'Nice to have', 'Quản lý nhân sự', 'Đề xuất', ''],
  ['BILL-05', 'Thanh toán phí thuê hàng tháng', 'Billing (đề xuất)', 'Nice to have', 'Hộ kinh doanh', 'Đề xuất', ''],
  ['REQ-01', 'Làm đơn xin phép online', 'Requests (đề xuất)', 'Nice to have', 'Hộ kinh doanh', 'Đề xuất', ''],
  ['FDBK-01', 'Feedback và phản ánh cho tòa nhà', 'Feedback (đề xuất)', 'Must have', 'Chủ nhà', 'Đề xuất', ''],
  ['FDBK-02', 'Tiếp nhận và xử lý đơn', 'Feedback (đề xuất)', 'Must have', 'Admin', 'Đề xuất', ''],
  ['VISIT-01', 'Quản lý khách ra vào', 'Visitor management (đề xuất)', 'Nice to have', 'Quản lý nhân sự', 'Đề xuất', ''],
];

const stories = [];
function add(featureId, actor, want, purpose, criteria, fe, be) {
  stories.push([
    `US-${String(stories.length + 1).padStart(3, '0')}`,
    featureId,
    actor,
    `Là ${actor === 'All' ? 'người dùng' : actor.toLowerCase().replaceAll(' + ', ' hoặc ')}, tôi muốn ${want} để ${purpose}.`,
    criteria.map((c, i) => `${i + 1}. ${c}`).join('\n'),
    `FE: ${fe}\nBE: ${be}`,
  ]);
}

add('AUTH-01', 'All', 'đăng nhập tài khoản', 'truy cập các chức năng theo quyền của mình', [
  'Thông tin hợp lệ và tài khoản đang hoạt động thì đăng nhập thành công.',
  'Thiếu thông tin, sai mật khẩu hoặc tài khoản bị khóa thì báo lỗi và không tạo phiên.',
  'Sau đăng nhập, hiển thị đúng danh tính và các chức năng theo quyền.',
  'Truy cập chức năng bảo vệ khi chưa đăng nhập bị từ chối ở backend.',
], 'Form đăng nhập, lỗi nhập liệu, điều hướng.', 'Xác thực tài khoản, kiểm tra mật khẩu, tạo phiên và kiểm tra phiên.');

add('AUTH-02', 'All', 'đăng xuất', 'kết thúc phiên sử dụng trên thiết bị hiện tại', [
  'Đăng xuất thành công thì quay về màn hình đăng nhập.',
  'Phiên cũ không gọi được API yêu cầu xác thực.',
  'Lặp thao tác đăng xuất không tạo lỗi nghiệp vụ hoặc khôi phục phiên.',
], 'Nút đăng xuất, xóa trạng thái đăng nhập.', 'Thu hồi phiên hiện tại và xóa cookie/thông tin phiên tương ứng.');

add('AUTH-03', 'All', 'đặt lại mật khẩu khi quên', 'lấy lại quyền truy cập tài khoản', [
  'Gửi yêu cầu khôi phục bằng kênh định danh đã được nhóm chốt (D03).',
  'Thông báo gửi yêu cầu không tiết lộ tài khoản có tồn tại hay không.',
  'Mã/link đặt lại có thời hạn, chỉ dùng một lần; mã sai hoặc hết hạn bị từ chối.',
  'Mật khẩu mới hợp lệ dùng đăng nhập được, mật khẩu cũ không còn dùng được.',
], 'Màn hình yêu cầu và đặt lại mật khẩu.', 'Tạo/kiểm tra token khôi phục, gửi qua kênh đã chốt, lưu mật khẩu đã băm.');

add('AUTH-04', 'Admin', 'gán hoặc thay đổi quyền của tài khoản', 'phân công đúng trách nhiệm trong hệ thống', [
  'Admin được phép xem và chọn các vai trò có trong danh mục.',
  'Vai trò không hợp lệ và yêu cầu từ người không có quyền quản trị bị từ chối.',
  'Ghi lại người thay đổi, tài khoản bị đổi quyền và thời điểm.',
  'Thay đổi quyền được áp dụng khi kiểm tra request tiếp theo, kể cả phiên đang tồn tại.',
], 'Danh sách người dùng và form gán quyền.', 'Chính sách gán quyền, cập nhật quyền, kiểm tra quyền hiện hành và audit.');

add('AUTH-04', 'All', 'chỉ truy cập chức năng và dữ liệu thuộc quyền của mình', 'sử dụng hệ thống đúng phạm vi được cấp', [
  'Backend kiểm tra cả quyền chức năng và phạm vi tòa/căn hộ liên quan.',
  'Đổi ID trên URL/body không truy cập được hồ sơ, hóa đơn hoặc phản ánh ngoài quyền.',
  'Frontend ẩn/khóa thao tác không được phép; gọi trực tiếp API vẫn bị chặn.',
  'Ma trận quyền và quan hệ tài khoản–căn hộ phải được nhóm chốt tại D01.',
], 'Hiển thị menu/thao tác theo quyền.', 'Middleware xác thực, policy và điều kiện lọc dữ liệu theo phạm vi.');

add('ROOM-01', 'Chủ nhà', 'cập nhật thành viên hộ dân cư của căn hộ mình', 'hồ sơ cư trú phản ánh đúng thực tế', [
  'Chỉ cập nhật được hộ thuộc căn hộ đang có quyền quản lý.',
  'Thêm/sửa/kết thúc cư trú cần đủ trường theo D02; dữ liệu không hợp lệ bị từ chối.',
  'Lưu thành công thì đọc lại thấy thay đổi; lỗi thì không lưu dở dang.',
  'Quy tắc cập nhật trực tiếp hay cần admin duyệt được chốt tại D02.',
], 'Danh sách thành viên và form cập nhật.', 'CRUD/lịch sử cư trú, validation, quyền theo căn và transaction nếu nhiều bảng.');

add('ROOM-01', 'Chủ nhà', 'xem danh sách và lịch sử thành viên hộ của mình', 'kiểm tra hồ sơ cư trú đã cập nhật', [
  'Hiển thị thành viên hiện tại của đúng căn hộ được phép truy cập.',
  'Hiển thị lịch sử chuyển đến/chuyển đi theo phạm vi dữ liệu nhóm chốt.',
  'Hộ chưa có thành viên thì hiển thị trạng thái rỗng.',
  'Không xem được hộ của căn khác bằng cách đổi ID.',
], 'Danh sách và lịch sử cư trú.', 'Truy vấn thành viên hiện tại/lịch sử, kiểm tra phạm vi dữ liệu.');

add('ROOM-02', 'Admin', 'cập nhật trạng thái mua nhà của căn hộ', 'theo dõi tình trạng hồ sơ mua và sở hữu', [
  'Chọn căn hộ tồn tại và trạng thái trong danh mục đã chốt tại D02.',
  'Dữ liệu hoặc chuyển trạng thái không hợp lệ bị từ chối.',
  'Lưu người cập nhật, thời điểm và trạng thái trước/sau.',
  'Không tự xóa lịch sử cư dân hoặc hóa đơn khi đổi trạng thái căn hộ.',
], 'Form trạng thái và lịch sử căn hộ.', 'Validation/chuyển trạng thái, cập nhật dữ liệu và audit.');

add('UTIL-01', 'Admin', 'theo dõi và nhập chỉ số điện nước theo căn hộ và kỳ', 'có dữ liệu đúng để tính phí sử dụng', [
  'Chọn căn hộ, đồng hồ/loại dịch vụ và kỳ để xem chỉ số đầu/cuối, mức tiêu thụ.',
  'Chỉ số hợp lệ, không âm; chỉ số cuối không nhỏ hơn đầu trừ trường hợp thay/reset đồng hồ theo D04.',
  'Không tạo bản ghi trùng cùng đồng hồ và kỳ; sửa dữ liệu có lịch sử.',
  'Kỳ đã chốt hóa đơn tuân theo quy tắc sửa/chốt tại D04.',
], 'Bảng theo kỳ, form nhập/sửa chỉ số.', 'Validation, lưu chỉ số, tính tiêu thụ, chống trùng và lịch sử sửa.');

add('TECH-01', 'Kỹ thuật viên', 'cập nhật tình trạng điện của từng tầng', 'ban quản lý có thông tin vận hành mới nhất', [
  'Chọn đúng tầng và trạng thái trong danh mục tại D07.',
  'Lưu trạng thái, mô tả sự cố, người cập nhật và thời điểm.',
  'Đọc lại thấy trạng thái mới cùng lịch sử thay đổi.',
  'Người không được phân quyền kỹ thuật không được cập nhật.',
], 'Danh sách tầng, form trạng thái điện.', 'Cập nhật trạng thái tầng, phân quyền và lịch sử sự cố.');

add('TECH-02', 'Kỹ thuật viên', 'cập nhật tình trạng từng thang máy', 'người dùng biết thiết bị đang hoạt động hay gặp sự cố', [
  'Chọn thang máy tồn tại và trạng thái hợp lệ tại D07.',
  'Lưu mô tả, người cập nhật, thời điểm và lịch sử trạng thái.',
  'Chỉ kỹ thuật viên được cấp quyền mới cập nhật được.',
  'Trạng thái dùng làm nguồn cảnh báo ALRT-02; nguồn nhập tay/thiết bị được chốt tại D07.',
], 'Danh sách thang máy và form tình trạng.', 'Trạng thái tài sản, lịch sử và sự kiện phục vụ cảnh báo.');

add('TECH-03', 'Kỹ thuật viên', 'cập nhật tình trạng hệ thống báo cháy', 'theo dõi thiết bị báo cháy trong tòa nhà', [
  'Chọn thiết bị/khu vực tồn tại và trạng thái thiết bị theo D07.',
  'Ghi người cập nhật, thời điểm, mô tả và lịch sử.',
  'Phân biệt tình trạng thiết bị với sự kiện cháy cần cảnh báo.',
  'Nguồn xác nhận sự kiện cháy và quyền kích hoạt cảnh báo được chốt tại D07.',
], 'Form tình trạng hệ thống báo cháy.', 'Lưu tình trạng thiết bị và lịch sử; tách sự kiện cháy khỏi trạng thái bảo trì.');

add('PARK-01', 'Chủ nhà + Admin', 'xem sơ đồ trạng thái các ô đỗ trong hầm', 'nhận biết vị trí trống, đang dùng hoặc không khả dụng', [
  'Chọn hầm để xem mã ô và trạng thái với chú giải rõ ràng.',
  'Trạng thái khớp dữ liệu từng ô; hiển thị thời điểm cập nhật.',
  'Không cho chủ nhà thấy thông tin cá nhân/biển số ngoài phạm vi quyền.',
  'Chưa có dữ liệu ô thì báo chưa có dữ liệu; map không tự tạo tính năng đặt chỗ.',
], 'Sơ đồ ô đỗ, chú giải, chọn hầm.', 'Danh mục ô, truy vấn trạng thái và lọc thông tin theo quyền.');

add('PARK-02', 'Chủ nhà + Admin', 'xem số chỗ trống từng hầm', 'biết khả năng tiếp nhận xe hiện tại', [
  'Hiển thị sức chứa, số xe/ô đang sử dụng và số chỗ còn trống theo mô hình D06.',
  'Số liệu thay đổi theo lượt vào/ra hợp lệ; không âm và không vượt sức chứa.',
  'Có thời điểm cập nhật; dữ liệu chưa có không được hiển thị như hầm trống hoàn toàn.',
  'Phân biệt sức chứa xe thực tế với hạn mức vé tháng theo D06.',
], 'Danh sách hầm và số chỗ trống.', 'Tổng hợp sức chứa/lượt đang mở hoặc trạng thái ô theo mô hình đã chốt.');

add('PARK-03', 'Admin', 'quản lý và phân loại vé tháng, vé lượt', 'áp dụng đúng loại vé cho xe gửi trong hầm', [
  'Vé tháng gắn xe, thời hạn và trạng thái; ngày kết thúc không trước ngày bắt đầu.',
  'Vé lượt gắn với lượt gửi; mã vé không trùng.',
  'Xe/vé hết hạn hoặc không hợp lệ được xử lý theo D06, không tự coi còn hiệu lực.',
  'Chỉ người được phân quyền quản lý bãi xe được thay đổi vé.',
], 'Form vé và danh sách theo loại/trạng thái.', 'CRUD vé, hiệu lực, mã duy nhất và liên kết xe/lượt gửi.');

add('PARK-03', 'Admin', 'ghi nhận xe vào hầm', 'mở lượt gửi và cập nhật số chỗ đang sử dụng', [
  'Ghi nhận xe, hầm, loại/mã vé và thời điểm vào.',
  'Từ chối mở thêm lượt nếu xe đã có lượt chưa kết thúc trái quy tắc D06.',
  'Không nhận vượt sức chứa; hai request đồng thời không chiếm cùng chỗ cuối.',
  'Gửi lại cùng yêu cầu không tạo hai lượt gửi.',
], 'Form xe vào và kết quả tiếp nhận.', 'Transaction mở lượt, kiểm tra vé/sức chứa, chống lặp và cập nhật đồng thời.');

add('PARK-03', 'Admin', 'ghi nhận xe ra hầm', 'kết thúc đúng lượt gửi và giải phóng chỗ', [
  'Tìm được lượt gửi đang mở của xe/vé; không có thì báo lỗi.',
  'Thời điểm ra không trước thời điểm vào.',
  'Kết thúc lượt một lần; request lặp không giải phóng chỗ hai lần.',
  'Nếu tính phí vé lượt, áp dụng biểu phí theo D06 và ghi lại kết quả.',
], 'Form xe ra, thông tin lượt và phí nếu áp dụng.', 'Đóng lượt trong transaction, tính phí nếu thuộc phạm vi, cập nhật sức chứa.');

add('BILL-01', 'Admin', 'xem danh sách công nợ theo căn hộ và kỳ', 'xác định các khoản chưa thu và quá hạn', [
  'Lọc theo tòa/căn, kỳ và trạng thái; có phân trang khi nhiều dữ liệu.',
  'Hiển thị tổng phải thu, đã thu, còn nợ và hạn thanh toán.',
  'Công nợ tính từ hóa đơn và thanh toán đã xác nhận, không gồm khoản chờ xác nhận.',
  'Không có hóa đơn thì hiển thị rỗng; hóa đơn hủy xử lý theo D05.',
], 'Bảng công nợ và bộ lọc.', 'Truy vấn/tổng hợp hóa đơn–thanh toán, phân trang và quyền admin.');

add('BILL-01', 'Admin', 'xem chi tiết hóa đơn và lịch sử thu tiền của một căn', 'đối chiếu nguyên nhân số dư công nợ', [
  'Hiển thị từng khoản phí, kỳ thu, tổng tiền và các khoản đã xác nhận.',
  'Tổng còn nợ đối chiếu được với danh sách công nợ.',
  'Mỗi khoản thu có mã tham chiếu, thời điểm, phương thức và nguồn/người xác nhận.',
  'Không sửa số dư trực tiếp để bỏ qua hóa đơn hoặc giao dịch.',
], 'Chi tiết hóa đơn, lịch sử giao dịch.', 'Truy vấn chi tiết, phân bổ thanh toán nếu áp dụng và audit nguồn xác nhận.');

function payment(featureId, actor, fee, purpose) {
  add(featureId, actor, `thanh toán ${fee}`, purpose, [
    'Chỉ xem và yêu cầu thanh toán khoản phí thuộc căn/hợp đồng trong quyền.',
    'Hiển thị kỳ, khoản phí, số còn phải trả; số tiền do backend xác định.',
    'Theo phương thức tại D05; chỉ ghi nhận đã trả khi backend nhận xác nhận hợp lệ.',
    'Gửi lặp request/xác nhận không ghi nhận thu tiền hai lần.',
    'Thất bại hoặc hủy không tăng số đã trả; xem lại được kết quả và lịch sử.',
  ], `Danh sách/chi tiết ${fee}, thao tác trả tiền và trạng thái.`, 'Kiểm tra quyền/số dư, ghi nhận giao dịch theo D05, chống lặp và cập nhật công nợ trong transaction.');
}
payment('BILL-02', 'Chủ nhà', 'phí điện nước', 'hoàn tất nghĩa vụ phí sử dụng của căn hộ');
payment('BILL-03', 'Chủ nhà', 'hóa đơn sửa chữa', 'chi trả khoản sửa chữa đã được xác nhận');
payment('BILL-04', 'Chủ nhà', 'phí tòa nhà', 'hoàn tất khoản phí quản lý/dịch vụ đến hạn');

add('ALRT-01', 'Chủ nhà', 'nhận nhắc hạn thanh toán', 'chủ động trả phí trước hoặc khi quá hạn', [
  'Chỉ nhắc hóa đơn còn dư nợ của căn thuộc quyền người nhận.',
  'Nội dung có mã hóa đơn, số còn nợ, hạn trả và liên kết chi tiết.',
  'Lịch nhắc/kênh gửi theo D08; chạy lại job không tạo trùng cùng lần nhắc.',
  'Không tiếp tục nhắc hóa đơn đã trả đủ hoặc đã hủy.',
], 'Danh sách/chi tiết nhắc hạn.', 'Job xác định hóa đơn đến hạn, chọn người nhận và chống gửi trùng.');

add('ALRT-02', 'All', 'nhận cảnh báo tình trạng thang máy', 'biết thang máy nào cần tránh hoặc đã hoạt động lại', [
  'Cảnh báo chỉ gửi tới người dùng thuộc phạm vi tòa/khu vực bị ảnh hưởng.',
  'Hiển thị thang máy, vị trí, tình trạng và thời điểm phát sinh.',
  'Sự kiện từ TECH-02 hoặc nguồn đã chốt tại D07; không tạo thông tin khi chưa có nguồn.',
  'Cập nhật khôi phục không để cảnh báo cũ hiển thị như sự cố đang diễn ra.',
], 'Hiển thị cảnh báo và trạng thái hiện tại.', 'Xử lý sự kiện thang máy, chọn người nhận, trạng thái cảnh báo và chống lặp.');

add('ALRT-03', 'All', 'nhận cảnh báo khi có sự kiện cháy được xác nhận', 'nhận biết khu vực và thông tin sự cố kịp thời', [
  'Chỉ tạo cảnh báo từ nguồn/người có quyền được chốt tại D07.',
  'Hiển thị khu vực, thời điểm, nguồn và trạng thái sự kiện.',
  'Phân phối tới người dùng thuộc phạm vi ảnh hưởng qua kênh đã chốt.',
  'Sự kiện trùng không tạo nhiều cảnh báo giống nhau; có cập nhật kết thúc/đính chính.',
], 'Màn hình cảnh báo rõ khu vực và thời điểm.', 'Tiếp nhận/kiểm tra sự kiện, phân phối và lưu lịch sử cảnh báo theo D07.');

add('ANNC-01', 'Admin', 'đăng thông báo cho toàn tòa nhà', 'truyền đạt thông tin chung đến đúng người nhận', [
  'Thông báo có tiêu đề, nội dung và tòa nhà nhận; thiếu dữ liệu bắt buộc bị từ chối.',
  'Chỉ admin trong phạm vi tòa được đăng.',
  'Đăng thành công thì người nhận thuộc tòa xem được; tòa khác không tự nhận.',
  'Lưu người đăng và thời điểm; cách sửa/thu hồi sau đăng theo D08.',
], 'Form soạn, xem trước và danh sách thông báo.', 'Validation, quyền theo tòa, lưu và phân phối thông báo.');

add('ANNC-02', 'Chủ nhà', 'nhận và đọc thông báo của tòa nhà', 'nắm được thông tin liên quan đến căn hộ mình', [
  'Danh sách chỉ chứa thông báo trong phạm vi người dùng được nhận.',
  'Xem được tiêu đề, nội dung, người đăng và thời điểm.',
  'Mở đọc thì đánh dấu đã đọc cho đúng tài khoản; người khác không bị đổi trạng thái.',
  'Có trạng thái rỗng và phân trang; kênh thông báo ngoài web theo D08.',
], 'Danh sách, chi tiết và chỉ báo chưa đọc.', 'Truy vấn theo người nhận, read receipt và phân trang.');

add('HR-01', 'Quản lý nhân sự', 'phân công ca cho bảo vệ, lễ tân và lao công', 'bảo đảm mỗi ca có người phụ trách', [
  'Chọn nhân viên, vị trí, ngày và thời gian bắt đầu/kết thúc hợp lệ.',
  'Không phân công cùng người vào các ca bị chồng thời gian theo D09.',
  'Lưu và đọc lại được lịch; sửa/hủy có lịch sử người thao tác.',
  'Người không có quyền nhân sự không được phân ca.',
], 'Lịch trực và form phân công.', 'CRUD ca/phân công, kiểm tra chồng thời gian, quyền và lịch sử.');

payment('BILL-05', 'Hộ kinh doanh', 'phí thuê hàng tháng', 'thực hiện nghĩa vụ theo hợp đồng thuê của mình');

add('REQ-01', 'Hộ kinh doanh', 'gửi đơn xin phép online', 'đề nghị ban quản lý xem xét mà không cần nộp giấy', [
  'Chọn loại đơn và nhập trường bắt buộc theo D09; thiếu/sai thì không gửi được.',
  'Gửi thành công có mã đơn, thời điểm và trạng thái ban đầu.',
  'Chỉ xem được đơn của mình và kết quả xử lý có lý do.',
  'Người tiếp nhận/duyệt, chuyển trạng thái và tệp đính kèm được chốt tại D09.',
], 'Form loại đơn, danh sách và chi tiết theo dõi.', 'Validation theo loại, lưu đơn/lịch sử, quyền xem và workflow duyệt theo D09.');

add('FDBK-01', 'Chủ nhà', 'gửi phản ánh tới ban quản lý', 'đề nghị xử lý vấn đề liên quan đến nơi ở', [
  'Nhập tiêu đề, nội dung và căn/khu vực liên quan trong quyền.',
  'Thiếu nội dung hoặc dữ liệu không hợp lệ thì báo lỗi và không lưu.',
  'Gửi thành công có mã phản ánh, thời điểm và trạng thái mới.',
  'Nếu cho đính kèm ảnh, kiểm tra loại/kích thước và quyền đọc theo D10.',
], 'Form phản ánh, kết quả gửi và upload nếu có.', 'Tạo phản ánh, validation, quyền căn hộ và kiểm tra tệp theo D10.');

add('FDBK-01', 'Chủ nhà', 'theo dõi phản ánh mình đã gửi', 'biết tiến độ và phản hồi từ ban quản lý', [
  'Xem danh sách/chi tiết phản ánh thuộc quyền của mình.',
  'Hiển thị trạng thái, lịch sử thay đổi và phản hồi được phép công khai.',
  'Không đọc được phản ánh hoặc ghi chú nội bộ ngoài quyền bằng cách đổi ID.',
  'Không có phản ánh thì hiển thị rỗng; trạng thái theo quy trình D10.',
], 'Danh sách/chi tiết, tiến độ và phản hồi.', 'Lọc theo người gửi/quyền, lịch sử và tách nội dung nội bộ nếu áp dụng.');

add('FDBK-02', 'Admin', 'tiếp nhận và phân công phản ánh', 'mỗi yêu cầu có người chịu trách nhiệm xử lý', [
  'Xem và lọc phản ánh trong phạm vi quản lý theo trạng thái/khu vực.',
  'Chọn người phụ trách có quyền phù hợp và cập nhật trạng thái tiếp nhận.',
  'Phản ánh không tồn tại hoặc ngoài quyền bị từ chối.',
  'Ghi nhận người tiếp nhận/phân công và thời điểm theo D10.',
], 'Danh sách xử lý và form phân công.', 'Truy vấn, quyền admin, phân công và lịch sử trạng thái.');

add('FDBK-02', 'Admin', 'cập nhật kết quả và kết thúc xử lý phản ánh', 'người gửi biết vấn đề đã được giải quyết ra sao', [
  'Chỉ chuyển giữa các trạng thái được phép theo D10.',
  'Khi kết thúc, có nội dung kết quả hoặc lý do từ chối.',
  'Lịch sử giữ người thực hiện, thời điểm và phản hồi cho người gửi.',
  'Yêu cầu sửa trạng thái cũ khi đã bị người khác cập nhật được xử lý rõ, không ghi đè âm thầm.',
], 'Form phản hồi, chuyển trạng thái và lịch sử.', 'Quy tắc trạng thái, kiểm soát cập nhật đồng thời, audit và thông báo kết quả.');

add('VISIT-01', 'Quản lý nhân sự', 'ghi nhận khách vào và ra tòa nhà', 'theo dõi các lượt khách đang có mặt và lịch sử', [
  'Ghi thông tin tối thiểu theo D09, căn/người tiếp đón và thời điểm vào.',
  'Ghi ra cho đúng lượt đang mở; thời điểm ra không trước lúc vào.',
  'Gửi lại thao tác không tạo hai lượt vào hoặc hai lần ra.',
  'Chỉ người được phân quyền xem/cập nhật dữ liệu khách; quyền bảo vệ và thời hạn lưu theo D09.',
], 'Form khách vào/ra và danh sách lượt.', 'CRUD lượt khách, validation, chống lặp, quyền và lịch sử.');

let decisions = [
  ['D01', 'AUTH-04; toàn hệ thống', 'Ai được xem/sửa dữ liệu của tòa/căn nào? Chủ nhà, người thuê và cư dân khác nhau thế nào?', 'Giữ actor trong ảnh. All là nhóm người dùng được cấp quyền, không có nghĩa ai cũng xem mọi tòa. US-005 diễn giải việc áp dụng quyền, không mở rộng quyền admin.', ''],
  ['D02', 'ROOM-01; ROOM-02', 'Trường thông tin hộ; cập nhật trực tiếp hay admin duyệt; trạng thái mua nhà gồm những gì?', 'Story chưa mặc định thêm bước duyệt. Tách trạng thái giao dịch/sở hữu và cư trú khi thiết kế dữ liệu; chưa đưa hợp đồng mua bán vào phạm vi.', ''],
  ['D03', 'AUTH-01/02/03', 'Session hay token? Kênh đặt lại mật khẩu? Đăng xuất thiết bị hiện tại hay tất cả thiết bị?', 'Bản nháp mô tả phiên hiện tại. Kênh khôi phục và chính sách thu hồi phiên khác cần nhóm chốt.', ''],
  ['D04', 'UTIL-01; BILL-02/04', 'Kỳ thu, biểu giá, đơn vị/làm tròn, ngày chốt, thay đồng hồ; ai lập/sửa hóa đơn?', 'Phải có dữ liệu hóa đơn và biểu phí trước khi thanh toán. Đây là phụ thuộc còn thiếu trong feature gốc, chưa tự thêm feature mới.', ''],
  ['D05', 'BILL-01/02/03/04/05', 'Thanh toán thủ công hay cổng online? Ai xác nhận? Có trả từng phần, trả thừa, hoàn/hủy?', 'Chưa chọn nhà cung cấp. Giao diện báo thành công không đủ làm hóa đơn đã trả; phải có xác nhận hợp lệ ở backend và chống ghi nhận trùng.', ''],
  ['D06', 'PARK-01/02/03', 'Nhập tay hay thiết bị? Theo sức chứa hay từng ô? Loại xe, vé hết hạn, biểu phí, thời hạn vé tháng?', 'Map cần dữ liệu ô. Số chỗ thực tế và hạn mức vé tháng là hai khái niệm; không mặc định có đặt chỗ/OCR/barie.', ''],
  ['D07', 'TECH-01/02/03; ALRT-02/03', 'Trạng thái thiết bị và nguồn sự kiện; phạm vi/kênh cảnh báo; ai được xác nhận cháy?', 'Tách tình trạng thiết bị khỏi sự kiện sự cố. Phải phân biệt dữ liệu mô phỏng/nhập tay và thiết bị thật; chưa bao gồm điều khiển thiết bị.', ''],
  ['D08', 'ANNC-01/02; ALRT-01', 'Thông báo trong web/email/push? Nhắc trước hạn bao lâu? Có sửa/thu hồi thông báo sau đăng?', 'Story có đọc/chưa đọc trong web. Kênh ngoài web, lịch nhắc và chính sách thu hồi chưa chốt.', ''],
  ['D09', 'HR-01; REQ-01; VISIT-01; BILL-05', 'Quy tắc ca trùng; loại đơn và người duyệt; quyền bảo vệ; dữ liệu khách; hợp đồng thuê?', 'Giữ actor theo ảnh. Các vai trò thực hiện/duyệt còn thiếu phải được nhóm xác định trước triển khai.', ''],
  ['D10', 'FDBK-01/02', 'Phản ánh có ảnh không? Các trạng thái, người được phân công, điều kiện đóng/mở lại?', 'Luồng đề xuất: mới → tiếp nhận → đang xử lý → đã xử lý, hoặc từ chối có lý do. Chưa coi đây là quy trình đã được nhóm duyệt.', ''],
];

// Apply the two updated source screenshots while preserving existing story IDs.
const originalFeatures = features.map(row => [...row]);
const idMigration = { 'AUTH-03': 'AUTH-04', 'AUTH-04': 'USER-01' };
const actorMigration = {
  'All': 'Tất cả người dùng',
  'Chủ nhà': 'Đại diện căn hộ',
  'Hộ kinh doanh': 'Đại diện hộ kinh doanh',
  'Chủ nhà + Admin': 'Đại diện căn hộ + Admin',
};
for (const feature of features) {
  feature[0] = idMigration[feature[0]] ?? feature[0];
  feature[4] = actorMigration[feature[4]] ?? feature[4];
  feature[2] = feature[2].replace(' (đề xuất)', '');
}
for (const story of stories) {
  story[1] = idMigration[story[1]] ?? story[1];
  story[2] = actorMigration[story[2]] ?? story[2];
  story[3] = story[3].replaceAll('chủ nhà + admin', 'đại diện căn hộ hoặc admin')
    .replaceAll('chủ nhà', 'đại diện căn hộ')
    .replaceAll('hộ kinh doanh', 'đại diện hộ kinh doanh');
}
function editFeature(id, name, module, actor) {
  const feature = features.find(f => f[0] === id);
  if (!feature) throw new Error(`Unknown feature ${id}`);
  if (name) feature[1] = name;
  if (module) feature[2] = module;
  if (actor) feature[4] = actor;
}
function replaceStory(id, actor, want, purpose, criteria, fe, be) {
  const row = stories.find(s => s[0] === id);
  if (!row) throw new Error(`Unknown story ${id}`);
  row[2] = actor;
  row[3] = `Là ${actor.toLowerCase().replaceAll(' + ', ' hoặc ')}, tôi muốn ${want} để ${purpose}.`;
  row[4] = criteria.map((c, i) => `${i + 1}. ${c}`).join('\n');
  row[5] = `FE: ${fe}\nBE: ${be}`;
}

editFeature('USER-01', null, 'User management');
features.find(f => f[0] === 'USER-01')[5] = 'Gốc: ảnh mới';
features.find(f => f[0] === 'AUTH-04')[5] = 'Sửa ID trùng';
editFeature('ROOM-01', 'Cập nhật và xem hồ sơ thành viên hộ dân cư');
editFeature('ROOM-02', 'Quản lý trạng thái sử dụng và hồ sơ sở hữu căn hộ');
editFeature('TECH-01', 'Cập nhật trạng thái điện và sự cố từng tầng');
editFeature('TECH-02', 'Cập nhật tình trạng và sự cố thang máy');
editFeature('TECH-03', 'Cập nhật tình trạng thiết bị báo cháy');
editFeature('PARK-01', 'Xem sơ đồ trạng thái ô đỗ', null, 'Đại diện căn hộ + Admin + Nhân viên trực');
editFeature('PARK-02', 'Xem số chỗ trống từng hầm', null, 'Đại diện căn hộ + Admin + Nhân viên trực');
editFeature('PARK-03', 'Quản lý vé tháng/vé lượt và ghi nhận xe vào/ra', null, 'Admin + Nhân viên trực');
editFeature('BILL-01', 'Theo dõi và đối chiếu công nợ');
editFeature('ALRT-01', 'Nhận nhắc hạn hóa đơn còn dư nợ', null, 'Đại diện căn hộ + Đại diện hộ kinh doanh');
editFeature('ALRT-02', 'Nhận cảnh báo sự cố thang máy', null, 'Tất cả người dùng');
editFeature('ALRT-03', 'Nhận cảnh báo sự kiện cháy đã xác nhận', null, 'Tất cả người dùng');
editFeature('ANNC-02', 'Nhận và đọc thông báo đúng đối tượng', null, 'Tất cả người dùng');
editFeature('HR-01', 'Quản lý lịch ca trực và phân công nhân viên');
editFeature('FDBK-02', 'Tiếp nhận, phân công và giải quyết phản ánh', null, 'Admin + Kỹ thuật viên');
editFeature('VISIT-01', 'Ghi nhận lượt khách vào/ra', null, 'Nhân viên trực');

const addedFeatureRows = [
  ['AUTH-03', 'Tạo/cấp tài khoản', 'Authentication', 'Must have', 'Admin', 'Gốc: ảnh mới', ''],
  ['USER-02', 'Liên kết và thu hồi quyền đại diện căn hộ', 'User management', 'Must have', 'Admin', 'Gốc: ảnh mới', ''],
  ['USER-03', 'Khóa/mở khóa tài khoản', 'User management', 'Must have', 'Admin', 'ID mới', ''],
  ['ROOM-03', 'Quản lý danh mục tòa, tầng, căn hộ', 'Room management', 'Must have', 'Admin', 'ID mới', ''],
  ['BILL-06', 'Quản lý biểu phí và kỳ thu', 'Billing', 'Must have', 'Admin', 'ID mới', ''],
  ['BILL-07', 'Lập và phát hành hóa đơn', 'Billing', 'Must have', 'Admin', 'ID mới', ''],
  ['BILL-08', 'Xem hóa đơn và lịch sử thanh toán của mình', 'Billing', 'Must have', 'Đại diện căn hộ + Đại diện hộ kinh doanh', 'ID mới', ''],
  ['BILL-09', 'Xác nhận và đối soát thanh toán', 'Billing', 'Must have', 'Admin', 'ID mới', ''],
  ['REQ-02', 'Xem xét và duyệt/từ chối đơn xin phép', 'Requests', 'Nice to have', 'Admin', 'ID mới', ''],
];
features.push(...addedFeatureRows);
features.sort((a, b) => {
  const groups = ['AUTH', 'USER', 'ROOM', 'UTIL', 'BILL', 'PARK', 'TECH', 'ALRT', 'ANNC', 'FDBK', 'HR', 'REQ', 'VISIT'];
  const [ap, an] = a[0].split('-');
  const [bp, bn] = b[0].split('-');
  return groups.indexOf(ap) - groups.indexOf(bp) || Number(an) - Number(bn);
});

replaceStory('US-004', 'Admin', 'gán hoặc thu hồi vai trò của tài khoản', 'phân công quyền chức năng phù hợp', [
  'Chỉ admin được quản lý quyền trong phạm vi được cấp.',
  'Vai trò phải thuộc danh mục; một người có thể có nhiều vai trò nếu được cấp.',
  'Quyền đã thay đổi được kiểm tra lại ở request tiếp theo và có audit người/thời điểm.',
  'Vai trò đại diện không tự cho quyền với mọi căn/hộ kinh doanh; phải có liên kết tài nguyên.',
], 'Form vai trò theo tài khoản.', 'Phân quyền nhiều vai trò, kiểm tra quyền hiện hành, audit và giới hạn phạm vi.');
replaceStory('US-005', 'Tất cả người dùng', 'truy cập chức năng và dữ liệu trong quyền được cấp', 'thao tác đúng phạm vi công việc và căn hộ', [
  'Mỗi API kiểm tra vai trò và tòa/căn/hộ kinh doanh liên quan theo D01.',
  'Đổi ID trên URL/body không xem/sửa được dữ liệu ngoài quyền.',
  'Một tài khoản có thể liên kết nhiều căn; mỗi request vẫn kiểm tra căn đang thao tác.',
  'Mất liên kết hoặc bị khóa thì request tiếp theo không tiếp tục dùng quyền cũ.',
], 'Menu và ngữ cảnh căn/hộ đang thao tác.', 'Policy theo danh tính đã xác thực và liên kết còn hiệu lực.');
replaceStory('US-006', 'Đại diện căn hộ', 'cập nhật thành viên hộ đang cư trú', 'hồ sơ căn hộ phản ánh đúng thực tế', [
  'Chỉ cập nhật hộ thuộc căn có liên kết đại diện còn hiệu lực.',
  'Thông tin bắt buộc, quan hệ và ngày cư trú theo D02; dữ liệu sai bị từ chối.',
  'Không tự đổi chủ sở hữu, người đại diện hoặc quyền tài khoản qua form thành viên.',
  'Lưu lịch sử thay đổi; cập nhật trực tiếp hay admin duyệt vẫn cần chốt tại D02.',
], 'Danh sách/form thành viên và lịch sử.', 'Validation, quyền theo căn, lưu cư trú và lịch sử; tách khỏi gán quyền.');
replaceStory('US-008', 'Admin', 'quản lý trạng thái sử dụng và hồ sơ sở hữu căn hộ', 'theo dõi đúng tình hình căn hộ và lịch sử', [
  'Tách tình trạng sử dụng căn (trống/đang ở/cho thuê theo D02) khỏi thông tin chủ sở hữu.',
  'Đổi chủ sở hữu có thời điểm hiệu lực và giữ được lịch sử.',
  'Không xóa hóa đơn/cư trú cũ, không tự chuyển quyền tài khoản chỉ bằng đổi một nhãn trạng thái.',
  'Nếu cần trạng thái mua/bán thì dùng trường/quy trình riêng theo D02; chưa gồm đặt cọc/thanh toán mua nhà.',
], 'Hồ sơ căn, trạng thái sử dụng và lịch sử sở hữu.', 'Validation trạng thái/quan hệ, lịch sử sở hữu và audit.');
for (const id of ['US-013', 'US-014']) {
  const row = stories.find(s => s[0] === id);
  row[2] = 'Đại diện căn hộ + Admin + Nhân viên trực';
  row[3] = row[3].replace('đại diện căn hộ hoặc admin', 'đại diện căn hộ, admin hoặc nhân viên trực');
}
for (const id of ['US-015', 'US-016', 'US-017']) {
  const row = stories.find(s => s[0] === id);
  row[2] = 'Nhân viên trực';
  row[3] = row[3].replace('Là admin', 'Là nhân viên trực');
}
const passStory = stories.find(s => s[0] === 'US-015');
passStory[2] = 'Admin + Nhân viên trực';
passStory[3] = passStory[3].replace('Là nhân viên trực', 'Là admin hoặc nhân viên trực');
passStory[4] = passStory[4].replace('Chỉ người được phân quyền quản lý bãi xe được thay đổi vé.', 'Tạo/gia hạn/hủy vé theo quyền riêng tại D06; không mặc định nhân viên trực được sửa biểu phí.');

replaceStory('US-023', 'Đại diện căn hộ + Đại diện hộ kinh doanh', 'nhận nhắc hạn hóa đơn còn dư nợ', 'chủ động thanh toán các khoản đến hạn', [
  'Chỉ nhắc hóa đơn thuộc căn/hộ kinh doanh có liên kết còn hiệu lực và còn dư nợ.',
  'Nội dung có mã hóa đơn, số còn nợ, hạn trả và liên kết chi tiết.',
  'Lịch/kênh gửi theo D08; job chạy lại không gửi trùng cùng lần nhắc.',
  'Không nhắc hóa đơn đã trả đủ hoặc đã hủy; phí thuê chỉ áp dụng nếu triển khai BILL-05.',
], 'Danh sách/chi tiết nhắc hạn.', 'Job lọc hóa đơn chưa trả, liên kết người nhận và chống gửi trùng.');
replaceStory('US-027', 'Tất cả người dùng', 'nhận và đọc thông báo phù hợp với mình', 'nắm thông tin của tòa nhà và công việc liên quan', [
  'Admin chọn đối tượng nhận theo tòa/vai trò; chỉ người trong đối tượng nhận xem được.',
  'Danh sách/chi tiết hiển thị tiêu đề, nội dung, người đăng và thời điểm.',
  'Đọc thông báo chỉ đổi trạng thái đã đọc của đúng tài khoản.',
  'Không có dữ liệu thì hiển thị rỗng; có phân trang; kênh ngoài web theo D08.',
], 'Danh sách, chi tiết và chưa đọc.', 'Lọc người nhận theo tòa/vai trò, read receipt và phân trang.');
const publishStory = stories.find(s => s[0] === 'US-026');
publishStory[4] = publishStory[4].replace('Thông báo có tiêu đề, nội dung và tòa nhà nhận; thiếu dữ liệu bắt buộc bị từ chối.', 'Thông báo có tiêu đề, nội dung, tòa nhà và nhóm nhận; thiếu dữ liệu bắt buộc bị từ chối.');
replaceStory('US-034', 'Admin + Kỹ thuật viên', 'cập nhật kết quả phản ánh được phân công', 'người gửi biết tiến độ và kết quả xử lý', [
  'Admin thao tác trong phạm vi quản lý; kỹ thuật viên chỉ cập nhật phản ánh đã được giao.',
  'Chỉ chuyển trạng thái hợp lệ theo D10; kỹ thuật viên không tự đổi người phụ trách.',
  'Khi kết thúc có kết quả/lý do; giữ người thực hiện, thời điểm và lịch sử phản hồi.',
  'Cập nhật từ trạng thái cũ bị xử lý rõ, không ghi đè âm thầm; quyền đóng/mở lại theo D10.',
], 'Danh sách được giao, phản hồi và trạng thái.', 'Policy theo phân công, chuyển trạng thái, kiểm soát cập nhật đồng thời và audit.');
replaceStory('US-035', 'Nhân viên trực', 'ghi nhận khách vào và ra tòa nhà', 'theo dõi lượt khách trong ca được phân công', [
  'Ghi thông tin tối thiểu theo D09, căn/người tiếp đón và thời điểm vào.',
  'Ghi ra đúng lượt đang mở; thời điểm ra không trước lúc vào.',
  'Gửi lại cùng thao tác không tạo hai lượt vào/ra.',
  'Quyền xem lịch sử và thời hạn lưu theo D09; quản lý nhân sự không mặc định được xem mọi dữ liệu khách.',
], 'Form vào/ra và danh sách lượt trong quyền.', 'Validation, chống lặp, quyền theo khu vực/ca nếu áp dụng và lịch sử.');

add('AUTH-03', 'Admin', 'cấp tài khoản cá nhân cho người sử dụng', 'người được phép có thể đăng nhập và nhận quyền phù hợp', [
  'Chọn người dùng và định danh duy nhất; thông tin thiếu hoặc trùng bị từ chối.',
  'Không mở đăng ký công khai; mật khẩu không lưu dạng rõ trong DB/log.',
  'Kích hoạt hoặc mật khẩu ban đầu và đổi mật khẩu lần đầu theo D03.',
  'Tạo tài khoản không tự gán mọi quyền hoặc căn hộ; cấp quyền/liên kết là thao tác riêng.',
], 'Form cấp tài khoản và kết quả cấp.', 'Tạo định danh duy nhất, lưu mật khẩu băm và quy trình kích hoạt theo D03.');
add('USER-02', 'Admin', 'liên kết hoặc thu hồi người đại diện của căn hộ', 'người đúng trách nhiệm quản lý dữ liệu căn hộ', [
  'Chọn tài khoản, căn hộ và thời gian hiệu lực hợp lệ.',
  'Bản đầu đề xuất một người đại diện chính đang hiệu lực cho mỗi căn; một người có thể đại diện nhiều căn (D01).',
  'Đổi đại diện phải kết thúc liên kết cũ, tạo liên kết mới nhất quán và giữ lịch sử.',
  'Sau thu hồi, tài khoản cũ không còn quyền qua liên kết đó; hồ sơ sở hữu không tự bị thay đổi.',
], 'Form liên kết/đổi đại diện và lịch sử.', 'Transaction quản lý liên kết, ràng buộc hiệu lực, kiểm tra quyền mỗi request và audit.');
add('USER-03', 'Admin', 'khóa hoặc mở khóa tài khoản', 'ngăn hoặc khôi phục truy cập khi cần', [
  'Chỉ admin có quyền mới thay đổi tài khoản trong phạm vi quản lý.',
  'Tài khoản khóa không đăng nhập và không tiếp tục gọi API qua phiên cũ.',
  'Lưu lý do, người thay đổi và thời điểm; không xóa dữ liệu nghiệp vụ đã tạo.',
  'Không khóa tài khoản quản trị cuối cùng đang hoạt động theo phạm vi chốt tại D01.',
], 'Trạng thái tài khoản, thao tác khóa/mở và xác nhận.', 'Cập nhật trạng thái, chặn/thu hồi phiên, kiểm tra admin cuối và audit.');
add('ROOM-03', 'Admin', 'quản lý danh mục tòa, tầng và căn hộ', 'các hồ sơ cư dân và hóa đơn tham chiếu đúng căn', [
  'Tạo/sửa đúng quan hệ tòa–tầng–căn; mã căn không trùng trong cùng tòa.',
  'Diện tích và trường bắt buộc hợp lệ theo D02.',
  'Không xóa cứng căn đang được hóa đơn/cư trú tham chiếu; dùng ngừng sử dụng theo quy tắc.',
  'Có danh sách lọc/phân trang; chỉ admin đúng phạm vi cập nhật được.',
], 'Danh sách và form cấu trúc tòa/căn.', 'CRUD danh mục, FK/unique/check, validation và chặn xóa dữ liệu đang được dùng.');
add('BILL-06', 'Admin', 'quản lý biểu phí và kỳ thu', 'tính các khoản phải thu theo quy tắc thống nhất', [
  'Biểu phí có loại phí, đơn vị, giá/quy tắc và thời gian hiệu lực theo D04.',
  'Kỳ thu có thời gian và hạn trả hợp lệ; không cấu hình chồng hiệu lực trái quy tắc.',
  'Sửa giá không làm đổi đơn giá snapshot của hóa đơn đã phát hành.',
  'Lưu người cập nhật và lịch sử; thu phí thuê/sửa chữa chỉ khi module liên quan được triển khai.',
], 'Form biểu phí và kỳ thu.', 'Validation giá/đơn vị/thời gian, version biểu phí và audit.');
add('BILL-07', 'Admin', 'lập và phát hành hóa đơn theo kỳ', 'căn hộ có khoản phải thu rõ ràng trước khi thanh toán', [
  'Chọn căn, kỳ và dịch vụ; chỉ số/biểu phí cần thiết phải có và hợp lệ.',
  'Backend tính từng dòng và tổng tiền, lưu snapshot tên/giá/căn cứ tính phí.',
  'Lưu hóa đơn và các dòng trong cùng transaction; lỗi thì không lưu dở dang.',
  'Gửi lặp không phát hành trùng cùng khoản phí/căn/kỳ theo khóa nghiệp vụ tại D04.',
  'Quy tắc chốt/sửa/hủy và xử lý người đại diện thay đổi được chốt tại D04/D05.',
], 'Tạo/xem trước và phát hành hóa đơn.', 'Tính tiền, snapshot, transaction, khóa chống trùng và quyền theo tòa/căn.');
add('BILL-08', 'Đại diện căn hộ + Đại diện hộ kinh doanh', 'xem hóa đơn và lịch sử thanh toán thuộc quyền mình', 'kiểm tra các khoản phải trả và đã trả', [
  'Chỉ xem hóa đơn thuộc căn/hợp đồng có quyền theo D01 và chính sách lịch sử D04.',
  'Hiển thị từng khoản phí, kỳ, tổng phải trả, đã xác nhận, dư nợ và hạn trả.',
  'Khoản chờ xác nhận hiển thị riêng, chưa trừ vào số còn nợ.',
  'Có danh sách rỗng và phân trang; đổi ID không truy cập hóa đơn ngoài quyền.',
], 'Danh sách/chi tiết hóa đơn và giao dịch.', 'Truy vấn theo quyền căn/hợp đồng và trạng thái thanh toán; không tin userId từ client.');
add('BILL-09', 'Admin', 'xác nhận và đối chiếu khoản thanh toán', 'công nợ phản ánh đúng số tiền thực nhận', [
  'Kiểm tra khoản thu, hóa đơn, số tiền và chứng cứ/mã tham chiếu theo phương thức D05.',
  'Chỉ người có quyền mới xác nhận khoản thu thủ công; nếu cổng online thì backend xác minh thông báo từ cổng.',
  'Xác nhận lặp hoặc request đồng thời không ghi nhận thu tiền hai lần.',
  'Cập nhật giao dịch và dư nợ nhất quán trong transaction; lỗi thì rollback.',
  'Lưu người/nguồn xác nhận, thời điểm và lý do từ chối; trả thiếu/thừa/hoàn theo D05.',
], 'Danh sách chờ xác nhận, chi tiết và đối soát.', 'Xác minh khoản thu, unique tham chiếu/idempotency, transaction và audit.');
add('REQ-02', 'Admin', 'duyệt hoặc từ chối đơn xin phép của hộ kinh doanh', 'người gửi nhận được kết quả xử lý rõ ràng', [
  'Chỉ thấy và xử lý đơn trong phạm vi quản lý.',
  'Chỉ chuyển trạng thái đúng quy trình; từ chối phải có lý do.',
  'Giữ người duyệt, thời điểm, kết quả và lịch sử; người gửi xem được kết quả của mình.',
  'Loại đơn, điều kiện xét và quyền mở lại theo D09; không gộp đơn xin phép với phản ánh.',
], 'Hàng đợi, chi tiết đơn và form kết quả.', 'Workflow xét duyệt, policy, lịch sử và thông báo kết quả nếu áp dụng.');

const actors = [
  ['ACT-01', 'Admin', 'Quản trị tòa nhà, tài khoản, căn hộ và tài chính trong phạm vi được cấp.', 'Ít nhất một tài khoản quản trị hoạt động. Mỗi người quản trị một tài khoản riêng; không cố định đúng 1.', 'Cấp/khóa tài khoản, gán quyền, quản lý dữ liệu, hóa đơn và đối soát.', 'Không mặc định được truy cập mọi tòa. Tránh tự khóa admin cuối cùng.'],
  ['ACT-02', 'Đại diện căn hộ', 'Sử dụng dịch vụ và quản lý hồ sơ hộ theo quyền với căn hộ.', 'Bản đầu: một đại diện chính/căn. Tài khoản thuộc cá nhân; một cá nhân có thể liên kết nhiều căn.', 'Hộ dân cư, hóa đơn/thanh toán, thông báo, phản ánh; xem bãi xe.', 'Thay nhãn Chủ nhà. Không đồng nhất đại diện với chủ sở hữu; người thuê chỉ có quyền khi được cấp. Không dùng chung mật khẩu cả hộ.'],
  ['ACT-03', 'Quản lý nhân sự', 'Quản lý hồ sơ phân công và lịch trực nhân viên.', 'Mỗi người quản lý một tài khoản riêng; số người theo thực tế.', 'Phân ca bảo vệ, lễ tân, lao công; xem lịch trong quyền.', 'Không mặc định ghi nhận khách/xe ra vào. Nhân viên được xếp lịch không nhất thiết đều cần tài khoản.'],
  ['ACT-04', 'Đại diện hộ kinh doanh', 'Thanh toán khoản thuê và gửi đơn xin phép cho cơ sở được liên kết.', 'Mỗi hộ có đại diện chính. Tài khoản cá nhân liên kết hộ kinh doanh, không cấp mật khẩu dùng chung.', 'Xem/thanh toán phí thuê; gửi/theo dõi đơn; nhận thông báo phù hợp.', 'Thống nhất tên Người kinh doanh/Hộ kinh doanh. Phí thuê và đơn xin phép vẫn là Nice to have.'],
  ['ACT-05', 'Kỹ thuật viên', 'Cập nhật vận hành thiết bị và tiến độ công việc được phân công.', 'Mỗi kỹ thuật viên một tài khoản; không cố định 1 tài khoản cho cả đội.', 'Điện từng tầng, thang máy, báo cháy; phản ánh được giao.', 'Chỉ sửa trong khu vực/công việc được cấp; không tự xác nhận thu tiền hoặc cấp quyền.'],
  ['ACT-06', 'Nhân viên trực', 'Thực hiện nghiệp vụ tại cổng/hầm, ví dụ bảo vệ hoặc lễ tân.', 'Mỗi nhân viên thao tác một tài khoản riêng. Có thể có nhiều người/ca.', 'Ghi xe/khách vào ra theo quyền; xem sức chứa; vé theo quyền riêng.', 'Actor bổ sung. Quyền tại cổng và bãi xe có thể khác nhau theo phân công; không tự cấp quyền quản trị.'],
];

decisions = [
  ['D01', 'Actors; USER-01/02/03', 'Phạm vi tòa/căn/hộ, vai trò kiêm nhiệm, đại diện chính và quyền xem lịch sử khi thu hồi?', 'Đề xuất 6 actor. All là nhóm tất cả tài khoản được cấp, không phải role cho quyền toàn hệ thống. Không dùng chung tài khoản theo căn/đội.', ''],
  ['D02', 'ROOM-01/02/03; USER-02', 'Trường hộ dân cư, cơ chế duyệt, trạng thái sử dụng; có theo dõi mua/bán không?', 'Đại diện cập nhật hộ trong quyền; admin quản lý sở hữu và liên kết. Nếu đề tài cần quy trình mua bán, đặc tả riêng trước khi thêm hợp đồng/giao dịch.', ''],
  ['D03', 'AUTH-01/02/03/04', 'Session/token, định danh đăng nhập, cách cấp mật khẩu/kích hoạt, kênh quên mật khẩu?', 'AUTH-03 dành cho tạo tài khoản; AUTH-04 cho quên mật khẩu để sửa ID trùng. Logout phiên hiện tại. Chưa chốt email/SMS hay cổng kích hoạt.', ''],
  ['D04', 'UTIL-01; BILL-06/07/08', 'Kỳ thu, biểu giá, làm tròn, thay đồng hồ, khóa chống trùng, sửa/hủy hóa đơn, quyền lịch sử?', 'Bổ sung biểu phí, phát hành và xem hóa đơn để hoàn chỉnh đầu vào thanh toán. Phải chốt quyền xem hóa đơn cũ khi đổi đại diện; không tự xóa lịch sử.', ''],
  ['D05', 'BILL-01/02/03/04/05/09', 'Thủ công hay cổng online? Ai xác nhận? Thu thiếu/thừa, hoàn/hủy và đối soát?', 'Thêm bước xác nhận/đối soát. Browser gửi thành công chưa đủ xác nhận thu tiền; chưa chọn nhà cung cấp hoặc mặc định có tích hợp thật.', ''],
  ['D06', 'PARK-01/02/03; ACT-06', 'Nhập tay/thiết bị, mô hình ô/sức chứa, loại xe, giá vé và quyền gia hạn/hủy vé?', 'Bản đầu đề xuất nhập tay, nhân viên trực vận hành. Map là Nice to have và cần dữ liệu ô; không thêm đặt chỗ, OCR hoặc điều khiển barie.', ''],
  ['D07', 'TECH-01/02/03; ALRT-02/03', 'Nguồn sự kiện, trạng thái, ai xác nhận cháy, vùng nhận và kênh cảnh báo?', 'Tách thiết bị báo cháy lỗi/bảo trì khỏi sự kiện cháy thật. Chưa chốt thiết bị thật hay mô phỏng; không bao gồm điều khiển thiết bị.', ''],
  ['D08', 'ANNC-01/02; ALRT-01', 'Đối tượng nhận, kênh gửi, nhắc trước hạn bao lâu, sửa/thu hồi sau đăng?', 'Mở người nhận cho cả nhân viên/hộ kinh doanh theo đối tượng admin chọn. Không phát mọi thông báo cho mọi người; job cần chống gửi trùng.', ''],
  ['D09', 'HR-01; VISIT-01; REQ-01/02; BILL-05', 'Ca trực, quyền bảo vệ/lễ tân, dữ liệu khách, loại đơn và điều kiện duyệt; hợp đồng thuê?', 'Quản lý nhân sự phân ca, nhân viên trực ghi nhận khách. Admin duyệt đơn là đề xuất cho MVP; đơn xin phép tách khỏi phản ánh. Dữ liệu khách chỉ thu tối thiểu cần dùng.', ''],
  ['D10', 'FDBK-01/02', 'Ảnh đính kèm, danh mục phản ánh, chuyển trạng thái, quyền đóng/mở lại?', 'Admin tiếp nhận/phân công; kỹ thuật viên cập nhật việc được giao. Luồng đề xuất: mới → tiếp nhận → đang xử lý → đã xử lý hoặc từ chối có lý do.', ''],
  ['D11', 'Features: Priority/Status', 'Nhóm chấp thuận các tính năng bổ sung chưa? WYP trong bảng gốc có nghĩa gì?', 'Giữ ưu tiên 30 feature nguồn. 7 feature mới có mức ưu tiên đề xuất ghi rõ; Status WYP giữ nguyên như nguồn, không suy ra đã làm/đã xong.', ''],
];

const changeRows = [
  ['CH-01', 'ID Authentication', 'Ảnh mới có hai dòng AUTH-03.', 'AUTH-03: tạo tài khoản; AUTH-04: quên mật khẩu.', 'Mỗi feature cần ID duy nhất. US-003 giữ Story ID nhưng trỏ sang AUTH-04.', 'Sửa ID trong bản nháp'],
  ['CH-02', 'Phân quyền và gán căn', 'Bản cũ AUTH-04 là phân quyền; ảnh mới dùng USER-01 và USER-02.', 'Dùng USER-01 phân quyền và USER-02 liên kết/thu hồi đại diện.', 'Theo ảnh mới; tránh nhầm sở hữu thực tế với quyền truy cập tài khoản.', 'Theo ảnh mới + làm rõ'],
  ['CH-03', 'Chủ nhà và số tài khoản', 'Mỗi nhà 1 tài khoản.', 'Đại diện căn hộ là vai trò cá nhân liên kết căn; đề xuất 1 đại diện chính/căn.', 'Một người có thể có nhiều căn; đổi đại diện cần thu hồi quyền và giữ audit.', 'Đề xuất, xem D01'],
  ['CH-04', 'Số tài khoản nhân viên', 'Admin/nhân sự/kỹ thuật đều ghi số lượng 1.', 'Mỗi người thao tác một tài khoản riêng; không giới hạn đúng 1 người.', 'Không đồng nhất số vai trò với số tài khoản và không dùng chung mật khẩu.', 'Đề xuất'],
  ['CH-05', 'Actor kinh doanh', 'Người kinh doanh / Hộ kinh doanh dùng khác nhau.', 'Thống nhất Đại diện hộ kinh doanh; liên kết với cơ sở/hộ.', 'Phân biệt cá nhân đăng nhập với đơn vị kinh doanh.', 'Đề xuất'],
  ['CH-06', 'Actor vận hành', 'Admin ghi xe ra vào; quản lý nhân sự quản lý khách.', 'Thêm Nhân viên trực; admin cấu hình/giám sát, nhân sự phân ca.', 'Gắn nghiệp vụ hằng ngày với người thực hiện, quyền cụ thể theo ca/khu vực.', 'Đề xuất, xem D06/D09'],
  ['CH-07', 'ROOM-02', 'Trạng thái mua nhà.', 'Trạng thái sử dụng và hồ sơ sở hữu; mua/bán nếu cần phải đặc tả riêng.', 'Tránh dùng một nhãn để biểu diễn đang ở, sở hữu và tiến độ mua bán.', 'Đề xuất, xem D02'],
  ['CH-08', 'Hóa đơn–thanh toán', 'Có công nợ và thanh toán nhưng thiếu lập/xem hóa đơn, biểu phí và xác nhận thu.', 'Thêm BILL-06/07/08/09.', 'Khép kín luồng chỉ số/biểu phí → hóa đơn → thanh toán → công nợ.', 'Bổ sung, ưu tiên đề xuất'],
  ['CH-09', 'Nền dữ liệu/tài khoản', 'Có đăng nhập, gán căn nhưng thiếu quản lý trạng thái tài khoản và danh mục căn.', 'Thêm USER-03 và ROOM-03.', 'Cần khóa quyền truy cập và có căn hợp lệ trước khi liên kết/lập hóa đơn.', 'Bổ sung, ưu tiên đề xuất'],
  ['CH-10', 'Đơn xin phép', 'Chỉ có người kinh doanh gửi đơn.', 'Thêm REQ-02 cho admin xét duyệt/từ chối.', 'Cần phía xử lý để người gửi nhận được kết quả; vẫn Nice to have.', 'Bổ sung, ưu tiên đề xuất'],
  ['CH-11', 'Thông báo/cảnh báo', 'Nhận thông báo chỉ Chủ nhà; một số cảnh báo ghi All.', 'Người nhận theo tòa/vai trò/liên kết; All không có nghĩa công khai toàn bộ.', 'Nhân viên/hộ kinh doanh có thể cần thông báo, nhưng không nhận ngoài phạm vi.', 'Đề xuất, xem D08'],
  ['CH-12', 'Phản ánh', 'Admin tiếp nhận và xử lý mọi bước.', 'Admin tiếp nhận/phân công; kỹ thuật viên xử lý phần được giao.', 'Bổ sung rõ ai cập nhật tiến độ; không cấp kỹ thuật viên quyền với mọi phản ánh.', 'Đề xuất, xem D10'],
  ['CH-13', 'Nhóm tính năng', 'Nhiều dòng chưa có ID/Module; status WYP chưa rõ.', 'Điền ID/Module nhất quán, giữ WYP như nguồn và giữ ưu tiên nguồn.', 'Theo dõi feature/story đầy đủ mà không suy đoán trạng thái thực hiện.', 'Chuẩn hóa trong bản nháp'],
  ['CH-14', 'Phạm vi phần mở rộng', 'Nhân sự, thuê, xin phép, khách, map/thang máy/báo cháy là Nice to have.', 'Giữ Nice to have, chưa thêm OCR, barie, IoT thật hay hợp đồng mua bán.', 'Tránh mở rộng không cần thiết với 2 backend và gần 3 tháng.', 'Giữ ưu tiên nguồn'],
];

const newIds = new Set(['USER-03', 'ROOM-03', 'BILL-06', 'BILL-07', 'BILL-08', 'BILL-09', 'REQ-02']);
const sourceFeatureMap = new Map(originalFeatures.map(f => [idMigration[f[0]] ?? f[0], f]));
sourceFeatureMap.set('AUTH-03', ['AUTH-03', 'Tạo tài khoản', 'Authentication', 'Must have', 'Admin']);
sourceFeatureMap.set('USER-02', ['USER-02', 'Gán chủ nhà vào căn hộ', 'User management', 'Must have', 'Admin']);
const changeNote = (feature) => {
  const source = sourceFeatureMap.get(feature[0]);
  if (!source) return 'Bổ sung để khép kín luồng. Priority là đề xuất, xem Can chot D11.';
  const notes = [];
  if (source[1] !== feature[1]) notes.push(`Tên gốc: ${source[1]}`);
  if (source[4] !== feature[4]) notes.push(`Actor gốc: ${source[4]}`);
  if (feature[0] === 'AUTH-04') notes.push('ID nguồn AUTH-03 bị trùng; đổi thành AUTH-04.');
  return notes.join('\n') || 'Giữ chức năng và ưu tiên theo ảnh mới.';
};

if (features.length !== 37 || stories.length !== 44 || sourceFeatureMap.size !== 30) throw new Error('Unexpected revision counts');
const featureIds = new Set(features.map(f => f[0]));
if (featureIds.size !== features.length) throw new Error('Duplicate feature ID');
for (const feature of features) {
  if (!stories.some(s => s[1] === feature[0])) throw new Error(`Missing story for ${feature[0]}`);
}
for (const story of stories) {
  if (!featureIds.has(story[1]) || story.length !== 6 || story.some(v => !v)) throw new Error(`Invalid story ${story[0]}`);
}
for (const [id, source] of sourceFeatureMap) {
  if (features.find(f => f[0] === id)?.[3] !== source[3]) throw new Error(`Source priority changed for ${id}`);
}
const knownActors = new Set(actors.map(row => row[1]));
knownActors.add('Tất cả người dùng');
for (const row of [...features.map(f => [f[0], f[4]]), ...stories.map(s => [s[0], s[2]])]) {
  if (row[1].split(' + ').some(actor => !knownActors.has(actor))) throw new Error(`Undefined actor in ${row[0]}`);
}

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(`${outputDir}chung-cu-user-stories.xlsx`));
const storySheet = workbook.worksheets.getItem('User stories');
const featureSheet = workbook.worksheets.getItem('Features');
const decisionSheet = workbook.worksheets.getItem('Can chot');
for (const sheet of [storySheet, featureSheet, decisionSheet]) {
  for (const table of [...sheet.tables.items]) table.delete();
  sheet.getUsedRange().clear({ applyTo: 'all' });
  sheet.freezePanes.unfreeze();
}
const actorSheet = workbook.worksheets.add('Actors');
const changesSheet = workbook.worksheets.add('Dieu chinh');

function styleTable(sheet, headers, rows, widths, name, start = 1) {
  const last = String.fromCharCode(64 + headers.length);
  const end = start + rows.length;
  sheet.showGridLines = false;
  sheet.getRange(`A${start}:${last}${end}`).values = [headers, ...rows];
  const table = sheet.tables.add(`A${start}:${last}${end}`, true, name);
  table.showFilterButton = true;
  sheet.getRange(`A${start}:${last}${end}`).format = {
    font: { name: 'Arial', size: 10, color: '#172B35' },
    verticalAlignment: 'top', wrapText: true,
  };
  for (let i = 0; i < widths.length; i++) {
    const col = String.fromCharCode(65 + i);
    sheet.getRange(`${col}${start}:${col}${end}`).format.columnWidth = widths[i];
  }
  for (let i = 0; i < rows.length; i++) {
    const lines = Math.max(...rows[i].map((value, j) => {
      const chars = Math.max(7, widths[j] * 1.06);
      return String(value).split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / chars)), 0);
    }));
    const range = sheet.getRange(`A${start + i + 1}:${last}${start + i + 1}`);
    range.format.rowHeight = Math.max(36, lines * 14 + 12);
    range.format.fill = i % 2 ? '#F0F8F9' : '#FFFFFF';
  }
  sheet.getRange(`A${start}:${last}${start}`).format = {
    fill: '#00D9DF', font: { name: 'Arial', size: 10, bold: true, color: '#102A33' },
    rowHeight: 30, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true,
  };
  sheet.freezePanes.freezeRows(start);
  sheet.freezePanes.freezeColumns(2);
  return end;
}

styleTable(storySheet,
  ['Story ID', 'Feature ID', 'Actor', 'User Story', 'Acceptance Criteria', 'FE / BE'],
  stories, [13, 14, 30, 57, 90, 49], 'UserStories');
storySheet.tabColor = '#008891';

const featureRows = features.map(f => [
  f[0], f[1], f[2], f[3], f[4], f[6], f[5],
  stories.filter(s => s[1] === f[0]).map(s => s[0]).join(', '), changeNote(f),
]);
styleTable(featureSheet,
  ['Feature ID', 'Feature', 'Module', 'Priority', 'Actor', 'Status (nguồn)', 'Nguồn ID', 'Story ID', 'Điều chỉnh / nguồn'],
  featureRows, [14, 47, 28, 18, 34, 16, 20, 39, 62], 'FeatureMapping');
for (let i = 0; i < features.length; i++) {
  if (newIds.has(features[i][0])) featureSheet.getRange(`D${i + 2}`).format.fill = '#FFF2CC';
}
featureSheet.tabColor = '#63B5BC';

styleTable(actorSheet,
  ['Actor ID', 'Đối tượng sử dụng', 'Mục đích', 'Tài khoản và số lượng đề xuất', 'Phạm vi chức năng', 'Làm rõ'],
  actors, [13, 28, 49, 63, 55, 66], 'Actors');
actorSheet.tabColor = '#008891';
styleTable(changesSheet,
  ['Change ID', 'Hạng mục', 'Trước', 'Sau', 'Lý do', 'Tình trạng'],
  changeRows, [13, 26, 50, 66, 62, 29], 'ReviewChanges');
changesSheet.tabColor = '#A5ADB5';

decisionSheet.getRange('A1:E1').values = [[
  'Bản nháp để nhóm duyệt', '', '', '', '',
]];
decisionSheet.getRange('A1:E2').format.font = { name: 'Arial', size: 10, color: '#172B35' };
decisionSheet.getRange('A1').format.font = { name: 'Arial', size: 13, bold: true, color: '#172B35' };
decisionSheet.getRange('A2:E2').values = [[
  'Nguồn: 2 ảnh mới và workbook trước. 30 feature nguồn giữ ưu tiên; 7 feature bổ sung có priority đề xuất. Actor, AC và FE/BE chờ nhóm duyệt.', '', '', '', '',
]];
decisionSheet.getRange('A1:E2').format.rowHeight = 24;
styleTable(decisionSheet,
  ['Decision ID', 'Feature liên quan', 'Nội dung cần chốt', 'Ghi chú của bản nháp', 'Quyết định của nhóm'],
  decisions, [15, 38, 67, 77, 45], 'OpenDecisions', 4);
decisionSheet.getRange('E5:E15').format.fill = '#FFF2CC';
decisionSheet.tabColor = '#A5ADB5';

workbook.recalculate();
const checked = await workbook.inspect({
  kind: 'region', sheetId: 'User stories', range: 'A1:F3',
  maxChars: 2200, tableMaxCellChars: 120, tableMaxCols: 6, tableMaxRows: 3,
});
console.log(checked.ndjson);
const errors = await workbook.inspect({
  kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',
  options: { useRegex: true, maxResults: 20 }, maxChars: 1000,
});
console.log(errors.ndjson);

for (const [sheetName, range, filename] of [
  ['User stories', 'A1:F4', 'stories-preview.png'],
  ['Features', 'A1:I6', 'features-preview.png'],
  ['Can chot', 'A1:E7', 'decisions-preview.png'],
  ['Actors', 'A1:F7', 'actors-preview.png'],
  ['Dieu chinh', 'A1:F5', 'changes-preview.png'],
  ['User stories', 'A37:F40', 'new-stories-preview.png'],
]) {
  const preview = await workbook.render({ sheetName, range, scale: 1.4, format: 'png' });
  await fs.writeFile(`${outputDir}${filename}`, new Uint8Array(await preview.arrayBuffer()));
}
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(`${outputDir}chung-cu-actors-features-stories.xlsx`);
await fs.writeFile(`${outputDir}stories-reviewed-data.json`, JSON.stringify({ actors, features, stories, decisions, changes: changeRows }, null, 2));
console.log(JSON.stringify({ actorCount: actors.length, sourceFeatureCount: sourceFeatureMap.size, addedFeatureCount: newIds.size, featureCount: features.length, storyCount: stories.length, decisionCount: decisions.length, output: `${outputDir}chung-cu-actors-features-stories.xlsx` }));
