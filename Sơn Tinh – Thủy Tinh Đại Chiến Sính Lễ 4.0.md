# Sơn Tinh – Thủy Tinh: Đại Chiến Sính Lễ 4.0

*Tài liệu thiết kế game (GDD) · Bản 2 · Chế độ 1 người (Sơn Tinh) đấu bot Thủy Tinh · Chủ đề cuộc thi “Dân gian Remix”*

## 1. Tổng quan

**Ý tưởng một câu:** kể lại truyện Sơn Tinh – Thủy Tinh như một show tuyển rể “live” thời 4.0. Vua Hùng ra đề sính lễ, hai chàng thi qua ba thử thách, ai nộp trước thì thắng. Thủy Tinh thua nên nổi giận, dâng nước đánh núi ở màn cuối.

| Mục | Quyết định |
| --- | --- |
| Nền tảng | Web (HTML5), chơi trên máy tính bằng bàn phím + chuột |
| Công nghệ gợi ý | Phaser 3 (Arcade Physics) + JavaScript hoặc TypeScript |
| Chế độ | 1 người chơi (Sơn Tinh) đấu bot Thủy Tinh. Chế độ 2 người làm sau, nhưng code phải chừa sẵn chỗ (xem mục 8) |
| Số màn | 4 màn + 2 đoạn cắt cảnh |
| Thời lượng | Mỗi màn 60–100 giây, cắt cảnh 15–20 giây, trọn game khoảng 7–9 phút nếu không thua |
| Phong cách | Tranh Đông Hồ + họa tiết trống đồng. Màu đỏ gạch, vàng nghệ, xanh lam, nền giấy dó. Nhân vật 2D phẳng/vector |
| Âm nhạc | Hát xẩm, chầu văn, trống hội phối lo-fi hoặc EDM (điểm “remix” chính) |
| Độ khó | Dễ / Thường / Khó. Chỉ đổi thông số của bot, không đổi luật chơi |

### Tóm tắt 4 màn

| Màn | Tên | Kỹ năng | Điều khiển | Giới hạn thời gian | Thắng khi | Thua khi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Voi chín ngà | Canh thời điểm, bấm nhanh, may rủi có bảo hiểm | Space (hoặc click) | 75 giây | Kéo được voi chín ngà trước Thủy Tinh | Hết giờ, hoặc Thủy Tinh kéo được voi trước |
| 2 | Gà chín cựa | Di chuyển, lùa đàn, đọc hành vi | WASD + chuột + Space | 100 giây | Bỏ đủ 8 gà và gà chín cựa vào lồng | Hết giờ, hoặc cua tha mất quá 4 gà |
| 3 | Ngựa chín hồng mao | Nhịp điệu, phản xạ | 4 phím A S K L | Tối đa 18 đoạn nhạc (\~86 giây) | Đủ 9 sợi hồng mao trước Thủy Tinh | Thủy Tinh đủ 9 sợi trước, hoặc hết nhạc |
| 4 | Lấp biển dời núi | Sinh tồn, quản lý tài nguyên | WASD + chuột + E | 60 giây (chiến dịch) hoặc vô tận | Sống đến hết 60 giây | Nước dâng cao hơn đỉnh núi |

**Quy ước “chơi lại”:** thua màn nào thì chơi lại đúng màn đó từ đầu, tiến độ các màn đã qua được giữ nguyên. Nếu sau này muốn “thua là về Màn 1” thì chỉ cần đổi một tham số cấu hình `retryTarget`.

---

## 2. Luồng game và hệ thống chung

### 2.1 Luồng game

```
Menu → Chọn độ khó → Mở đầu (Vua Hùng ra đề, 10s, có nút Bỏ qua)
  → Màn 1 → Màn 2 → Màn 3
  → Cầu nối: Vua Hùng gả con gái (15–20s)
  → Màn 4 → Kết: Thủy Tinh rút lui + mở chế độ Vô tận
```

Mỗi màn đều đi theo cùng một vòng:

```
INTRO (3s: tên màn + luật 1 dòng + đếm 3-2-1)
  → PLAYING
  → WIN  (hiện sao, nút Tiếp tục)
  → LOSE (hiện lý do thua, nút Chơi lại / Về menu)
```

### 2.2 HUD chung

- **Trên cùng giữa: thanh “Thủy Tinh đang đến”.** Hai thanh tiến độ song song, một của Sơn Tinh, một của Thủy Tinh. Màn 1–3 là tiến độ hoàn thành nhiệm vụ của mỗi bên. Màn 4 đổi thành thanh nước dâng.
- **Góc phải trên:** đồng hồ đếm ngược số lớn. Còn dưới 10 giây thì nhấp nháy đỏ, nhạc trống dồn dập hơn.
- **Góc trái dưới:** vật phẩm đang giữ (nếu có).
- **Dòng chat “Văn Lang Live”:** một dòng chữ chạy ở mép màn hình, không che gameplay, nhảy theo sự kiện. Ví dụ: “Voi chín ngà có ship COD không ạ?”, “Thủy Tinh dẫn trước rồi, Sơn Tinh ơi!”, “Gà này chạy nhanh hơn deadline của mình”. Soạn sẵn 3–5 câu cho mỗi sự kiện, chọn ngẫu nhiên.

### 2.3 Vật phẩm

| Vật phẩm | Hiệu ứng | Có ở màn |
| --- | --- | --- |
| Bánh chưng | +4 giây thời gian | 1, 2 |
| Bánh giầy | Chạy nhanh +30% trong 5 giây | 2, 4 |
| Nón lá | Chặn 1 lần: gà trống mổ, cua kẹp, thủy quái cắn | 2, 4 |

Màn 3 không có vật phẩm để giữ nhịp nhạc thuần.

### 2.4 Sao đánh giá

- 3 sao: qua màn khi còn từ 50% thời gian trở lên.
- 2 sao: còn từ 20% đến dưới 50%.
- 1 sao: qua màn nhưng còn dưới 20%.
- Màn 3 tính theo độ chính xác tổng (tỷ lệ nốt trúng). Màn 4 tính theo chênh lệch cao nhất giữa núi và nước.

### 2.4b Màn thua

Hiện lý do thua bằng một câu, kèm câu “cà khịa” của Thủy Tinh chọn ngẫu nhiên, ví dụ: “Hôm nay ta chưa ăn sáng nên hơi cay.” Nút **Chơi lại** phải là nút to nhất, bấm Space hoặc Enter là chơi lại ngay, để người chơi không bị chán khi thua.

---

## 3. Màn 1: Voi chín ngà

### 3.1 Bối cảnh và mục tiêu

Phiên chợ Văn Lang. Một băng chuyền chạy ngang giữa màn hình, thú vật chạy qua. Sơn Tinh đứng bờ trên, Thủy Tinh đứng bờ dưới, **cả hai dùng chung một băng chuyền**. Mục tiêu: là người đầu tiên kéo được **voi chín ngà** lên bờ của mình. Giới hạn 75 giây.

### 3.2 Điều khiển

- **Space** (hoặc click chuột trái): thả móc, rồi bấm liên tục để kéo.
- Chỉ tính lúc nhấn xuống (không tính giữ phím), để chống treo phím.

### 3.3 Bố cục màn hình (1280×720)

