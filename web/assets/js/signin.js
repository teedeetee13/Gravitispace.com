// Graviti Stars mở hộp đăng nhập dùng chung (login.js) với chữ, thông báo và cách đồng bộ dữ liệu của riêng mình.
import { openLogin } from './login.js';
import { t } from './i18n.js';
import { toast } from './util.js';
import { store } from './store.js';
import { CONFIG } from './config.js';
import { ROOT, link } from './route.js';

/** Trang chính sách nằm ở gốc web (…/privacy/), tính từ gốc Graviti Stars để đúng ở mọi độ sâu trang. */
export const privacyUrl = () => new URL(CONFIG.PRIVACY_URL, location.origin + ROOT).pathname;

// Vừa đăng xuất → trang Tài khoản vẽ lại ở chế độ khách mà không tự bật hộp đăng nhập lên nữa
let signedOutJustNow = false;
export const markSignedOut = () => (signedOutJustNow = true);
export function takeSignedOut() {
  const v = signedOutJustNow;
  signedOutJustNow = false;
  return v;
}

/** Mở hộp đăng nhập ngay trên trang đang xem. mode: 'signin' | 'signup' | 'forgot' | 'newpass' | 'me' */
export function showLogin(mode = 'signin') {
  openLogin({
    t,
    mode,
    toast,
    privacyUrl: privacyUrl(),
    manageUrl: link('tai-khoan'),
    // Đăng xuất: đồng bộ nốt thay đổi rồi mới xoá bản sao dữ liệu của tài khoản khỏi máy này
    signOut: () => store.signOut(),
    async onDone(what) {
      // Vừa đăng nhập: gộp dữ liệu khách trên máy vào tài khoản (không mất gì), rồi đồng bộ
      if (what === 'signin') await store.afterSignIn();
      if (what === 'signout') markSignedOut();
      if (what !== 'password') window.dispatchEvent(new Event('ansao:auth'));
    },
  });
}
