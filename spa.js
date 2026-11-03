/* ============================================
   SPA ROUTER — สลับ section โดยไม่โหลดหน้าใหม่
   ใช้ hash (#home, #projects ...) จึงทำงานบน GitHub Pages ได้เลย
   ไม่ต้องตั้งค่า redirect เพิ่ม
   ============================================ */
(function () {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.file-item[data-target]');
  const inlineLinks = document.querySelectorAll('a[data-target]:not(.file-item)');
  const tabs = document.querySelectorAll('.tab');
  const gutter = document.getElementById('gutter');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');

  // แก้ชื่อที่แสดงบนแท็บเบราว์เซอร์ของแต่ละหน้าได้ที่นี่
  const pageTitles = {
    home: 'กฤตยชญ์ กุลกลางดอน — Portfolio',
    projects: 'ผลงานเด่น — กฤตยชญ์ กุลกลางดอน',
    about: 'ทักษะและประสบการณ์ — กฤตยชญ์ กุลกลางดอน',
    contact: 'ติดต่อ — กฤตยชญ์ กุลกลางดอน'
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
    section.querySelectorAll('.reveal').forEach((el, i) => {
      el.classList.remove('in-view');
      setTimeout(() => el.classList.add('in-view'), 40 + i * 70);
    });
  }

  function goTo(target, pushHistory) {
    const section = document.getElementById(target);
    if (!section) return;

    pages.forEach(p => p.classList.toggle('active', p.id === target));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === target));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));

    revealIn(section);
    renderGutter(section);

    if (pageTitles[target]) document.title = pageTitles[target];
    if (pushHistory !== false) history.pushState({ target: target }, '', '#' + target);

    if (sidebar) sidebar.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function onNavClick(e) {
    const target = e.currentTarget.dataset.target;
    if (!target || !document.getElementById(target)) return;
    e.preventDefault();
    goTo(target);
  }

  navLinks.forEach(l => l.addEventListener('click', onNavClick));
  inlineLinks.forEach(l => l.addEventListener('click', onNavClick));

  window.addEventListener('popstate', function () {
    const target = (location.hash || '#home').slice(1);
    goTo(document.getElementById(target) ? target : 'home', false);
  });

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function () {
      const open = sidebar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // เปิดหน้าแรก: ถ้ามี #hash ใน URL ให้ไปหน้านั้นเลย
  const initial = (location.hash || '#home').slice(1);
  goTo(document.getElementById(initial) ? initial : 'home', false);
})();