- Băng chuyền nằm ngang ở giữa, cao khoảng 140 px, chạy từ phải sang trái.
- Sơn Tinh đứng bờ trên, có sợi móc/thòng lọng đu đưa như con lắc phía trên băng chuyền.
- Thủy Tinh đứng bờ dưới, móc của bot vươn từ dưới lên.
- Thanh “Phước Trời” nằm ở góc trái dưới. Thanh kéo hiện ngay trên đầu Sơn Tinh khi đang kéo.

### 3.4 Luật chơi chi tiết

**Giai đoạn A – Thả móc (canh thời điểm).**

1. Móc đu qua lại trên băng chuyền: `x = tâm + 480 · sin(2π · t / T)`, với T = 2.0 giây (Dễ 2.4, Khó 1.6).
2. Bấm Space để thả. Móc rơi thẳng xuống trong 0.25 giây.
3. Đo độ lệch `d` giữa móc và tâm con vật lúc móc chạm băng chuyền:
   - `d ≤ 25 px`: **Móc chắc** (vòng xanh). Lực tụt của con vật nhân 0.7.
   - `25 < d ≤ 60 px`: **Móc lỏng** (vòng vàng). Lực tụt nhân 1.3.
   - `d > 60 px`: **Trượt** (vòng đỏ). Thu móc về, chờ 0.6 giây mới được thả lại.
4. Con vật đã bị móc thì bị khóa, bot không móc được nữa.

**Giai đoạn B – Kéo (bấm liên tục).**

1. Thanh kéo chạy 0–100, bắt đầu ở 30.
2. Mỗi lần nhấn Space: +4.
3. Con vật tự kéo ngược: thanh kéo tụt mỗi giây theo “lực tụt” trong bảng con vật (đã nhân hệ số chắc/lỏng).
4. Thanh kéo đạt 100: kéo thành công, con vật bay lên bờ.
5. Thanh kéo về 0: con vật thoát móc, quay lại băng chuyền, người chơi bị chờ 1 giây mới thả được móc mới.
6. Người chơi bấm khoảng 6 lần/giây là mức bình thường, nên các số bên dưới tính theo mức này.

### 3.5 Bảng con vật

| Con vật | Tỷ lệ (trong nhóm thú thường) | Tốc độ băng chuyền | Lực tụt (/giây) | Thời gian kéo ước tính\* | Phần thưởng |
| --- | --- | --- | --- | --- | --- |
| Trâu | 28% | ×1.0 | 10 | \~5s | 10 điểm, 25% rơi bánh chưng |
| Hươu | 24% | ×1.5 | 8 | \~4s | 10 điểm |
| Rùa | 22% | ×0.6 | 6 | \~3s | 10 điểm |
| Hổ | 16% | ×1.2 | 12, thêm giật mạnh −12 mỗi 2 giây | \~6s | 20 điểm |
| Voi thường | 10% | ×0.8 | 12 | \~6s | 20 điểm, 50% rơi bánh chưng |
| **Voi chín ngà** | Theo cơ chế Phước Trời | ×0.9 | 14 | \~7s nếu móc chắc, \~17s nếu móc lỏng | Thắng màn |

\*Ước tính với móc chắc và 6 lần nhấn mỗi giây. Tốc độ băng chuyền cơ bản là 170 px/giây, băng dài 1280 px, nên voi chín ngà ở trên băng khoảng 8 giây. Số này cho đủ thời gian để một người chơi kịp thả móc 1–2 lần.

**Ý nghĩa chiến thuật:** kéo thú thường tốn thời gian nhưng được điểm và bánh chưng. Vì móc chỉ có một cái nên đang kéo trâu mà voi tới là mất cơ hội. Người chơi phải tự quyết định.

### 3.6 Cơ chế xuất hiện voi chín ngà và “Phước Trời”

Mỗi 1.4 giây băng chuyền sinh ra một con vật. Mỗi lần sinh là một “lượt”.

- Tỷ lệ cơ bản ra voi chín ngà: **4%** mỗi lượt.
- Đếm số lượt liên tiếp không ra voi (`n`). Từ lượt thứ 10 trở đi, tỷ lệ tăng dần **+8% mỗi lượt**.
- Công thức: `p = min(100, 4 + max(0, n − 9) × 8)` (đơn vị %). Đến lượt thứ 21 chắc chắn có voi.
- Thanh “Phước Trời” hiển thị `n / 21` để người chơi thấy mình sắp trúng. Gần đầy thì có hiệu ứng vàng rực.
- Voi chín ngà đang trên băng thì không sinh thêm voi chín ngà khác.
- Khi voi chín ngà xuất hiện: tiếng voi rống, hiện biểu ngữ “VOI CHÍN NGÀ!”, **cả hai bên cùng chạy đua**.

```js
function spawnAnimal() {
  if (elephantOnBelt) return pickCommonAnimal();
  const p = Math.min(100, 4 + Math.max(0, missCount - 9) * 8);
  if (Math.random() * 100 < p) { missCount = 0; return NINE_TUSK; }
  missCount++;
  return pickCommonAnimal();   // chọn theo bảng tỷ lệ ở 3.5
}
```

### 3.7 Bot Thủy Tinh (Màn 1)

Bot không cần mô phỏng vật lý, chỉ cần máy trạng thái và tung xúc xắc:

```
IDLE → CHỌN MỤC TIÊU → CHỜ MÓC ĐẾN (thời gian ngẫu nhiên 0.5–1.5s) → THẢ → LẤY KẾT QUẢ → KÉO → XONG
```

- Khi chưa có voi chín ngà: bot chọn ngẫu nhiên một thú thường để kéo (nên bot hay “bận” đúng lúc voi tới, giống người chơi).
- Khi voi xuất hiện: bot đợi hết **thời gian phản ứng** rồi chọn voi, nếu móc đang rảnh.
- Kết quả thả móc được tung theo bảng. Kéo thì mô phỏng tốc độ bấm với nhiễu ±15%.

| Độ khó | Phản ứng với voi | Móc chắc | Móc lỏng | Trượt | Lần bấm/giây |
| --- | --- | --- | --- | --- | --- |
| Dễ | 1.6 giây | 25% | 35% | 40% | 4.0 |
| Thường | 1.1 giây | 40% | 35% | 25% | 5.0 |
| Khó | 0.7 giây | 55% | 30% | 15% | 6.0 |

Nếu bot kéo voi mà thanh kéo của nó về 0 thì voi quay lại băng, cả hai lại tranh tiếp. Nhờ vậy người chơi không bao giờ bị thua hẳn chỉ vì bot nhanh một nhịp.

### 3.8 Thắng / thua

- **Thắng:** kéo voi chín ngà lên bờ trước. Cắt ngắn: Sơn Tinh dắt voi, Vua Hùng gật đầu, tăng thanh tiến độ cho màn sau.
- **Thua:** hết 75 giây, hoặc bot kéo voi xong trước. Hiện câu của Thủy Tinh rồi chơi lại Màn 1.

### 3.9 Phản hồi cảm giác chơi

- Mỗi lần bấm kéo: dây rung nhẹ, âm “tách”. Càng gần 100 thì pitch âm thanh càng cao.
- Móc chắc: tiếng “keng”, vòng xanh. Móc lỏng: tiếng “lách cách”. Trượt: tiếng “vèo”.
- Còn 10 giây: trống dồn, nền ám đỏ nhẹ.

