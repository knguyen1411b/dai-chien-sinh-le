# RULE.md — Kế hoạch game web cho IT GAME JAM 2026 – WITH AI

## 1. Định hướng và nguồn thông tin

Đội chọn làm **game web bằng HTML/CSS/JavaScript/TypeScript**, chơi trực tiếp trên trình duyệt, bàn giao website tĩnh. Không dùng Unity hoặc bản xuất Unity WebGL. Hướng dẫn thao tác cho agent nằm trong [AGENTS.md](AGENTS.md).

Thông tin cuộc thi dưới đây giữ từ ghi chép người dùng cung cấp, **chưa đối chiếu văn bản chính thức của BTC**. Trước ngày thi cần xác nhận thời lượng, thiết bị, quyền dùng template/tài nguyên chuẩn bị trước, AI, thang điểm và cách nộp game web. Khi có thể lệ chính thức, cập nhật phần ghi chép theo nguồn đó; làm game web là lựa chọn riêng của đội.

| Nội dung | Ghi chép hiện có |
| --- | --- |
| Tên cuộc thi | IT GAME JAM 2026 – WITH AI |
| Đơn vị tổ chức | LCĐ Khoa CNTT, Trường ĐH Khoa học, Đại học Huế |
| Thời lượng | 150 phút |
| Nhân sự, thiết bị | 3 thành viên, 1 laptop và 1 sạc |
| Chuẩn bị khác | Giấy nháp A4, thẻ sinh viên; bảng bình chọn theo hướng dẫn BTC |

## 2. Mục tiêu sản phẩm và điểm số dự kiến

| Tiêu chí trong ghi chép | Điểm | Mục tiêu của đội |
| --- | ---: | --- |
| Ý tưởng sáng tạo | 40 | Một cơ chế khác biệt giải thích được trong một câu, có lựa chọn hoặc đánh đổi rõ ràng |
| Trải nghiệm chơi | 20 | Hiểu nhanh, điều khiển rõ, phản hồi tốt và muốn chơi lại |
| Hiện thực hóa | 20 | Một vòng chơi hoàn chỉnh, bản build chạy được, không lỗi cản trở demo |
| Sử dụng AI | 10 | Có prompt, đầu ra, kiểm chứng và phần con người chỉnh sửa |
| Trình bày | 10 | Pitch 90 giây, demo thể hiện đúng điểm sáng tạo |

Đây là mục tiêu chuẩn bị, không phải cam kết điểm số hoặc giải thưởng. Thông tin vòng thi, lịch bình chọn và giải khán giả cần xác nhận với BTC.

## 3. Phạm vi trong 150 phút

- Chốt chủ đề, hành động chính, điều kiện thắng/thua và cơ chế khác biệt trước khi dựng game.
- Ưu tiên một màn hoặc một chế độ hoàn chỉnh. Chỉ thêm nội dung sau khi vòng chơi chính và chơi lại hoạt động.
- Mặc định demo trên Chrome/Edge desktop bằng bàn phím/chuột. Chỉ làm cảm ứng khi có yêu cầu.
- Hướng dẫn phím theo game thật; ví dụ game di chuyển có thể dùng `WASD / phím mũi tên`, `Space`, `R`.
- Tránh tài khoản, backend, multiplayer và dịch vụ mạng nếu gameplay không cần.
- Dùng template hoặc tài nguyên chuẩn bị trước chỉ khi BTC cho phép; ghi nguồn và phần tái sử dụng.

## 4. Quy trình kỹ thuật web

### Khi chưa có mã nguồn

Chỉ khởi tạo khi có yêu cầu làm game. Chọn stack theo AGENTS.md, tạo một dự án và ghi lệnh chạy thật trong README. Các đường dẫn `src/`, `public/`, `dist/` là cấu trúc dự kiến cho đến khi dự án được tạo; không giả định có template hoặc asset sẵn.

### Khi đã có mã nguồn

1. Đọc `package.json`, lockfile và cấu hình; cài dependencies bằng package manager tương ứng.
2. Chạy script dev đã khai báo, dùng URL server in ra; không giả định cổng luôn là 5173.
3. Hoàn thiện gameplay chính, sau đó thêm HUD, âm thanh và hiệu ứng vừa đủ. Dùng asset cục bộ có quyền sử dụng.
4. Chạy kiểm tra đã cấu hình, build production và mở bản build qua static server/preview.
5. Ghi từng bước khởi chạy và phục vụ bản build. Game dùng ES modules cần HTTP server, không chỉ nhấp đúp file HTML.

Không mô tả số lượng template, asset, phiên bản framework hoặc script là “có sẵn” trước khi kiểm tra filesystem.

## 5. Phân công ba thành viên

| Thành viên | Trách nhiệm |
| --- | --- |
| T1 — Lập trình | Điều khiển laptop, tích hợp mã web, xử lý lỗi, build và chuẩn bị demo |
| T2 — Ý tưởng và trình bày | Chốt twist cùng đội, chuẩn bị bảng bình chọn theo yêu cầu BTC, viết và tập pitch |
| T3 — QA và minh chứng AI | Ghi lỗi khi chơi thử, kiểm tra asset/giấy phép, chụp bằng chứng thật và ghi báo cáo AI |

