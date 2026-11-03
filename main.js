/* ============================================
   MAIN — ธีม, typewriter, สื่อผลงาน, ฟอร์มติดต่อ
   ============================================ */

// แก้ข้อมูลติดต่อและข้อความ terminal ได้ตรงนี้
const CONFIG = {
  email: 'kunklangdon@gmail.com',
  terminalLines: [
    { text: '$ whoami', kind: 'prompt' },
    { text: '> กฤตยชญ์ กุลกลางดอน', kind: 'out' },
    { text: '$ target --position', kind: 'prompt' },
    { text: '> Project Coordinator · เจ้าหน้าที่ประสานงานโครงการ', kind: 'out' },
    { text: '$ skills --top', kind: 'prompt' },
    { text: '> ประสานงาน · ติดตามงาน · รายงาน · Google Apps Script', kind: 'out' }
  ]
};

/* ---------- 1) Dark / Light mode ---------- */
(function themeInit() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const KEY = 'portfolio-theme';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ } }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☾' : '☀';
    if (label) label.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
  }

  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  apply(read() || (prefersLight ? 'light' : 'dark'));

  if (btn) {
    btn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      write(next);
    });
  }
})();

/* ---------- 2) Typewriter ใน terminal หน้าแรก ---------- */
(function typewriter() {
  const box = document.getElementById('typewriter');
  if (!box) return;

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.textContent = '▋';

  // สร้างบรรทัดทั้งหมดไว้ก่อน แล้วค่อย ๆ เติมตัวอักษร
  const nodes = CONFIG.terminalLines.map(function (l) {
    const el = document.createElement('span');
    el.className = 'line ' + l.kind;
    box.appendChild(el);
    return el;
  });

  if (reduce) {
    CONFIG.terminalLines.forEach(function (l, i) { nodes[i].textContent = l.text; });
    nodes[nodes.length - 1].appendChild(caret);
    return;
  }

  let line = 0, ch = 0;
  function tick() {
    if (line >= CONFIG.terminalLines.length) return;
    const full = CONFIG.terminalLines[line].text;
    const chars = Array.from(full); // รองรับตัวอักษรไทยที่มีสระ/วรรณยุกต์
    ch++;
    nodes[line].textContent = chars.slice(0, ch).join('');
    nodes[line].appendChild(caret);

    if (ch >= chars.length) {
      line++; ch = 0;
      // บรรทัดคำสั่ง ($) พิมพ์เสร็จแล้วหน่วงเล็กน้อยก่อนขึ้นผลลัพธ์
      setTimeout(tick, CONFIG.terminalLines[line - 1].kind === 'prompt' ? 280 : 160);
    } else {
      setTimeout(tick, 22);
    }
  }
  setTimeout(tick, 350);
})();

/* ---------- 3) สื่อผลงาน: รูปภาพ / วิดีโอ ----------
   ใส่ path ที่ data-media ของ .project-media ใน index.html
   - รูป:   data-media="assets/queue.png"
   - วิดีโอ: data-media="assets/queue.mp4" (mp4 / webm)
   ถ้าโหลดไม่ได้ จะแสดงแผ่นปกเดิมแทน ไม่มีรูปแตก */
(function projectMedia() {
  document.querySelectorAll('[data-media]').forEach(function (box) {
    const src = (box.getAttribute('data-media') || '').trim();
    if (!src) return;
    const cover = box.firstElementChild;

    if (/\.(mp4|webm|mov)$/i.test(src)) {
      const v = document.createElement('video');
      v.src = src; v.muted = true; v.loop = true; v.autoplay = true;
      v.playsInline = true; v.controls = true; v.preload = 'metadata';
      v.addEventListener('error', function () { if (cover) box.replaceChildren(cover); });
      const badge = document.createElement('span');
      badge.className = 'media-badge';
      badge.textContent = '▶ VIDEO';
      box.replaceChildren(v, badge);
    } else {
      const img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.onload = function () { box.replaceChildren(img); };
      img.src = src; // ถ้า error จะคงแผ่นปกไว้
    }
  });
})();

/* ---------- 4) ฟอร์มติดต่อ → เปิดแอปอีเมล (ไม่ต้องมี backend) ---------- */
(function contactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = 'ติดต่อจากพอร์ตโฟลิโอ Project Coordinator — ' + name;
    const body = message + '\n\nจาก: ' + name;
    window.location.href = 'mailto:' + CONFIG.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