### 3.10 Trường hợp biên cần xử lý

- Hai bên móc cùng một con vật trong cùng một khung hình: bên nào có `timestamp` sớm hơn được khóa. Nếu bằng nhau thì ưu tiên người chơi.
- Con vật đi ra khỏi màn hình khi đang bị móc: coi như thoát móc.
- Voi chín ngà bị thoát móc thì **không** reset bộ đếm Phước Trời, nhưng cho voi quay lại băng.
- Bấm Space khi đang chờ hồi chiêu: bỏ qua, không phạt.

---

## 4. Màn 2: Gà chín cựa

### 4.1 Bối cảnh và mục tiêu

Sân đình làng, nhìn từ trên xuống, kích thước 1280×720 (một màn hình cố định, không cuộn). Có rào bao quanh, một **lồng gà** ở góc phải trên, một **ao** ở góc trái dưới (cua của Thủy Tinh bò ra từ đây), ba **bụi chuối**, một **bồ thóc** ở giữa sân.

**Mục tiêu:** bắt **8 con gà bất kỳ** và **gà chín cựa** bỏ vào lồng trong 100 giây.

### 4.2 Điều khiển

| Phím / chuột | Hành động |
| --- | --- |
| W A S D | Di chuyển (tốc độ 220 px/giây) |
| Chuột trái | Ném nắm thóc tới vị trí con trỏ (tầm tối đa 320 px). Gà trong bán kính 220 px chạy tới ăn, đứng yên ăn 2 giây. Thóc tồn tại 4 giây. Hồi 0.5 giây |
| Chuột phải | “Hè!” – hú đuổi. Gà trong bán kính 160 px quanh **con trỏ** bị đẩy chạy ra xa con trỏ. Hồi 2 giây. Dùng để lùa gà về phía lồng |
| Space | Bắt gà trong bán kính 48 px. Gà vào tay Sơn Tinh |
| Q | Đổi loại thóc (thường / nếp vàng) |

- Mang tối đa **3 gà**. Mỗi gà đang mang làm Sơn Tinh chậm 12%.
- Đi vào vùng lồng thì tự động thả gà vào lồng.
- Nhặt thóc: đi qua bồ thóc ở giữa sân, nạp đầy 8 nắm. Thóc nếp vàng chỉ có 1 nắm lúc đầu, +1 nắm mỗi 20 giây, tối đa mang 2.

### 4.3 Các loại gà

| Loại | Số lượng | Tốc độ đi / chạy trốn | Bán kính sợ | Đặc điểm |
| --- | --- | --- | --- | --- |
| Gà thường | 6 | 110 / 240 | 120 px | Ăn thóc thường |
| Gà con | 4 | 90 / 170 | 80 px | Chậm, dễ bắt nhất. Hay chạy theo gà mẹ (gà thường gần nhất) |
| Gà trống | 2 | 130 / 260 | 100 px | Hung hăng: nếu Sơn Tinh lại gần dưới 90 px và gà không đang ăn thóc, lao tới mổ, **choáng 1.2 giây**. Hồi 5 giây |
| **Gà chín cựa** | 1 | 150 / 300 | 200 px | Vàng, đẹp, không đi theo đàn. **Chỉ ăn thóc nếp vàng**. Chạy trốn tối đa 7 giây rồi mệt, đứng thở 2 giây |

Tổng cộng 13 con trên sân. Cần bắt 8 trong 12 con thường, nên có dư 4 con để cua tha đi.

### 4.4 Hành vi đàn gà (flocking)

Mỗi gà tính một vector di chuyển mỗi khung hình từ năm lực, rồi chuẩn hóa theo tốc độ:

| Lực | Trọng số | Ý nghĩa |
| --- | --- | --- |
| Tách (separation) | 1.5 | Không chen nhau, bán kính 40 px |
| Cùng hướng (alignment) | 1.0 | Đi cùng hướng với gà gần, bán kính 120 px |
| Tụ (cohesion) | 0.8 | Về phía tâm đàn, bán kính 160 px |
| Né người (flee) | 3.0 | Chỉ khi người ở trong bán kính sợ. Càng gần càng mạnh |
| Lang thang (wander) | 0.6 | Đổi hướng nhẹ ngẫu nhiên |

**Thể lực:** mọi gà chạy trốn tối đa 4 giây (gà con 3 giây, gà chín cựa 7 giây), sau đó đứng thở 1.5 giây (gà chín cựa 2 giây). **Chỉ bắt được gà khi nó đang ăn thóc, đang thở, hoặc bị dồn vào góc rào.** Vì gà chạy nhanh hơn người nên đuổi thẳng sẽ không bắt được, buộc người chơi phải lùa và dụ.

### 4.5 Chướng ngại và kẻ địch

- **Bụi chuối (3 bụi):** gà chạy vào bụi sẽ bị che khuất. Người chơi phải đi tới gần mới thấy lại gà.
- **Ao:** đi vào ao thì chậm 50%, gà thường không vào. Cua của Thủy Tinh bò ra từ đây.
- **Chó làng:** đi tuần giữa hai điểm với tốc độ 150 px/giây. Chó sủa làm mọi gà trong bán kính 200 px hoảng chạy 3 giây, bỏ qua thóc. Chó không cắn người, chỉ đẩy lùi 80 px nếu va vào.
- **Cua binh của Thủy Tinh (kẻ địch chính):** xuất hiện lần đầu lúc 15 giây, sau đó mỗi 14 giây (Dễ 18, Khó 10), tối đa 2 con cùng lúc. Bò với tốc độ 70 px/giây tới gà gần nhất, kẹp tha gà về ao. Gà bị tha vào ao thì mất. Sơn Tinh chạm vào cua đang tha gà rồi nhấn Space để hất: cua choáng 3 giây, thả gà ra. Cua tha mất quá **4 gà** thì không đủ gà để đạt chỉ tiêu, **thua sớm**.

### 4.6 Vật phẩm trên sân

Cứ 15 giây một vật phẩm ngẫu nhiên (bánh chưng, bánh giầy, nón lá) hiện ở một điểm ngẫu nhiên trên sân, tồn tại 8 giây. Đi qua là nhặt.

### 4.7 Thắng / thua

- **Thắng:** lồng có đủ 8 gà thường/con/trống **và** gà chín cựa. Chiếu ngắn: gà chín cựa gáy, Vua Hùng gật.
- **Thua:** hết 100 giây, hoặc cua tha quá 4 gà. Chơi lại Màn 2 từ đầu.
- **Thanh tiến độ của Thủy Tinh** ở Màn 2 là số gà đã bị tha mất chia 4.

### 4.8 Điểm cần thử nghiệm kỹ

- Gà chạy nhanh hơn người nên màn này dễ khó chịu nếu stamina của gà quá dài. Thử chỉnh thời gian chạy trốn (4s) trước tiên.
- Gà chín cựa là “boss” nhỏ, nên cho người chơi có manh mối: biểu ngữ “Thóc nếp vàng!” hiện khi bồ thóc có nắm mới, và mũi tên vàng nhấp nháy chỉ hướng gà chín cựa trong 2 giây đầu.

---