Phối hợp dùng chung máy theo giới hạn thiết bị; không giả định có thêm máy hoặc tài khoản trả phí.

## 6. Timeline 150 phút

| Thời gian | Công việc | Điều kiện hoàn thành |
| --- | --- | --- |
| 00–15 phút | Đọc đề, chọn phạm vi và twist | Một câu mô tả game, mục tiêu và điều khiển rõ ràng |
| 15–45 phút | Dựng gameplay chính | Chơi được cơ chế cốt lõi trên trình duyệt |
| 45–90 phút | Hoàn thiện vòng chơi, HUD, âm thanh và phản hồi | Bắt đầu → chơi → kết thúc → chơi lại hoạt động |
| 90–120 phút | Cân bằng, QA, hoàn thiện báo cáo AI | Khóa tính năng, xử lý lỗi chặn demo |
| 120–140 phút | Build và thử bản production | Bản nộp chạy theo hướng dẫn, không thiếu asset |
| 140–150 phút | Tập pitch và bàn giao | Demo sẵn sàng, hồ sơ và đường dẫn/file nộp đầy đủ |

## 7. Checklist trước khi nộp

- [ ] Người mới hiểu mục tiêu và điều khiển trong 5 giây.
- [ ] Có bắt đầu, gameplay, thắng/thua và chơi lại; điểm cập nhật/reset đúng nếu có.
- [ ] `R` và nút “Chơi lại” không reload trang; thử nhiều lần không nhân đôi loop, listener hoặc âm thanh.
- [ ] Điều khiển đúng sau resize, mất focus hoặc quay lại tab.
- [ ] Âm thanh bắt đầu sau tương tác, có nút bật/tắt.
- [ ] Console không có lỗi runtime chưa xử lý; Network không thiếu asset.
- [ ] Build production và các kiểm tra liên quan đã chạy; ghi rõ phần chưa kiểm tra.
- [ ] Bản production chạy qua HTTP trên máy demo. Nếu cần offline, thử khi ngắt mạng và loại phụ thuộc CDN/font/API ngoài.
- [ ] README ghi đúng lệnh cài đặt, dev, build và phục vụ bản nộp.
- [ ] Định dạng nộp được BTC chấp nhận; xác nhận riêng nếu BTC chỉ ghi “WebGL” mà chưa nói rõ game HTML5.
- [ ] Hồ sơ AI và nguồn/giấy phép asset phản ánh đúng quá trình thực hiện.

## 8. Bộ bàn giao dự kiến

1. **Game web chơi được**: Link nếu BTC chấp nhận, hoặc ZIP bản build kèm hướng dẫn chạy bằng static server. Nộp mã nguồn/lockfile nếu BTC yêu cầu.
2. **Minh chứng AI**: `AI_SHOWCASE/AI_REPORT.md` và ảnh chụp thật; ghi công cụ, prompt tiêu biểu, đầu ra dùng trong game, phần con người sửa và cách kiểm chứng. Không dựng bằng chứng hoặc ghi công cụ chưa dùng.
3. **Pitch 90 giây**: Có thể lưu tại `AI_SHOWCASE/PITCH_KIT.md` khi chuẩn bị bài nộp.
4. **Bảng bình chọn**: Theo yêu cầu và vật liệu BTC cung cấp.

## 9. Chi phí và tài nguyên

- Chỉ dùng công cụ trả phí đội đã có quyền sử dụng; không tự mua, nâng gói hoặc đăng ký dịch vụ phát sinh phí.
- Với công cụ khác, kiểm tra giới hạn miễn phí và điều khoản tại lúc sử dụng; không giả định quota hay quyền sử dụng thương mại.
- Ưu tiên asset cục bộ do đội tạo hoặc có giấy phép phù hợp. Ghi nguồn, giấy phép, tác giả khi cần; không tự gắn nhãn CC0 cho asset chưa kiểm tra.
- Có thể tạo SFX bằng Web Audio hoặc dùng file có quyền sử dụng; tránh để demo phụ thuộc dịch vụ sinh nội dung trực tuyến.

## 10. Khung pitch 90 giây

- **0–15 giây**: Chủ đề, tên game và cơ chế khác biệt trong một câu.
- **15–45 giây**: Demo thật, thể hiện lựa chọn/đánh đổi và điều kiện thắng/thua.
- **45–75 giây**: Nêu đúng công nghệ web, AI hỗ trợ việc gì, đội chỉnh sửa và kiểm chứng ra sao; mở bằng chứng nếu cần.
- **75–90 giây**: Mời chơi thử, chỉ cách chơi lại.

Chỉ trình bày tính năng và kết quả đã kiểm chứng; không tuyên bố “không có lỗi” hoặc đạt hiệu năng mục tiêu khi chưa đo.
