// Lớp "nội dung đã bản địa hoá": trả về bản sao dữ liệu với các trường văn bản theo ngôn ngữ đang chọn.
// Giao diện luôn đi qua đây thay vì đọc trực tiếp dữ liệu tiếng Việt.
import { cx, getLang } from './i18n.js';
import { suitById } from './data/tarot.js';

const pick = (kind, obj, fields) => {
  if (getLang() === 'vi') return obj;
  const out = { ...obj };
  for (const f of fields) out[f] = cx(kind, obj.id, f, obj[f]);
  return out;
};

export const card = (c) => pick('card', c, ['name', 'up', 'rev', 'msg', 'q']);
export const suit = (s) => pick('suit', s, ['name', 'element', 'domain']);
export const suitName = (id) => suit(suitById[id]).name;
export const sign = (s) => {
  const o = pick('sign', s, ['keywords', 'light', 'shadow', 'heal', 'element', 'modality', 'ruler']);
  return getLang() === 'vi' ? o : { ...o, name: cx('sign', s.id, 'name', s.en) };
};
export const chi = (c) => pick('chi', c, ['animal', 'traits', 'shadow', 'heal']);
export const post = (p) => (p.id?.startsWith('hd-') ? pick('post', p, ['title', 'body', 'author']) : p);
export const topicLabel = (tp) => cx('topic', tp.id, 'label', tp.label);
export const typeLabel = (tp) => cx('type', tp.id, 'label', tp.label);
export const spread = (s) => ({ ...s, name: cx('spread', s.id, 'name', s.name), positions: cx('spread', s.id, 'positions', s.positions) });
export const hanhName = (h) => cx('hanh', h, 'name', h);
export const hanh = (h, data) => ({ ...data, name: hanhName(h), tone: cx('hanh', h, 'tone', data.tone), trait: cx('hanh', h, 'trait', data.trait) });
export const napAm = (name, meaning) => ({ name: cx('napAm', name, 'name', name), meaning: cx('napAm', name, 'meaning', meaning) });

// Can Chi: tiếng Trung hiển thị bằng chữ Hán gốc (甲子, 丙午…) thay vì phiên âm Việt; ngôn ngữ khác giữ phiên âm Việt
// (như cách sách Tử Vi Việt Nam vẫn viết), kèm nghĩa ở những chỗ cần.
const CAN_HAN = { Giáp: '甲', Ất: '乙', Bính: '丙', Đinh: '丁', Mậu: '戊', Kỷ: '己', Canh: '庚', Tân: '辛', Nhâm: '壬', Quý: '癸' };
const CHI_HAN = { Tý: '子', Sửu: '丑', Dần: '寅', Mão: '卯', Thìn: '辰', Tỵ: '巳', Ngọ: '午', Mùi: '未', Thân: '申', Dậu: '酉', Tuất: '戌', Hợi: '亥' };
export const ganzhi = (s) => (getLang() !== 'zh' ? s : String(s).split(/\s+/).map((w) => CAN_HAN[w] ?? CHI_HAN[w] ?? w).join(''));
export const element = (el) => cx('element', el, 'name', el);
export const elementDesc = (el, d) => cx('element', el, 'desc', d);
export const hotline = (h) => ({ ...h, name: cx('hotline', h.number, 'name', h.name), note: cx('hotline', h.number, 'note', h.note) }); // khoá = số điện thoại (hoặc mã nếu là trang web)