## 5. Màn 3: Ngựa chín hồng mao

### 5.1 Bối cảnh và mục tiêu

Bãi hội làng, ngựa hoang bất kham với chín sợi hồng mao (bờm đỏ hồng). Sơn Tinh **thuần ngựa bằng nhịp trống đồng**: đánh đúng nhịp thì ngựa dịu dần, mỗi sợi hồng mao sáng lên là một bước thuần hóa. Đây là màn nhịp điệu 4 làn.

**Mục tiêu:** là người đầu tiên có đủ **9 sợi hồng mao** sáng. Bài nhạc dài tối đa 18 đoạn (\~86 giây), hết nhạc mà chưa đủ 9 sợi thì thua.

### 5.2 Điều khiển

- Bốn làn tương ứng bốn phím **A S K L**. Cho phép đổi sang phím mũi tên ← ↓ ↑ → trong menu cài đặt.
- Nốt rơi từ trên xuống, nhấn phím đúng làn khi nốt chạm vạch.
- Chỉ có nốt đơn (một nốt tại một thời điểm). Nốt giữ (hold) và nốt đôi là tính năng mở rộng nếu còn thời gian.

### 5.3 Bố cục màn hình

- Giữa màn hình: con ngựa (3 trạng thái hình: hung hăng → bình tĩnh → ngoan, đổi theo số sợi hồng mao).
- Bên trái: 4 làn nốt của người chơi, kích thước đủ lớn, vạch đánh nhịp nằm cách đáy 120 px.
- Bên phải: 4 làn nốt **mờ, nhỏ** của Thủy Tinh chạy song song (nốt giả cho có không khí đua, không ảnh hưởng kết quả).
- Dưới cùng: hai hàng 9 biểu tượng sợi hồng mao (bên Sơn Tinh, bên Thủy Tinh), cùng chữ “Đoạn x/18”.
- Hiện chữ đánh giá nhanh ngay tại vạch: Tuyệt vời / Tốt / Hụt.

### 5.4 Cấu trúc nhạc

| Thông số | Giá trị |
| --- | --- |
| Nhịp (BPM) | 100, một beat = 0.6 giây |
| Một đoạn | 8 beat = 4.8 giây |
| Số đoạn tối đa | 18 đoạn = 86.4 giây (cộng 4 beat đếm nhịp đầu bài) |
| Số nốt mỗi đoạn | 8 đến 14 nốt |
| Đoạn 1–6 | Nốt thưa, chủ yếu mỗi beat một nốt, làm quen |
| Đoạn 7–12 | Thêm nốt nửa beat, thỉnh thoảng đổi làn nhanh |
| Đoạn 13–18 | Mật độ cao nhất, nhưng chưa đòi hỏi nốt đôi |
| Tốc độ rơi | Nốt đi từ đỉnh đến vạch trong 1.6 giây (Dễ 2.0, Khó 1.3) |

**Âm thanh:** ba lớp. Trống đồng giữ nhịp, đàn bầu/nhị làm giai điệu, beat lo-fi hoặc EDM làm nền. Khi người chơi đánh hụt, tạm tắt lớp giai điệu 0.3 giây để người chơi “nghe” được lỗi.

**Dữ liệu bản nhạc (chart)** viết tay thành file JSON, tính theo beat, game tự đổi sang thời gian:

```json
{
  "bpm": 100,
  "offsetMs": 0,
  "phrases": [
    { "id": 1, "notes": [ {"beat":0,"lane":0}, {"beat":1,"lane":2}, {"beat":2,"lane":1}, {"beat":3,"lane":3} ] },
    { "id": 2, "notes": [ {"beat":8,"lane":1}, {"beat":9,"lane":1}, {"beat":10,"lane":0} ] }
  ]
}
```

Cách làm chart nhanh: chạy bài nhạc, vừa nghe vừa bấm phím, game ghi lại thời điểm nhấn rồi xuất JSON (làm một “chế độ ghi chart” nhỏ chỉ để dev dùng), sau đó chỉnh tay cho gọn.

**Đồng bộ thời gian (rất quan trọng):** dùng đồng hồ âm thanh (`audio.currentTime` của Web Audio) làm mốc duy nhất để sinh và chấm nốt. Không đếm theo số khung hình, vì sẽ lệch dần khi máy giật.

### 5.5 Chấm điểm từng nốt

| Kết quả | Điều kiện (so với thời điểm lý tưởng) |
| --- | --- |
| Tuyệt vời | Lệch trong ±60 ms |
| Tốt | Lệch trong ±120 ms |
| Hụt | Lệch hơn 120 ms, hoặc không nhấn |
| Sai làn | Nhấn phím khi không có nốt nào trong cửa sổ ±120 ms của làn đó, tính là 1 hụt |

Nốt đã trúng thì biến mất, mỗi nốt chỉ tính một lần.

### 5.6 Luật sợi hồng mao

Cuối mỗi đoạn, tính tỷ lệ trúng = (Tuyệt vời + Tốt) / tổng nốt của đoạn:

| Tỷ lệ trúng | Kết quả |
| --- | --- |
| Từ 75% trở lên | **+1 sợi** sáng lên |
| 50% đến dưới 75% | Giữ nguyên |
| Dưới 50% | **−1 sợi** (nếu đang có, không xuống dưới 0). Ngựa hất vó, sợi vừa sáng bị tắt |

Vì phải đạt 9 sợi trong tối đa 18 đoạn nên cần ít nhất 9 đoạn đạt chuẩn, và còn dư 9 đoạn cho sai sót. Đoạn có tỷ lệ Tuyệt vời từ 90% trở lên có hiệu ứng vàng (chỉ để vui và tính sao).

### 5.7 Bot Thủy Tinh (Màn 3)

Bot **không đánh nốt thật**. Cuối mỗi đoạn, bot tung xúc xắc để biết đoạn đó +1, 0 hay −1 sợi:

| Độ khó | +1 sợi | Giữ nguyên | −1 sợi | Ước lượng thời gian bot đủ 9 sợi |
| --- | --- | --- | --- | --- |
| Dễ | 55% | 30% | 15% | Thường không kịp trong 18 đoạn |
| Thường | 70% | 22% | 8% | Khoảng đoạn 14–15 |
| Khó | 82% | 14% | 4% | Khoảng đoạn 11–12 |

**Bám đuổi:** nếu người chơi dẫn từ 3 sợi trở lên, xác suất +1 của bot tăng 10%. Nếu bot dẫn từ 3 sợi trở lên, xác suất +1 của bot giảm 10%. Như vậy trận đấu luôn sát nút nhưng không tuyệt đối ép người chơi.

Kết quả của bot hiện ra cùng lúc với kết quả người chơi ở cuối đoạn, để người chơi thấy cuộc đua rõ ràng.

### 5.8 Thắng / thua và các tình huống đặc biệt

- **Thắng:** có đủ 9 sợi ở cuối một đoạn trong khi bot chưa đủ 9.
- **Cả hai cùng đủ 9 sợi ở một đoạn:** người chơi thắng (nhường người chơi để đỡ cảm giác thua oan).
- **Thua:** bot đủ 9 sợi trước, hoặc hết 18 đoạn mà người chơi chưa đủ. Chơi lại Màn 3 từ đầu.
- **Hiệu chỉnh độ trễ:** trước màn có một bước nhỏ “Gõ theo nhịp” 8 beat để tự đo độ trễ âm thanh/bàn phím, lưu vào `offsetMs`. Có thanh trượt chỉnh tay ±200 ms trong cài đặt. Màn nhịp điệu mà không có bước này thường bị chê “lệch nhịp”.
- **Tab bị ẩn / mất focus:** tự động tạm dừng nhạc.

