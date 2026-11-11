// Dữ liệu chung của trang chính Graviti và trang quản trị (admin).
// Chỉ giữ mã, trạng thái, đường dẫn ở đây. Chữ hiển thị nằm trong i18n/<ngôn ngữ>.js (trang chính: 9 ngôn ngữ),
// riêng danh sách việc cần làm của quản trị chỉ có { vi, en }. tests/hub.test.mjs kiểm tra đủ bản dịch.

export const SITE = {
  NAME: 'Graviti',
  DOMAIN: 'gravitispace.com', // tên miền dự kiến (chưa mua)
  REPO: 'teedeetee13/Gravitispace.com', // kho mã công khai trên GitHub; trang quản trị đọc trạng thái phát hành từ đây
};

// Mỗi dịch vụ là một đường dẫn trên cùng tên miền: gravitispace.com/stars/, /heal/, ... (xem docs/GRAVITI.md mục 2)
// Địa chỉ đang chạy thật để trang quản trị kiểm tra sức khoẻ qua build-info.json.
export const LIVE = {
  stars: 'https://teedeetee13.github.io/Gravitispace.com/stars/',
  // Trước bản 2.3.0 Graviti Stars nằm ở gốc. Trang quản trị thử địa chỉ này nếu địa chỉ mới chưa có (chưa đăng bản mới).
  starsLegacy: 'https://teedeetee13.github.io/Gravitispace.com/',
};

// status: live = đang mở · next = làm tiếp theo · idea = đang ấp ủ
export const SERVICES = [
  { id: 'stars', status: 'live', path: 'stars', name: 'Graviti Stars', href: 'stars/', icon: 'star' },
  { id: 'heal', status: 'next', path: 'heal', name: 'Graviti Heal', icon: 'leaf' },
  { id: 'connect', status: 'idea', path: 'connect', name: 'Graviti Connect', icon: 'link' },
  { id: 'help', status: 'idea', path: 'help', name: 'Graviti Help', icon: 'bolt' },
];

export const STAR_MODULES = [
  { id: 'tarot', status: 'live' },
  { id: 'astro', status: 'live' },
  { id: 'tuvi', status: 'live' },
  { id: 'bazi', status: 'next' },
  { id: 'numerology', status: 'next' },
  { id: 'humandesign', status: 'idea' },
];

export const PRINCIPLES = ['heart', 'lock', 'moon', 'users'];

// status: done · now (đang làm) · next (làm tiếp theo) · wait (chờ chủ dự án duyệt / thao tác) · later
export const ROADMAP = [
  { id: 'stars22', status: 'done' },
  { id: 'sec221', status: 'done' },
  { id: 'graviti', status: 'done' },
  { id: 'domain', status: 'wait' },
  { id: 'family', status: 'next' },
  { id: 'community', status: 'wait' },
  { id: 'feed', status: 'wait' },
  { id: 'quests', status: 'wait' },
  { id: 'ai', status: 'later' },
  { id: 'bazi', status: 'later' },
  { id: 'heal', status: 'later' },
  { id: 'more', status: 'later' },
];

// Việc của chủ dự án (chỉ trang quản trị). auto = tự kiểm tra; còn lại bấm đánh dấu, lưu trên máy đang xem.
export const CHECKLIST = [
  { id: 'ci-green', auto: 'ci', title: { vi: 'Lần kiểm thử và đăng web gần nhất thành công', en: 'Latest test-and-deploy run passed' } },
  { id: 'live-latest', auto: 'liveLatest', title: { vi: 'Web đang chạy đúng bản phát hành mới nhất', en: 'Live site runs the latest release' } },
  { id: 'branch-protect', auto: 'protected', title: { vi: 'Bật bảo vệ nhánh main', en: 'Protect the main branch' },
    how: { vi: 'GitHub → Settings → Branches → Add rule "main": bắt buộc pull request và kiểm thử xanh trước khi gộp.', en: 'GitHub → Settings → Branches → add rule "main": require a pull request and passing checks.' } },
  { id: 'deps', auto: 'deps', title: { vi: 'Không còn pull request cập nhật (Dependabot) treo', en: 'No pending Dependabot pull requests' },
    how: { vi: 'Mở từng PR, kiểm thử xanh thì gộp. PR đỏ (vd. setup-node 7) để lại, hỏi Claude.', en: 'Merge each PR whose checks pass; leave red ones and ask Claude.' } },
  { id: 'cloud', auto: 'cloud', title: { vi: 'Bật tài khoản và cơ sở dữ liệu (Supabase)', en: 'Enable accounts and database (Supabase)' },
    how: { vi: 'Làm theo docs/CAU-HINH.md mục 4. Bật SMTP riêng và CAPTCHA trước khi mở đăng ký công khai.', en: 'Follow docs/CAU-HINH.md section 4. Set up custom SMTP and CAPTCHA before public sign-up.' } },
  { id: 'domain', title: { vi: 'Mua tên miền gravitispace.com (bật tự gia hạn)', en: 'Buy gravitispace.com (auto-renew on)' },
    how: { vi: 'Cloudflare Registrar, giá gốc, khoảng 10–11 USD/năm. docs/CAU-HINH.md mục 1.', en: 'Cloudflare Registrar at cost, about 10–11 USD/year. docs/CAU-HINH.md section 1.' } },
  { id: 'cloudflare', title: { vi: 'Đưa web lên Cloudflare Pages', en: 'Deploy to Cloudflare Pages' },
    how: { vi: 'docs/CAU-HINH.md mục 2.', en: 'docs/CAU-HINH.md section 2.' } },
  { id: 'access', title: { vi: 'Khoá trang quản trị bằng Cloudflare Access', en: 'Lock the admin page with Cloudflare Access' },
    how: { vi: 'docs/CAU-HINH.md mục 3. Làm được ngay trên graviti.pages.dev, nhớ khoá cả các bản xem trước *.graviti.pages.dev. Chỉ email của bạn mới mở được /admin/.', en: 'docs/CAU-HINH.md section 3. Works on graviti.pages.dev right away; also lock preview URLs *.graviti.pages.dev. Only your email can open /admin/.' } },
  { id: 'privacy-legal', title: { vi: 'Luật sư rà Chính sách quyền riêng tư, điền tên bên kiểm soát dữ liệu', en: 'Lawyer review of the privacy policy, controller identity filled in' },
    how: { vi: 'Trang /privacy/. Xem docs/CAU-HINH.md mục 6 (Luật BVDLCN 91/2025/QH15).', en: 'Page /privacy/. See docs/CAU-HINH.md section 6.' } },
  { id: 'trademark', title: { vi: 'Tra nhãn hiệu "Graviti" (Cục SHTT, WIPO)', en: 'Search the "Graviti" trademark (IP Viet Nam, WIPO)' } },
  { id: 'social', title: { vi: 'Giữ tên Graviti trên Facebook, TikTok, Instagram', en: 'Reserve Graviti on Facebook, TikTok, Instagram' } },
  { id: 'captcha', title: { vi: 'Duyệt CAPTCHA (Cloudflare Turnstile) cho đăng ký', en: 'Approve CAPTCHA (Cloudflare Turnstile) for sign-up' } },
  { id: 'analytics', title: { vi: 'Bật thống kê truy cập không cookie (Cloudflare Web Analytics)', en: 'Turn on cookie-free analytics (Cloudflare Web Analytics)' } },
  { id: 'roadmap', title: { vi: 'Duyệt lộ trình cộng đồng, nhiệm vụ, bảng tin 3 + 1', en: 'Approve the community, quests and 3 + 1 feed roadmap' } },
];
