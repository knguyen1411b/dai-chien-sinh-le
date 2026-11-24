# AGENTS.md

## Phạm vi

- Phát triển **game web chạy trực tiếp trên trình duyệt** bằng HTML, CSS và JavaScript/TypeScript.
- Không tạo dự án Unity, mã C#, scene/prefab hay bản Unity WebGL. Chỉ thay đổi định hướng khi người dùng yêu cầu rõ ràng.
- Trả lời và viết hướng dẫn chơi bằng tiếng Việt; giữ tên API và định danh theo quy ước mã nguồn.
- Trước khi lập kế hoạch game jam, chọn gameplay, chuẩn bị bài nộp hoặc pitch, đọc [RULE.md](RULE.md).

## Yêu cầu

- Khi tôi chat với bạn hãy lưu nội dung chat của tôi (prompt) vào [PROMPT.md](PROMPT.md)

## Trước khi triển khai

1. Đọc hướng dẫn thư mục con, xem cấu trúc thực tế, `package.json` và lockfile nếu có. Không giả định template, asset hoặc script đã tồn tại.
2. Nêu giả định, phạm vi và cách kiểm chứng. Hỏi khi thiếu thông tin ảnh hưởng trực tiếp tới kết quả; tự xử lý lựa chọn triển khai thông thường.
3. Với việc nhiều bước, nêu kế hoạch ngắn kèm điều kiện hoàn thành từng bước.
4. Dùng đường dẫn tương đối theo repository, không gắn cứng đường dẫn máy khác.

## Công nghệ

- Với mã nguồn có sẵn, giữ stack và package manager hiện tại trừ khi yêu cầu cần thay đổi.
- Khi được yêu cầu tạo game mới và chưa có stack: mặc định **Vite + TypeScript + React**, gameplay 2D dùng **Canvas 2D**, menu/HUD dùng React và CSS.
- Chỉ thêm engine hoặc thư viện 3D khi gameplay cần và đã nêu lý do. Tạo một game theo yêu cầu, không tự dựng nhiều template.
- Giữ trạng thái cập nhật mỗi frame ngoài React state; chỉ đồng bộ dữ liệu HUD cần hiển thị. Dọn animation loop, timer, listener và tài nguyên âm thanh khi unmount hoặc khởi tạo lại.
- Đọc scripts thật trước khi chạy dev/build/test. Chưa có `package.json` thì không tuyên bố các lệnh đã dùng được. Dùng một package manager và lockfile thống nhất.

## Sửa mã

- Viết phần tối thiểu đáp ứng yêu cầu; không thêm tính năng, cấu hình hay abstraction dự phòng.
- Chỉ sửa phần liên quan, theo phong cách hiện có; không refactor hoặc định dạng lại phần lân cận.
- Xóa import, biến và hàm bị bỏ dùng do chính thay đổi này. Chỉ báo lại mã chết có sẵn nếu nằm ngoài phạm vi.
- Tách logic luật chơi khỏi phần vẽ/DOM khi cần kiểm thử; tránh kiến trúc nhiều lớp cho game nhỏ.
- Giữ asset cục bộ cho demo offline. Chỉ ghi nguồn, giấy phép và kết quả kiểm thử đã xác minh.

## Yêu cầu game web

- Vòng chơi hoàn chỉnh: bắt đầu → chơi → thắng/thua → chơi lại. Hướng dẫn mục tiêu và phím đúng với game thật, đọc hiểu trong 5 giây đầu.
- Phím `R` và nút “Chơi lại” reset tại chỗ, không reload trang hoặc tải lại asset. Mục tiêu phản hồi dưới 100 ms; chỉ báo đạt khi đã đo.
- Dùng `requestAnimationFrame`, tính di chuyển theo thời gian và giới hạn bước thời gian khi quay lại tab. Xóa trạng thái phím khi mất focus để tránh kẹt điều khiển.
- Chặn cuộn trang cho phím chơi khi vùng chơi hoạt động; không chặn nhập liệu trong ô văn bản. Quy đổi tọa độ chuột theo kích thước canvas hiển thị.
- Canvas thích ứng kích thước cửa sổ và mật độ điểm ảnh. Giới hạn thực thể, particle và âm thanh đồng thời để giữ nhịp khung hình ổn định.
- Kích hoạt Web Audio sau tương tác người dùng; có nút bật/tắt âm thanh. Dùng rung màn hình, hit stop, điểm bay khi phù hợp gameplay; hit stop phải kết thúc được khi mô phỏng tạm ngưng.
- Nếu lưu kỷ lục bằng `localStorage`, game vẫn chơi được khi lưu trữ không khả dụng.

## Kiểm chứng và bàn giao

1. Chạy build production, typecheck, lint và test liên quan nếu đã cấu hình. Với lỗi logic, thêm test tái hiện khi phù hợp; tránh test chỉ lặp lại implementation.
2. Thử trên trình duyệt: bắt đầu, điều khiển, thắng/thua, chơi lại nhiều lần, resize, đổi tab, bật/tắt âm thanh. Kiểm tra Console và Network cho lỗi runtime và asset thiếu.
3. Chạy bản production qua static server/preview. Không lấy dev server làm bằng chứng bản build chạy được hoặc yêu cầu nhấp đúp HTML qua `file://`.
4. Báo thay đổi, cách chạy và kết quả thực tế; ghi rõ bước chưa kiểm tra hoặc bị chặn. Không tuyên bố đã test nếu chưa chạy.
5. Khi chuẩn bị bài nộp game jam, ghi trung thực prompt, đầu ra AI, phần con người sửa và bằng chứng vào `AI_SHOWCASE/AI_REPORT.md`; chỉ tạo/cập nhật khi thuộc phạm vi công việc.