---

## 6. Cầu nối và đoạn kết

### 6.1 Cầu nối: Vua Hùng gả con gái (sau Màn 3, 15–20 giây)

Bốn khung ảnh phong cách tranh Đông Hồ, mỗi khung hiển thị 4 giây, có zoom/di chuyển nhẹ và một dòng chữ. Nhấn Space để bỏ qua.

1. Vua Hùng ngồi trên điện, ba sính lễ (voi, gà, ngựa) bày trước mặt. Chữ: “Sính lễ đủ rồi, ta gả Mị Nương cho Sơn Tinh!”
2. Mị Nương đội khăn đỏ, Sơn Tinh cúi nhận.
3. Đón dâu lên núi Tản Viên, trống hội, bánh chưng bánh giầy.
4. Thủy Tinh đến muộn, mặt tối sầm, sấm chớp. Chữ: “Ai cho Sơn Tinh cưới trước?!” Rồi chuyển thẳng vào Màn 4 với tiếng sấm.

Làm đơn giản: 4 ảnh tĩnh (có thể vẽ vector đơn giản hoặc tạo bằng công cụ AI rồi chỉnh), hiệu ứng zoom bằng tween của Phaser, chữ hiện từng ký tự.

### 6.2 Đoạn kết (sau Màn 4 chiến dịch)

Nước rút, Thủy Tinh lùi về biển, núi Tản Viên đứng vững, Mị Nương mỉm cười. Dòng chữ: “Từ đó năm nào Thủy Tinh cũng dâng nước đánh Sơn Tinh…” rồi hiện nút **Chơi vô tận** (mở khóa chế độ Vô tận) và **Về menu**.

---

## 7. Màn 4: Lấp biển dời núi

### 7.1 Ý tưởng cốt lõi

“Nước dâng bao nhiêu, núi cao bấy nhiêu.” Màn nhìn ngang (side-view 2D), 1280×720. Hai thông số đo cùng một đơn vị gọi là **thước**:

- **H** = độ cao ngọn núi.
- **W** = mực nước.

Nước tự dâng, Sơn Tinh nhặt đá, nhổ cây để nâng núi. **Thua nếu W ≥ H** (nước chạm đỉnh núi, nơi có nhà Mị Nương). 1 thước = 4 px hiển thị. Núi vẽ thành nhiều lớp xếp chồng để dễ phóng to khi H tăng.

### 7.2 Điều khiển

| Phím / chuột | Hành động |
| --- | --- |
| A / D | Chạy trái / phải (240 px/giây) |
| W hoặc Space | Nhảy |
| E | Nhặt đá nhỏ (tức thì); giữ E 1.2 giây để nhổ cây; giữ E 1.5 giây để vác tảng đá lớn; nhấn E tại chân núi để **xếp đồ đang mang lên núi** |
| Chuột trái | Ném đá nhỏ (dùng 1 viên đang mang) về phía con trỏ, đánh thủy quái |
| Chuột phải | Cắm **tường chắn** (dùng 1 cây đang mang) ngay trước mặt |
| Q | “Thần Núi nổi giận”: +10 thước ngay lập tức, đẩy lùi nước 5 thước, đẩy lùi mọi thủy quái. Hồi 20 giây |

Sơn Tinh **không có thanh máu**. Chỉ có một điều kiện thua duy nhất là W ≥ H. Đang đứng trong nước thì chạy chậm 40%.

### 7.3 Tài nguyên và sức mang

| Tài nguyên | Chiếm ô | Cho thêm | Cách lấy | Sinh ra |
| --- | --- | --- | --- | --- |
| Đá nhỏ | 1 | +4 thước | Nhấn E | Mỗi 1.5 giây, tối đa 8 viên trên bản đồ |
| Tảng đá lớn | 2 | +12 thước | Giữ E 1.5 giây | Mỗi 10 giây, tối đa 2 tảng |
| Cây | 1 | +3 thước, hoặc dùng làm tường chắn | Giữ E 1.2 giây | Mỗi 6 giây, tối đa 4 cây |

- Tối đa **4 ô** trên người. Mang trên 2 ô thì chạy chậm 15%.
- Chỉ xếp đồ lên núi khi đứng trong **vùng chân núi** (rộng 200 px quanh ngọn núi). Xếp xong có hoạt ảnh 0.3 giây và núi “lớn” lên rõ rệt.
- **Tài nguyên ở vùng thấp bị nước nhấn chìm dần.** Bản đồ có hai khu đồi phụ bên trái và bên phải, nước dâng tới đâu thì tài nguyên ở đó biến mất. Điều này ép người chơi tranh thủ nhặt sớm.

### 7.4 Thông số cân bằng (độ khó Thường)

| Thông số | Giá trị |
| --- | --- |
| H ban đầu | 110 thước |
| W ban đầu | 40 thước |
| Nước dâng cơ bản | 1.0 thước/giây (Dễ 0.8, Khó 1.3) |
| Mưa lớn (20–35 giây) | Tốc độ dâng ×1.5 |
| Mỗi sóng thường | +8 thước tức thì |
| Sóng thần (giây 54) | +15 thước tức thì |
| Cua chạm núi | −2 thước/giây cho đến khi bị tiêu diệt |
| Thuồng luồng chạm núi | −3 thước/giây cho đến khi bị tiêu diệt |

Ước tính W lúc kết thúc: 40 + 60 (dâng cơ bản) + 9 (mưa) + 32 (4 sóng) + 15 (sóng thần) ≈ 156 thước. Người chơi cần H trên 156 thước, tức là cộng thêm khoảng 47 thước, cộng thêm phần bị quái phá (ước 20 thước). Tổng cần nâng khoảng 65 thước, tương đương khoảng 13 viên đá nhỏ hoặc ít hơn nhờ tảng lớn và kỹ năng Q (cho 3 lần × 10 = 30 thước). Đây là mức khó vừa phải, nên chơi thử rồi chỉnh.

### 7.5 Dòng thời gian Thủy Tinh (chiến dịch 60 giây)

Mọi mối đe dọa đều **có cảnh báo** trước 2–4 giây (biểu tượng + chuông) để người chơi cảm thấy thua là do mình, không phải do game.

| Giây | Sự kiện | Cảnh báo |
| --- | --- | --- |
| 0 | Bắt đầu, nước dâng chậm | Đếm 3-2-1 |
| 8 | 2 cua bò tới từ bên phải | Biểu tượng cua 2 giây |
| 12 | **Sóng 1** (+8) | Bóng sóng đỏ từ bên phải 3 giây |
| 20–35 | Mưa lớn, màn tối dần | Sấm, chữ “Mưa dông!” |
| 24 | **Sóng 2** (+8) kèm 1 thuồng luồng | 3 giây |
| 30 | 3 cua từ hai phía | 2 giây |
| 36 | **Sóng 3** (+8) | 3 giây |
| 42 | 2 thuồng luồng | 2 giây |
| 48 | **Sóng 4** (+8) | 3 giây |
| 54 | **Sóng thần**, Thủy Tinh hiện ra khổng lồ (+15) | 4 giây, chuông lớn |
| 60 | Hết giờ. Nếu W < H thì thắng |  |

