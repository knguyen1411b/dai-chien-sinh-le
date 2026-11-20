# Nền menu và kể chuyện theo mẫu mới

Tạo bằng imagegen tích hợp, dựa trên hai ảnh giao diện tham chiếu do người dùng cung cấp ngày 2026-11-20. Ảnh tạo mới không chứa chữ/nút; toàn bộ chữ và điều khiển do React/CSS hiển thị.

- `menu-legend-v1.png`: nền giấy, núi/biển, Sơn Tinh – Thủy Tinh, họa tiết trống đồng; vùng trái dành cho menu.
- `story-palace-v1.png`: Vua Hùng, triều đình và ba sính lễ; hộp thoại được đặt trên ảnh trong ứng dụng.

Khung ứng dụng giữ tỷ lệ 16:9 nên bố cục được điều chỉnh theo chiều cao so với ảnh tham chiếu. Không sao chép giao diện thành một ảnh phẳng. Không chạy kiểm tra giao diện/build theo yêu cầu người dùng.

## Prompt gốc

### menu-legend-v1.png

Generate a clean background illustration ONLY for Vietnamese folklore game title screen, based on reference screenshot's illustrated background style. Wide 16:9 aspect. Do NOT reproduce screenshot text, letters, buttons, border or UI. Warm aged ivory do paper with subtle cloud wisps on left 55 percent deliberately very quiet pale parchment empty space for title and buttons. On right half, Dong Ho folk woodblock illustration: mountain god Son Tinh in terracotta golden ancient Vietnamese costume standing on tall jade crag around center-right, water god Thuy Tinh with long dark blue flowing hair blue beard golden crown wielding curved sword standing on mythical river serpent amid curling indigo waves at lower right; engraved Dong Son bronze drum sun disk large faint ochre at upper right. Flat outlined hand printed detailed folk art, dark brown ink, turmeric gold, vermilion and indigo, warm paper texture. Retain subjects entirely within image. Pure illustration with no lettering, no typography, no interface, no watermark. Composition must leave LEFT HALF empty and pale, dominant artwork at right. Reference image is UI screenshot for style and composition only, not an edit target.

### story-palace-v1.png

Generate a clean full bleed background painting for a Vietnamese folklore story cutscene, 16:9 landscape, using the reference screenshot as illustration and framing guide ONLY. No UI text captions buttons or letters of any kind. Vietnamese Dong Ho folk woodblock printed style on aged golden ivory paper, strong dark brown ink outlines, ochre vermilion indigo, intricate Dong Son bird/drum geometric border within the illustration. King Hung XVIII seated centered on carved golden wooden throne in ancient Van Lang palace, red gold indigo ceremonial robes with feather crown, four courtiers and Mi Nuong standing symmetrically to sides, red roof and carved wooden columns overhead, gold curling clouds and distant village trees. A ceremonial ivory elephant at lower left, golden rooster near lower center, red maned chestnut horse at lower right. These are the three wedding offerings. Keep King face in upper middle and all important storytelling in top 70 percent; bottom 28 percent may be covered by future dialogue UI. Rich detailed folk painting, completely flat no 3D. No modern architecture, no captions, no speech bubbles, no watermark. Do not copy screenshot interface, only the artwork aesthetic.

