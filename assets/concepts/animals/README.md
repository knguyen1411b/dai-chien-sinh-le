# Con vật — concept v1 chờ duyệt

Nguồn nội dung: GDD Sơn Tinh – Thủy Tinh: Đại Chiến Sính Lễ 4.0. Tạo bằng công cụ imagegen tích hợp, dùng characters-v1.png làm tham chiếu phong cách. Chưa triển khai gameplay.

| File | Nội dung |
| --- | --- |
| animals-01-market-v1.png | Hàng trên: trâu, hươu, rùa. Hàng dưới: hổ, voi thường, voi chín ngà |
| animals-02-village-v1.png | Hàng trên: gà thường, gà con, gà trống. Hàng dưới: gà vàng chín cựa, chó làng |
| animals-03-horse-states-v1.png | Ngựa: hung hăng, bình tĩnh, thuần phục từ trái sang phải |
| animals-04-water-monsters-v1.png | Cua và thuồng luồng |

## Trạng thái duyệt

- Tổng cộng 14 loại con vật, ngựa có thêm hai trạng thái. Đây là bảng concept, chưa phải sprite sheet có tọa độ hoặc animation.
- Giữ nét đậm, màu đất, chàm, vàng và họa tiết dân gian thống nhất bộ nhân vật.
- Các chi tiết chín ngà/cựa/hồng mao là điểm nhận diện cần duyệt kỹ ở ảnh gốc. Đặc biệt bờm ngựa còn các dải chồng lên nhau, chưa coi là bộ chín sợi độc lập để bật/tắt theo nhịp.
- Bảng thú chợ và bảng gà/chó còn nền màu và quầng sáng, cần tách nền trước khi dùng trực tiếp. Các ảnh khác cũng cần kiểm tra alpha và viền sau khi duyệt.
- Cần duyệt tạo hình trước khi tách từng con, chuẩn hóa kích thước, pivot, góc nhìn gameplay và tạo các frame chuyển động. Bảng gà hiện là góc ba phần tư, cần góc cao hơn cho màn sân đình nếu dùng sprite nhìn từ trên xuống.
- Không ghi đè ảnh cũ; không thêm mã game.

## Prompt gốc

### animals-01-market-v1.png

Use case: stylized-concept. Create a transparent-background animal concept sheet for Vietnamese folklore game Son Tinh Thuy Tinh. Match ONLY the art style of reference: Dong Ho inspired 2D woodblock, thick dark brown outlines, warm paper/ink grain INSIDE shapes, flat brick red turmeric yellow jade indigo palette, appealing readable expressive silhouettes. Reference characters must NOT appear. All animals full body with feet tails horns fully within image. Generous transparent gaps, no overlap, no cast ground shadows, no letters labels frames scenery UI watermark. Concept approval illustrations, not animation frames. Six distinct animals, orderly 3 columns by 2 rows. Top row left to right: dark charcoal Vietnamese water buffalo with crescent horns; golden brown spotted deer; jade green land turtle. Bottom row: orange black striped tiger; ordinary gray Asian elephant with TWO ivory tusks; magnificent pale warm gray mythical nine-tusk elephant with ochre gold Dong Son ceremonial forehead ornament and exactly NINE individually distinguishable ivory tusks fanning forward (five on near side, four on far side). Every animal faces left in clean side/three-quarter view. Ordinary elephant visually modest, nine-tusk elephant regal. Do not add trunks to other animals. Preserve animal anatomy.

### animals-02-village-v1.png

Use case: stylized-concept. Create a transparent-background animal concept sheet for Vietnamese folklore game Son Tinh Thuy Tinh. Match ONLY the art style of reference: Dong Ho inspired 2D woodblock, thick dark brown outlines, warm paper/ink grain INSIDE shapes, flat brick red turmeric yellow jade indigo palette, appealing readable expressive silhouettes. Reference characters must NOT appear. All animals full body with feet tails horns fully within image. Generous transparent gaps, no overlap, no cast ground shadows, no letters labels frames scenery UI watermark. Concept approval illustrations, not animation frames. Five village animals in spacious arrangement with no labels. Top row three: plump warm terracotta brown hen; tiny fluffy turmeric yellow chick; proud red-combed ordinary rooster with indigo jade tail. Bottom row two: special royal GOLDEN nine-spurred rooster with red comb, elaborate gold jade tail and exactly NINE distinct sharp backward spurs TOTAL on its two shanks (five near leg four far leg), toes must be visually separate from spurs; friendly alert Vietnamese village dog warm ochre short fur curled tail. Near overhead three-quarter view suitable for top-down village herding game; heads feet bodies distinct, anatomy readable. Golden special rooster much more luminous and ornate than ordinary rooster.

### animals-03-horse-states-v1.png

Use case: stylized-concept. Create a transparent-background animal concept sheet for Vietnamese folklore game Son Tinh Thuy Tinh. Match ONLY the art style of reference: Dong Ho inspired 2D woodblock, thick dark brown outlines, warm paper/ink grain INSIDE shapes, flat brick red turmeric yellow jade indigo palette, appealing readable expressive silhouettes. Reference characters must NOT appear. All animals full body with feet tails horns fully within image. Generous transparent gaps, no overlap, no cast ground shadows, no letters labels frames scenery UI watermark. Concept approval illustrations, not animation frames. One consistent mythical Vietnamese horse with nine red mane locks, shown THREE times in one horizontal row, full-body side view facing left, same size and identical design markings across poses. Horse has warm ivory body, dark brown hooves, simple bronze Dong Son forehead ornament, exactly NINE thick clearly separated crimson pink mane locks along neck (do not confuse with long flowing red tail). Left: wild angry rearing on hind legs, ears back mouth open. Center: alert calming, all four hooves down head raised ears attentive. Right: tamed gentle head bowed and kind eyes all four hooves down. No saddle rider rope or text. Widely separate three poses, transparent backdrop. Large clean countable mane locks more important than tiny detail.

### animals-04-water-monsters-v1.png

Use case: stylized-concept. Create a transparent-background animal concept sheet for Vietnamese folklore game Son Tinh Thuy Tinh. Match ONLY the art style of reference: Dong Ho inspired 2D woodblock, thick dark brown outlines, warm paper/ink grain INSIDE shapes, flat brick red turmeric yellow jade indigo palette, appealing readable expressive silhouettes. Reference characters must NOT appear. All animals full body with feet tails horns fully within image. Generous transparent gaps, no overlap, no cast ground shadows, no letters labels frames scenery UI watermark. Concept approval illustrations, not animation frames. Two water enemies in separate spacious regions: LEFT a stylized indigo teal giant river crab with two bronze gold claws, expressive fierce eyes and eight articulated walking legs, slightly top-down view; RIGHT a Vietnamese thuong luong water serpent monster, long sinuous jade indigo scaled body, crocodilian dragonlike snout, small ochre horns, red fin crest, curling tail, two small forelimbs, side view facing left, threatening yet suitable for friendly folk game. Keep whole silhouettes separated, no water waves bubbles or scenery. The serpent is a river monster, no wings. Two designs only.


