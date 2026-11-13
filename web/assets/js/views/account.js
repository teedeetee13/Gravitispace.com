// Địa chỉ cũ /stars/tai-khoan/ (link trong email cũ, dấu trang): trang Tài khoản giờ là trang chung của cả hệ
// ở gốc web (/tai-khoan/, mã ở hub/tai-khoan/). Chuyển thẳng sang đó, giữ nguyên ?che-do=… nếu có.
import { accountUrl } from '../signin.js';

export function renderAccount(view, params) {
  const q = params?.toString();
  location.replace(accountUrl() + (q ? '?' + q : ''));
}
