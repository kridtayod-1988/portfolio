/* ============================================
   MAIN — ธีม, typewriter, สื่อผลงาน, ฟอร์มติดต่อ
   ============================================ */

// แก้ข้อมูลติดต่อและข้อความ terminal ได้ตรงนี้
const CONFIG = {
  email: 'kunklangdon@gmail.com'
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
    if (label) label.textContent = theme === 'dark' ? 'มืด' : 'สว่าง';
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
