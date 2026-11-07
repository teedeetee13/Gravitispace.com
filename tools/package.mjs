// Nén dist/ thành tệp bàn giao huu-duyen-<phiên bản>.zip (+ .sha256) trong thư mục release/.
//   npm run package        (tự chạy build trước)
// Dùng lệnh nén có sẵn của hệ điều hành — không thêm thư viện:
//   Linux/macOS: zip · Windows 10+: tar.exe (bsdtar, hỗ trợ định dạng zip)
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const DIST = join(ROOT, 'dist');
const REL = join(ROOT, 'release');
if (!existsSync(join(DIST, 'build-info.json'))) {
  console.error('Chưa có dist/. Chạy: npm run build');
  process.exit(1);
}
mkdirSync(REL, { recursive: true });
const name = `huu-duyen-${pkg.version}.zip`;
const zip = join(REL, name);
rmSync(zip, { force: true });
// Windows: gọi đích danh bsdtar của hệ thống (trong Git Bash, "tar" là GNU tar — không nén được zip)
if (process.platform === 'win32') execFileSync(join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe'), ['-a', '-c', '-f', zip, '-C', DIST, '.'], { stdio: 'inherit' });
else execFileSync('zip', ['-r', '-q', '-X', zip, '.'], { cwd: DIST, stdio: 'inherit' });
const hash = createHash('sha256').update(readFileSync(zip)).digest('hex');
writeFileSync(`${zip}.sha256`, `${hash}  ${name}\n`);
console.log(`Đã đóng gói release/${name}\nSHA-256: ${hash}`);
