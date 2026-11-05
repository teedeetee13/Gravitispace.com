// Về Hữu Duyên + hộp đường dây hỗ trợ dùng chung
import { esc, icon } from '../util.js';
import { HOTLINES } from '../data/taxonomy.js';

export const hotlineBox = (intro) => `<div class="hotline" id="ho-tro">
  <p class="hotline-title">${icon('phone')} Cần giúp đỡ ngay?</p>
  <p>${esc(intro)}</p>
  <ul>${HOTLINES.map((h) => `<li><a href="tel:${h.number.replace(/\s/g, '')}"><strong>${esc(h.number)}</strong></a> · ${esc(h.name)} <span class="muted small">(${esc(h.note)})</span></li>`).join('')}</ul>
</div>`;

export function renderAbout(view) {
  view.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <p class="eyebrow">Về Hữu Duyên</p>
      <h1>Một kho chữ, gặp ai là duyên.</h1>
      <p class="lead">Hữu Duyên là nơi mọi người để lại những dòng chữ về Tarot, chiêm tinh, tử vi, và về chính cuộc đời mình. Bạn không cần tìm. Cứ lướt, bài viết nào đến với bạn đúng lúc, đó là duyên.</p>
    </header>

    <section class="section prose">
      <h2 class="section-title">Huyền học tỉnh táo</h2>
      <p>Ở đây, lá bài, vì sao hay con giáp là <strong>tấm gương để soi mình</strong>, không phải lời phán về số phận. Chúng tôi không dọa "có hạn", không bán bùa giải, không bảo ai phải chia tay hay bỏ việc.</p>
      <p>Một lá bài đẹp nhất khi nó đặt cho bạn một câu hỏi đúng. Câu trả lời luôn là của bạn.</p>

      <h2 class="section-title">Ba điều chúng ta giữ cho nhau</h2>
      <ol class="principles">
        <li><strong>Tử tế.</strong> Viết như đang nói với một người lạ đang buồn.</li>
        <li><strong>Ẩn danh.</strong> Không nêu tên thật, không để lộ thông tin của người khác.</li>
        <li><strong>Không phán xét.</strong> Không có lá bài xấu, không có cung tệ, không có tuổi "khắc".</li>
      </ol>

      <h2 class="section-title">Hữu Duyên không thay thế chuyên gia</h2>
      <p>Nội dung ở đây mang tính chiêm nghiệm và giải trí. Với những quyết định quan trọng về sức khoẻ, tài chính, pháp lý, hoặc khi bạn đang gặp khủng hoảng tâm lý, xin hãy tìm đến chuyên gia.</p>
    </section>

    ${hotlineBox('Nếu bạn hoặc ai đó đang gặp nguy hiểm, đừng chờ. Gọi ngay:')}

    <p class="muted small">Bản thử nghiệm: bài viết bạn gieo và mọi lựa chọn của bạn hiện chỉ được lưu trên trình duyệt của máy này.</p>
  </div>`;
}
