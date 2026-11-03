/* ============================================
   SPA ROUTER — สลับ section โดยไม่โหลดหน้าใหม่
   ใช้ hash (#home, #projects ...) จึงทำงานบน GitHub Pages ได้เลย
   ไม่ต้องตั้งค่า redirect เพิ่ม
   ============================================ */
(function () {
  const pages = document.querySelectorAll('.page');
  const pageIds = Array.from(pages).map(function (p) { return p.id; });
  const navLinks = document.querySelectorAll('.file-item[data-target]');
  const inlineLinks = document.querySelectorAll('a[data-target]:not(.file-item)');
  const tabs = document.querySelectorAll('.tab');
  const gutter = document.getElementById('gutter');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const content = document.getElementById('content');
  const skipLink = document.querySelector('[data-skip]');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // แก้ชื่อแท็บเบราว์เซอร์ของแต่ละหน้าได้ที่นี่
  const pageTitles = {
    home: 'Project Coordinator Portfolio | กฤตยชญ์ กุลกลางดอน',
    projects: 'ผลงานเด่น | กฤตยชญ์ กุลกลางดอน',
    skills: 'ทักษะพร้อมหลักฐาน | กฤตยชญ์ กุลกลางดอน',
    experience: 'ประสบการณ์ทำงาน | กฤตยชญ์ กุลกลางดอน',
    contact: 'ติดต่อ | กฤตยชญ์ กุลกลางดอน'
  };

  function renderGutter(section) {
    if (!gutter || !section) return;
    // นับเลขบรรทัดคร่าว ๆ ตามความสูงของหน้า (ประมาณ 1 บรรทัดต่อ 30px)
    const lines = Math.max(24, Math.ceil(section.scrollHeight / 30) + 6);
    let text = '';
    for (let i = 1; i <= lines; i++) text += i + '\n';
    gutter.textContent = text;
  }

  function revealIn(section) {
    section.querySelectorAll('.reveal').forEach(function (el, i) {
      el.classList.remove('in-view');
      setTimeout(function () { el.classList.add('in-view'); }, 40 + i * 70);
    });
  }

  // เลื่อนไปที่องค์ประกอบในหน้า (ใช้กับลิงก์หลักฐานของทักษะ) พร้อมไฮไลต์สั้น ๆ
  function focusItem(id) {
    const el = id && document.getElementById(id);
    if (!el) return;
    setTimeout(function () {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      el.classList.add('flash');
      setTimeout(function () { el.classList.remove('flash'); }, 1600);
    }, 120);
  }

  function goTo(target, pushHistory, focusId) {
    const section = document.getElementById(target);
    if (!section || pageIds.indexOf(target) === -1) return;

    pages.forEach(function (p) { p.classList.toggle('active', p.id === target); });
    navLinks.forEach(function (l) {
      const on = l.dataset.target === target;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.tab === target); });

    revealIn(section);
    renderGutter(section);

    if (pageTitles[target]) document.title = pageTitles[target];
    if (pushHistory !== false) history.pushState({ target: target }, '', '#' + target);

    if (sidebar) sidebar.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

    if (focusId) focusItem(focusId);
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function onNavClick(e) {
    const el = e.currentTarget;
    const target = el.dataset.target;
    if (!target || pageIds.indexOf(target) === -1) return;
    e.preventDefault();
    goTo(target, true, el.dataset.focus);
  }

  navLinks.forEach(function (l) { l.addEventListener('click', onNavClick); });
  inlineLinks.forEach(function (l) { l.addEventListener('click', onNavClick); });

  window.addEventListener('popstate', function () {
    const target = (location.hash || '#home').slice(1);
    goTo(pageIds.indexOf(target) !== -1 ? target : 'home', false);
  });

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function () {
      const open = sidebar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Skip link: ข้ามเมนูไปที่เนื้อหา โดยไม่เปลี่ยน hash ของหน้า
  if (skipLink && content) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      content.focus();
    });
  }

  // เปิดหน้าแรก: ถ้ามี #hash ใน URL ให้ไปหน้านั้นเลย
  const initial = (location.hash || '#home').slice(1);
  goTo(pageIds.indexOf(initial) !== -1 ? initial : 'home', false);
})();