**Thủy quái:**

- **Cua** (HP 2): bò trên mặt đất tới chân núi, tốc độ 90 px/giây. Ném 2 viên đá để hạ.
- **Thuồng luồng** (HP 3): bơi trên mặt nước theo mực nước, lao vào núi. Ném 3 viên đá để hạ.
- Hạ quái thì rơi 1 đá nhỏ.

**Sóng và tường chắn:** sóng đi từ phải sang trái. Nếu có tường chắn nằm trên đường đi của sóng thì sóng chỉ còn 50% (ví dụ +4 thay vì +8), tường vỡ sau đó. Nếu Sơn Tinh đứng ngoài chân núi khi sóng tới thì bị đẩy lùi và rơi hết đồ đang mang (nón lá chặn được một lần).

### 7.6 Hệ thống “đạo diễn” Thủy Tinh (bám đuổi)

Thủy Tinh ở Màn 4 không phải đối thủ chạy đua mà là một **đạo diễn sự kiện** đọc dòng thời gian ở trên, nhưng được phép chỉnh nhỏ:

- Nếu H − W lớn hơn 40 thước trong 10 giây liên tục: thêm 1 con quái ở lần xuất hiện tiếp theo.
- Nếu H − W nhỏ hơn 10 thước: hoãn sóng kế tiếp 3 giây (tối đa 1 lần mỗi 20 giây) để cho người chơi cơ hội xoay xở.

### 7.7 Chế độ Vô tận: “Mùa lũ thứ N”

Mở sau khi qua Màn 4 chiến dịch. Không có đích, chơi đến khi thua.

- Mỗi **mùa** kéo dài 30 giây, kết thúc bằng một sóng thần. Hiện biểu ngữ “Mùa lũ thứ N”.
- Qua mỗi mùa: tốc độ dâng nước ×(1 + 0.15 × (N − 1)), độ lớn sóng ×(1 + 0.1 × (N − 1)), số quái mỗi đợt tăng dần.
- Thưởng mỗi mùa: 1 nón lá miễn phí rơi ở chân núi.
- **Điểm** = H lớn nhất đạt được × 10 + số thủy quái hạ × 5 + N × 100.
- Lưu **Top 10** điểm cao nhất bằng `localStorage` (bảng xếp hạng trực tuyến cần máy chủ, để sau).

### 7.8 Thắng / thua và sao (chiến dịch)

- **Thắng:** hết 60 giây mà W < H. Cắt sang đoạn kết (6.2).
- **Thua:** bất kỳ lúc nào W ≥ H. Hiện câu “Thủy Tinh: hôm nay ta chưa ăn sáng nên hơi cay” rồi chơi lại Màn 4 từ đầu (không chiếu lại cầu nối).
- **Sao:** H − W cuối trận từ 30 thước trở lên: 3 sao. Từ 10 đến dưới 30: 2 sao. Còn lại: 1 sao.

### 7.9 Tình huống biên

- Đang giữ E để nhổ cây thì sóng ập tới: hủy hành động, không tính.
- Ném đá khi không có đá: bỏ qua, không phạt.
- Đầy ô mà nhấn nhặt: hiện “Đầy tay!” và rung nhẹ biểu tượng ô mang.
- Thanh W và H luôn hiển thị song song ở rìa màn hình, hai màu tương phản, và cả hai cùng có số cụ thể.

---

## 8. Kiến trúc kỹ thuật

### 8.1 Công nghệ và quy ước

- **Phaser 3** + **Vite** + TypeScript (hoặc JavaScript nếu bạn quen hơn). Build ra web tĩnh, đưa lên itch.io / GitHub Pages / Netlify để nộp bài.
- Độ phân giải thiết kế **1280×720**, chế độ scale `FIT` và căn giữa, nên chạy được trên mọi cỡ cửa sổ.
- Bản đầu chỉ hỗ trợ **máy tính + bàn phím + chuột**. Điện thoại cần thiết kế lại điều khiển, để sau.
- Trình duyệt chặn tự phát âm thanh, nên màn đầu tiên phải có nút **“Nhấn để bắt đầu”** để mở khóa audio.
- Dùng font có đủ dấu tiếng Việt (ví dụ Be Vietnam Pro, Nunito, hoặc font thư pháp có hỗ trợ dấu). Kiểm tra bằng câu “Thủy Tinh dâng nước đánh Sơn Tinh”.

### 8.2 Cấu trúc thư mục gợi ý

```
src/
  main.ts                 // khởi tạo Phaser, danh sách scene
  config/
    difficulty.json       // thông số theo độ khó (xem 8.6)
    level1.json  level2.json  level3.json  level4.json
    chart_ngua.json       // bản nhạc Màn 3
  core/
    GameState.ts          // tiến độ, sao, độ khó, cài đặt (lưu localStorage)
    AudioManager.ts       // nhạc, SFX, âm lượng
    Controller.ts         // Intent, HumanController, BotController
    Hud.ts                // thanh Thủy Tinh đang đến, đồng hồ, chat Văn Lang Live
    Tween.ts  Utils.ts
  scenes/
    BootScene.ts  PreloadScene.ts  MenuScene.ts  SettingsScene.ts
    IntroScene.ts         // Vua Hùng ra đề
    Level1Scene.ts  Level2Scene.ts  Level3Scene.ts  Level4Scene.ts
    CutsceneScene.ts      // dùng chung cho cầu nối và kết
    ResultScene.ts        // thắng / thua / sao
    EndlessScene.ts       // Màn 4 vô tận (dùng lại logic Level4)
  entities/
    Hook.ts  Animal.ts  Chicken.ts  Crab.ts  Note.ts  Horse.ts  Mountain.ts  Water.ts
  ai/
    Level1Bot.ts  Level2Crab.ts  Level3Opponent.ts  Level4Director.ts
public/assets/            // hình, âm thanh, font
```

### 8.3 Danh sách Scene và luồng chuyển

`Boot → Preload → Menu → Intro → Level1 → Level2 → Level3 → Cutscene(cầu nối) → Level4 → Cutscene(kết) → Menu / Endless`

Mỗi LevelScene nhận `{ difficulty, attempt }` và trả về `{ result: 'win'|'lose', stars, reason }` cho ResultScene. ResultScene quyết định chơi lại cùng màn hay sang màn kế, theo `retryTarget` (mặc định là chính màn đó).

### 8.4 Trạng thái chung (`GameState`)

| Trường | Ý nghĩa |
| --- | --- |
| `difficulty` | easy / normal / hard |
| `levelProgress` | Màn cao nhất đã mở (1–4) |
| `stars[1..4]` | Sao tốt nhất mỗi màn |
| `endlessUnlocked` | Đã qua Màn 4 chiến dịch |
| `endlessTop10` | Danh sách điểm Vô tận |
| `settings` | Âm lượng nhạc/SFX, phím Màn 3, `offsetMs` |

Lưu toàn bộ vào `localStorage` (bọc `try/catch`, vì có người tắt lưu trữ).

