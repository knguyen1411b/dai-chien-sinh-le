# Sơn Tinh – Thủy Tinh: Đại Chiến Sính Lễ 4.0

Game web React + TypeScript + Vite, dùng các ảnh mới trong `assets/concepts` và âm thanh tổng hợp cục bộ trong `assets/audio`. Giao diện tông kem sáng, chữ nâu đậm, đỏ gạch và xanh ngọc. Khung chơi 1280×720 được thu/phóng theo cửa sổ, không cuộn trang hay camera.

## Chạy trên máy

Từ thư mục `D:\Games\game`:

```powershell
bun install
bun run dev
```

Mở URL Vite hiển thị (script hiện đặt cổng 3000). Không cần API key, tài khoản AI hoặc backend để chơi. Font Be Vietnam Pro (Latin + tiếng Việt, 400/600/700) được đóng gói từ dependency `@fontsource/be-vietnam-pro`, không tải từ Google Fonts khi chơi. Dùng Chrome/Edge desktop, bàn phím và chuột.

```powershell
bun run lint
bun run build
bun run preview
```

Bản production nằm trong `dist`; phục vụ qua HTTP/static server, không mở HTML bằng cách nhấp đúp. Các hình và WAV được Vite đóng gói, không cần Google Fonts/CDN.

## Nội dung bản nâng cấp

- Menu cố định cùng bốn lựa chọn luyện màn và chọn độ khó.
- Truyện mở đầu: Vua Hùng ra đề, giới thiệu cuộc đua sính lễ.
- Màn 1: A/D hoặc ← → di chuyển Sơn Tinh cầm dây, băng chuyền chung, thòng lọng thắt chắc/lỏng, bấm kéo, bot và Phước Trời. Chỉ voi chín ngà giúp qua màn, 75 giây.
- Màn 2: gà đã giao hiển thị và chuyển động nhẹ trong chuồng; 13 gà gồm gà chín cựa, thóc thường/nếp vàng, hú lùa, mang tối đa ba gà và tự thả vào lồng góc phải trên; chó và cua phá bĩnh. Bắt tám gà thường cộng gà chín cựa, 100 giây.
- Màn 3: nhịp điệu bốn làn A/S/K/L hoặc mũi tên, 100 BPM, 18 đoạn, cửa sổ chấm 60/120ms. Có hiệu chỉnh tám nhịp và thanh chỉnh độ trễ. Dùng đồng hồ Web Audio, hỗ trợ tạm dừng.
- Cầu nối rước dâu: Vua Hùng giữ lời, Mị Nương về núi, Thủy Tinh nổi giận.
- Màn 4: đá/cây/tảng sinh trên hai sườn núi; A/D đi trên sườn, E nhặt đá hoặc giữ E nhổ cây/vác tảng. Mang về bệ giữa và E để nâng cả nền đất, nhân vật và vật liệu cùng nâng lên. Cua/thuồng luồng ở dưới mặt nước, dừng ở mép nước phá chân núi; không leo lên bờ. Chuột trái ném đá xuống nước; chuột phải dùng cây dựng tường ở mép nước phía phải; Q nâng núi và đẩy nước. Các đợt sóng ở giây 12/24/36/48/54, mưa lớn giây 20–35.
- Đoạn kết mở thử thách vô tận. Lưu điểm tốt nhất và tiến độ theo màn trên máy, dùng khóa lưu v2 riêng với bản cũ.
- Đếm 3–2–1, tạm dừng khi mất focus, nút âm thanh, hiệu ứng chữ bay/rung/hit stop và chat Văn Lang Live.
- R chơi lại đúng màn, Esc tạm dừng; không tải lại trang hoặc ảnh. Chơi lại giữ các màn đã hoàn thành.

## Phạm vi và phần cần hoàn thiện

Đây là bản tích hợp gameplay theo GDD, có các giản lược cần chơi thử để cân bằng:

- Ảnh nhân vật/con vật dùng vùng cắt trực tiếp từ bảng concept; chưa có animation sprite nhiều hướng. Bờm ngựa nguyên bản giữ nguyên, chín chỉ báo hồng mao được vẽ riêng trên HUD.
- Đàn gà dùng tách đàn/đi lang thang/né người/dụ thóc; chưa mô phỏng đầy đủ cả năm lực flocking. Chướng ngại bụi chuối chủ yếu thể hiện bằng che khuất; chưa có va chạm chi tiết từng bụi.
- Chưa có ba vật phẩm phụ bánh chưng/bánh giầy/nón lá; chưa có bảng Top 10 hoặc chế độ hai người.
- Nhạc là các vòng phối tổng hợp ngũ cung mới, không phải thu âm hát xẩm/chầu văn hoặc giọng kể. Màn nhạc dùng cùng nền nhạc khi hụt nốt, chưa tắt riêng lớp giai điệu.
- Màn 4 lấy dải mây từ nền concept, vẽ một núi tương tác và nước bằng Canvas để tránh trùng núi/nhà. Đây là địa hình cách điệu, chưa có bộ animation đất nâng lên riêng.
- Cần người chơi cân bằng độ khó, độ rõ của sprite và tương tác ở từng màn trên laptop thực tế.

Theo yêu cầu của người dùng, đã dừng chạy kiểm tra trước khi hoàn tất các chỉnh sửa cuối. Hãy tự chạy các lệnh trên và chơi thử cả bốn màn.

## Âm thanh

Sinh lại WAV bằng:

```powershell
node scripts/generate-audio.mjs
```

21 file gồm 17 hiệu ứng và bốn vòng nhạc 4.8 giây (100 BPM). Âm thanh tạo từ dao động số, không sử dụng sample của bên thứ ba. Nguồn và ghi chú assets ở `assets/CREDITS.md`.


## Menu và kể chuyện theo mẫu mới

Menu dùng nền giấy với khung viền, tiêu đề Playfair Display hỗ trợ tiếng Việt, chọn độ khó bằng ba nút, nút bắt đầu đỏ gạch và các ô chọn màn có sao thực tế. Cài đặt cho phép bật/tắt tiếng và chỉnh độ trễ. Truyện mở đầu gồm hai khung với tranh Vua Hùng ra đề, hộp thoại ở đáy; Space/Enter để tiếp, Esc để bỏ qua. Truyện rước dâu và đoạn kết dùng chung bố cục này. Hai nền mới và prompt lưu trong `assets/concepts/ui`. Không chạy game/build sau đợt sửa này theo yêu cầu người dùng.

## Bố cục Màn 4 — núi trái, bãi đá phải

Núi và bệ nâng đặt bên trái, nhà Mị Nương nằm trên đỉnh. Bãi nhặt đá riêng ở bên phải, nối bằng lối dốc đi bộ được. Đá có sẵn tăng từ 6 lên 14 viên, giới hạn tăng từ 8 lên 18, bổ sung một viên mỗi 0.6 giây thay vì 1.5 giây. Giữ E gần đá để nhặt, mang tối đa 4 ô, đi sang trái và E tại bệ để nâng núi. Cua vẫn dưới nước; chế độ Dễ không làm rơi đồ khi sóng chạm. Khung nhìn cố định, không cuộn. Chưa chạy kiểm tra theo yêu cầu người dùng.