### 8.5 Chừa chỗ cho chế độ 2 người

Đây là cách để sau này chỉ cần thay “bộ não” của Thủy Tinh bằng người thật mà không viết lại game. Mọi thứ điều khiển nhân vật đi qua một giao diện chung:

```ts
interface Intent {
  moveX: number;        // -1..1
  moveY: number;        // -1..1 (Màn 2)
  jump: boolean;        // Màn 4
  primary: boolean;     // true đúng 1 khung hình khi vừa nhấn (Space / thả móc / kéo / E)
  secondary: boolean;   // chuột phải / tường chắn
  skill: boolean;       // Q
  aim: { x: number; y: number };   // con trỏ chuột
  lanes: boolean[];     // 4 làn của Màn 3, true khi vừa nhấn
}

interface Controller { poll(dt: number, world: World): Intent; }

class HumanController implements Controller { /* đọc bàn phím + chuột, có thể gán P1 hoặc P2 */ }
class BotController   implements Controller { /* AI sinh ra Intent */ }
```

- **Màn 1:** cả hai bên có một `Hook` riêng chạy cùng luật. Bot không “tung xúc xắc kết quả” mà **sinh ra Intent**: chọn trước độ lệch `d` theo bảng xác suất ở 3.7 (chắc/lỏng/trượt), rồi nhấn `primary` đúng lúc móc cách mục tiêu `d`. Nhờ vậy sau này đổi bot thành người thật, luật vẫn y nguyên.
- **Màn 2:** Sơn Tinh là người chơi. Cua của Thủy Tinh là AI thuần túy, 2 người thì để người thứ hai điều khiển một con cua hoặc để lại làm AI.
- **Màn 3:** dùng interface `Opponent { update(dt); progress(): number }`. Bản 1 người dùng `DiceOpponent` (tung xúc xắc cuối đoạn). Bản 2 người dùng `HumanOpponent` đọc thêm 4 phím thứ hai, mỗi người có một chart riêng.
- **Màn 4:** hai người đồng đội hoặc 1 người chơi, 1 người đóng vai Thủy Tinh điều khiển sóng. Làm sau.

### 8.6 Cấu hình theo độ khó (`difficulty.json`)

Mọi con số trong tài liệu này nên nằm trong file cấu hình để bạn chỉnh mà không cần sửa code:

```json
{
  "normal": {
    "level1": { "timeLimit": 75, "botReact": 1.1, "botPull": 5.0, "botLock": [0.40, 0.35, 0.25], "swingPeriod": 2.0 },
    "level2": { "timeLimit": 100, "crabFirst": 15, "crabEvery": 14, "maxLost": 4 },
    "level3": { "bpm": 100, "botOutcome": [0.70, 0.22, 0.08], "fallTime": 1.6 },
    "level4": { "waterRise": 1.0, "waveSize": 8, "startH": 110, "startW": 40 }
  }
}
```

### 8.7 Mã giả cho các phần dễ làm sai

**Móc đu đưa (Màn 1):**

```ts
update(dt) {
  this.t += dt;
  this.x = CENTER_X + 480 * Math.sin(2 * Math.PI * this.t / SWING_PERIOD);
}
onThrow() {
  // sau 0.25s móc chạm băng chuyền, tính độ lệch với con vật gần nhất
  const d = Math.abs(this.x - target.x);
  quality = d <= 25 ? 'firm' : d <= 60 ? 'loose' : 'miss';
}
```

**Chấm nốt (Màn 3):**

```ts
function judge(pressTime: number, noteTime: number) {
  const dt = Math.abs(pressTime - noteTime - offsetMs / 1000);
  if (dt <= 0.06) return 'perfect';
  if (dt <= 0.12) return 'good';
  return 'miss';
}
// pressTime và noteTime đều lấy từ audio.currentTime, không dùng số khung hình
```

**Dâng nước (Màn 4):**

```ts
update(dt) {
  const rain = (t >= 20 && t <= 35) ? 1.5 : 1.0;
  W += cfg.waterRise * rain * dt;
  H -= monstersAttachedDamagePerSec * dt;
  if (W >= H) lose('Nước đã nhấn chìm đỉnh núi');
}
```

**Flocking (Màn 2), mỗi khung hình cho mỗi con gà:**

```ts
steer = sep * 1.5 + align * 1.0 + cohere * 0.8 + wander * 0.6;
if (distToPlayer < fearRadius) steer += fleeAwayFromPlayer * 3.0;
if (seesGrain && !isGoldenHen) steer = towardsGrain;   // ưu tiên thóc
velocity = limit(steer, speedByState);
```

### 8.8 Hiệu năng và độ ổn định

- Giới hạn `dt` tối đa 50 ms mỗi khung hình để lúc máy giật, vật lý không bị “nhảy cóc”.
- Dùng **object pool** cho nốt nhạc (Màn 3), đá (Màn 4), nắm thóc (Màn 2). Đừng tạo/xóa liên tục.
- Màn 2 có tối đa 13 gà + 2 cua + 1 chó, tính flocking cho vài chục con là rất nhẹ, không cần tối ưu thêm.
- Tạm dừng khi cửa sổ mất focus (`visibilitychange`).

---

## 9. Danh sách tài nguyên (asset)

### 9.1 Hình ảnh

| Nhóm | Cần có | Ghi chú |
| --- | --- | --- |
| Nhân vật | Sơn Tinh (đứng, chạy, kéo, ném, mang đồ, choáng), Thủy Tinh (đứng, kéo, cười khẩy, giận), Vua Hùng, Mị Nương | Mỗi nhân vật 4–8 khung hình là đủ, có thể dùng ảnh tĩnh và tween |
| Màn 1 | Băng chuyền, móc, 6 loại thú (trâu, hươu, rùa, hổ, voi, voi chín ngà), vòng xanh/vàng/đỏ | Thú chỉ cần 1–2 khung hình và hiệu ứng lắc |
| Màn 2 | Sân đình, lồng, ao, bụi chuối, bồ thóc, hàng rào, 4 loại gà, cua, chó, nắm thóc | Gà chạy 2 khung hình là đủ |
| Màn 3 | Con ngựa (3 trạng thái), 4 làn, nốt (4 màu), vạch nhịp, 9 sợi hồng mao (sáng/tắt) |  |
| Màn 4 | Núi (nhiều lớp), nhà Mị Nương, nền trời mưa, sóng, đá nhỏ, tảng đá, cây, cua, thuồng luồng, Thủy Tinh khổng lồ |  |
| UI | Nút, khung HUD, thanh Phước Trời, thanh kéo, biểu tượng cảnh báo (cua, sóng, quái), sao, biểu tượng vật phẩm |  |
| Cắt cảnh | 4 khung cầu nối + 1 khung kết, phong cách Đông Hồ | Có thể dùng một ảnh nền chung + nhân vật cắt dán |

### 9.2 Âm thanh

| Loại | Danh sách |
| --- | --- |
| Nhạc nền | Menu (chầu văn nhẹ), Màn 1 (hội chợ vui), Màn 2 (nhạc làng nhí nhảnh), Màn 3 (bản nhịp điệu 100 BPM, 3 lớp), Màn 4 (trống dồn, dông bão, EDM), cầu nối, kết |
| SFX chung | Click nút, đếm 3-2-1, thắng, thua, trống dồn 10 giây cuối |
| Màn 1 | Thả móc, keng (chắc), lách cách (lỏng), vèo (trượt), tách mỗi lần bấm kéo, voi rống |
| Màn 2 | Ném thóc, gà cục tác, gà kêu hoảng, “Hè!”, chó sủa, cua kẹp, vào lồng |
| Màn 3 | Tuyệt vời, Tốt, Hụt, ngựa hí, sợi sáng |
| Màn 4 | Nhặt/xếp đá, nhổ cây, ném đá, sóng ập, sấm, quái hú, Thần Núi nổi giận, chuông cảnh báo |

### 9.3 Bản quyền và nguồn

- Ưu tiên tự vẽ hoặc dùng nguồn miễn phí có ghi rõ giấy phép (CC0, CC-BY): itch.io, OpenGameArt, Kenney, Freesound, Pixabay.
- Nhạc dân gian cổ (hát xẩm, chầu văn) có thể đã hết bản quyền tác giả, nhưng **bản ghi âm cụ thể vẫn có thể còn bản quyền**. Tốt nhất tự phối lại hoặc dùng nhạc miễn phí và ghi nguồn trong phần Credits.
- Cuộc thi thường yêu cầu nêu rõ nguồn tài nguyên, nên giữ một file `CREDITS.md` từ ngày đầu.

---

## 10. Lộ trình làm game

Thứ tự làm theo mức rủi ro: làm màn khó và hấp dẫn nhất trước, dựng khung chung trước, âm thanh và hình đẹp để sau cùng. Số ngày bên dưới là ước lượng cho **một người làm**, mỗi ngày 3–4 giờ. Hãy chia lại theo hạn nộp thực tế.

| Giai đoạn | Việc cần làm | Ước lượng | Xong khi |
| --- | --- | --- | --- |
| 0 | Cài Phaser + Vite, tạo repo, `CREDITS.md`, chọn font, bảng màu | 0.5–1 ngày | Mở được cửa sổ game, chữ tiếng Việt hiển thị đúng |
| 1 | Khung chung: Boot/Preload/Menu, GameState, HUD, đồng hồ, màn Thắng/Thua/Chơi lại, `Controller` | 2 ngày | Chạy một màn giả có đếm giờ, thắng/thua, chơi lại |
| 2 | **Màn 4** (lõi hấp dẫn nhất): núi, nước, nhặt/xếp, sóng, quái, timeline | 4 ngày | Chơi được 60 giây, thắng/thua đúng |
| 3 | **Màn 2**: chạy WASD, gà flocking, thóc, bắt, lồng, cua, chó | 4 ngày | Bắt đủ chỉ tiêu thì thắng, cua tha thì thua |
| 4 | **Màn 1**: băng chuyền, móc đu đưa, kéo bấm, Phước Trời, bot | 3 ngày | Cuộc đua với bot đủ căng ở độ khó Thường |
| 5 | **Màn 3**: nốt nhạc, chấm điểm, hiệu chỉnh độ trễ, chart, bot xúc xắc | 4 ngày | Chơi hết bài, sợi hồng mao lên/xuống đúng luật |
| 6 | Cắt cảnh, mở đầu, kết, chế độ Vô tận, lưu Top 10 | 2–3 ngày | Chơi trọn từ Menu đến Kết |
| 7 | Thay hình tạm bằng hình chính thức, nhạc, SFX, chat Văn Lang Live | 4 ngày | Giống bản demo mong muốn |
| 8 | Kiểm thử cân bằng, sửa lỗi, tối ưu, đóng gói, đăng bản thử | 3 ngày | Nhờ 3–5 người lạ chơi, ghi lại chỗ họ kẹt |

**Mức cắt giảm nếu thiếu thời gian (theo thứ tự cắt trước):**

1. Bảng Top 10 và chế độ Vô tận.
2. Chat “Văn Lang Live” và vật phẩm.
3. Độ khó Dễ/Khó (chỉ giữ Thường).
4. Cầu nối rút còn 2 khung.
5. Màn 3 chuyển sang **Phương án B (đua ngựa vượt ải)** nếu không kịp làm nhạc.

### Danh sách kiểm tra mỗi màn trước khi coi là xong

- Chơi 5 lần liên tiếp: thắng được ít nhất 2 lần với người chưa chơi bao giờ.
- Thua rồi chơi lại bằng một phím, mất dưới 2 giây.
- Mọi mối đe dọa đều có cảnh báo trước.
- Không có lỗi khi nhấn dồn phím, nhấn giữ phím, đổi tab.
- Âm thanh bật/tắt được, nhạc không giật khi thua và chơi lại.

---

## 11. Giả định đã đặt và câu hỏi cần chốt

### Những chỗ mình đã tự hiểu, bạn xem có đúng không

1. **“Kéo Bò / Kéo Thú”** mình hiểu là trò thả móc và bấm kéo thú ở siêu thị (đúng với phần bạn viết “dùng space liên tục để kéo”). Mình tách thành hai bước: thả móc canh thời điểm, rồi bấm Space liên tục để kéo.
2. **“Chơi lại từ đầu”** mình hiểu là chơi lại **đúng màn đó**, không phải về Màn 1. Nếu bạn muốn thua là về Màn 1 thì chỉ đổi `retryTarget`.
3. **Bot Thủy Tinh ở Màn 1 dùng chung băng chuyền** với người chơi, ai móc trước thì con vật bị khóa. Voi chín ngà chỉ có một con trên băng tại một thời điểm.
4. **Màn 3** mình chọn Phương án A (nhịp điệu 4 làn, trừ sợi khi đoạn nhạc đánh dở), vì đó là chỗ remix mạnh nhất.
5. **Màn 4** chọn góc nhìn ngang. Nếu bạn nghĩ đến nhìn từ trên xuống thì nhiều phần (nhảy, nước dâng lên) sẽ phải đổi.
6. **Nền tảng web, bàn phím + chuột**, chưa hỗ trợ điện thoại.

### Câu hỏi để chốt phạm vi

- **Cuộc thi có yêu cầu nền tảng cụ thể** (web, file cài đặt, hay video demo) và **hạn nộp** là ngày nào?
- Bạn **tự vẽ** hay dùng công cụ tạo hình? Có ai hỗ trợ nhạc không? Điều này quyết định giai đoạn 7 dài bao lâu.
- Bạn quen **JavaScript/TypeScript** hay ngôn ngữ/công cụ khác (Unity, Godot, Scratch...)? Nếu không quen web thì Godot cũng xuất ra web được, mình có thể đổi phần kỹ thuật cho hợp.
- Giám khảo sẽ chơi **bao lâu**? Nếu chỉ vài phút thì nên giảm mỗi màn xuống 45–60 giây.

### Việc mình có thể làm tiếp

Chọn một trong các hướng và mình làm ngay: (a) dựng bản chơi thử Màn 4 hoặc Màn 1 chạy được trên trình duyệt, (b) viết khung dự án Phaser kèm `Controller`, `GameState`, HUD, (c) soạn bản nhạc/chart mẫu cho Màn 3, (d) viết toàn bộ lời thoại, câu chat Văn Lang Live và câu cà khịa của Thủy Tinh.
