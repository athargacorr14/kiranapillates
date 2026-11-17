/* =========================================================
   KINARA — fungsi bersama: header, footer, loader, reveal
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const icon = (name, cls = '') => `<iconify-icon icon="${name}" class="ic ${cls}" aria-hidden="true"></iconify-icon>`;

const todayName = () => DAYS[(new Date().getDay() + 6) % 7];
const asList = (v) => [].concat(v);
const isCover = (n) => /^cover$/i.test(n);
const coachLabel = (n) => (isCover(n) ? 'Coach Cover' : `Coach ${n}`);
const initials = (n) => n.replace(/\./g, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function allCoaches() {
  const map = new Map();
  BRANCHES.forEach((b) => DAYS.forEach((d) => b.sched[d].forEach((shift, i) => asList(shift).forEach((c) => {
    if (isCover(c)) return;
    const e = map.get(c) || { name: c, branches: new Set(), sessions: 0 };
    e.branches.add(b.name); e.sessions++; map.set(c, e);
  }))));
  return [...map.values()].sort((a, b) => b.sessions - a.sessions);
}

/* ---------- Header & Footer ---------- */
function renderChrome() {
  const page = document.body.dataset.page || '';
  const here = (p) => (page === p ? ' aria-current="page"' : '');

  const header = `
  <a class="skip" href="#main">Lewati ke konten</a>
  <header class="header" id="top">
    <div class="wrap header-in">
      <a class="brand" href="index.html" aria-label="Kinara — beranda">
        <img src="assets/kinara-logo.jpg" alt="" width="46" height="46">
        <span><b>KINARA</b><small>Pilates &amp; Movement Studio</small></span>
      </a>
      <button class="menu-toggle" id="menuToggle" aria-label="Buka menu" aria-expanded="false" aria-controls="nav"><i></i><i></i><i></i></button>
      <nav class="nav" id="nav" aria-label="Navigasi utama">
        <a href="index.html"${here('home')}>Beranda</a>
        <a href="index.html#kelas">Kelas</a>
        <div class="nav-drop${page === 'branch' ? ' is-current' : ''}">
          <a href="index.html#cabang" class="drop-btn">Cabang ${icon('ri:arrow-down-s-line')}</a>
          <div class="drop-menu">
            ${BRANCHES.map((b) => `<a href="${b.file}"${document.body.dataset.branch === b.id ? ' aria-current="page"' : ''}><b>${b.title}</b><small>${b.classes.join(' · ')}</small></a>`).join('')}
          </div>
        </div>
        <a href="galeri.html"${here('gallery')}>Galeri</a>
        <a href="testimoni.html"${here('testi')}>Testimoni</a>
        <a href="index.html#faq">FAQ</a>
        <a class="btn btn-primary nav-cta" href="booking.html"${here('booking')}>${icon('ri:calendar-check-line')} Booking kelas</a>
      </nav>
    </div>
  </header>`;

  const footer = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-about">
          <a class="footer-brand" href="index.html"><img src="assets/kinara-logo.jpg" alt="" width="52" height="52"><span>KINARA<small>Pilates &amp; Movement Studio</small></span></a>
          <p>Ruang gerak untuk membangun kekuatan, keseimbangan, dan koneksi dengan tubuh sendiri. Tersedia di 4 cabang.</p>
          <div class="social" aria-label="Media sosial Kinara">
            <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram Kinara">${icon('ri:instagram-line')}</a>
            <a href="${SITE.tiktok}" target="_blank" rel="noopener" aria-label="TikTok Kinara">${icon('ri:tiktok-line')}</a>
            <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp Kinara">${icon('ri:whatsapp-line')}</a>
          </div>
        </div>
        <div>
          <h4>Cabang</h4>
          <ul>${BRANCHES.map((b) => `<li><a href="${b.file}">${b.title}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Jelajahi</h4>
          <ul>
            <li><a href="index.html#kelas">Kelas</a></li>
            <li><a href="booking.html">Booking kelas</a></li>
            <li><a href="galeri.html">Galeri</a></li>
            <li><a href="testimoni.html">Testimoni</a></li>
            <li><a href="index.html#mulai">Cara mulai</a></li>
            <li><a href="index.html#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Hubungi kami</h4>
          <ul class="contact">
            <li>${icon('ri:whatsapp-line')}<a href="${waLink()}" target="_blank" rel="noopener">+${SITE.wa.replace(/^(\d{2})(\d{3})(\d{4})(\d+)$/, '$1 $2-$3-$4')}</a></li>
            <li>${icon('ri:instagram-line')}<a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a></li>
            <li>${icon('ri:time-line')}<span>Setiap hari, ${SITE.hours}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Kinara Pilates &amp; Movement Studio</span>
        <a href="#top">Kembali ke atas ${icon('ri:arrow-up-line')}</a>
      </div>
    </div>
  </footer>
  <a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat WhatsApp Kinara">${icon('ri:whatsapp-fill')}<span>Chat kami</span></a>`;

  $('#site-header').innerHTML = header;
  $('#site-footer').innerHTML = footer;

  const toggle = $('#menuToggle'); const nav = $('#nav');
  const close = () => { nav.classList.remove('open'); toggle.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('nav-open'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  $$('#nav a').forEach((a) => a.addEventListener('click', (e) => {
    if (a.classList.contains('drop-btn') && matchMedia('(max-width:960px)').matches) return;
    close();
  }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  const hd = $('.header');
  const onScroll = () => hd.classList.toggle('scrolled', scrollY > 12);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Loader: tenang, sekali per sesi, di semua halaman ---------- */
function initLoader() {
  let seen = false;
  try { seen = sessionStorage.getItem('kinara-loaded') === '1'; } catch (e) { /* abaikan */ }
  if (seen) return;
  const el = document.createElement('div');
  el.className = 'loader'; el.setAttribute('aria-label', 'Memuat Kinara');
  el.innerHTML = `
    <div class="ld-glow"></div>
    <div class="ld-center">
      <div class="ld-stage">
        <div class="ld-ripple" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="ld-logo">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ld-bg" cx="60" cy="60" r="56"/><circle class="ld-ring" cx="60" cy="60" r="56"/></svg>
          <img src="assets/kinara-logo.jpg" alt="" width="96" height="96">
        </div>
      </div>
      <p class="ld-word" aria-label="Kinara">${'KINARA'.split('').map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join('')}</p>
      <p class="ld-sub" id="ldSub">Tarik napas…</p>
      <svg class="ld-reformer" viewBox="0 0 260 54" aria-hidden="true">
        <line class="rl" x1="14" y1="42" x2="246" y2="42"/><line class="rl rl2" x1="14" y1="48" x2="246" y2="48"/>
        <rect class="post" x="6" y="12" width="7" height="38" rx="3.5"/>
        <path class="spring" id="ldSpring" d="M16 30 L40 30"/>
        <g id="ldCar"><rect class="pad" x="4" y="17" width="28" height="7" rx="3.5"/><rect class="car" x="0" y="24" width="36" height="13" rx="6.5"/><circle class="wh" cx="9" cy="41" r="3.6"/><circle class="wh" cx="27" cy="41" r="3.6"/></g>
      </svg>
      <p class="ld-pct" id="ldPct">00%</p>
    </div>`;
  document.body.prepend(el);
  document.body.classList.add('loading');
  const ring = $('.ld-ring', el); const C = 2 * Math.PI * 56;
  ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C;
  const t0 = performance.now(); const dur = 2600;
  const car = $('#ldCar', el); const spring = $('#ldSpring', el);
  const drawReformer = (p) => {
    const x = 18 + 200 * p; const x0 = 16; const m = 22; const amp = 8 - 4 * p;
    let d = `M${x0} 30`;
    for (let i = 1; i < m; i++) d += ` L${(x0 + (x - x0) * i / m).toFixed(1)} ${(30 + (i % 2 ? -amp : amp)).toFixed(1)}`;
    spring.setAttribute('d', d + ` L${x.toFixed(1)} 30`);
    car.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
  };
  drawReformer(0);
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    el.classList.add('done'); document.body.classList.remove('loading');
    try { sessionStorage.setItem('kinara-loaded', '1'); } catch (e) { /* abaikan */ }
    setTimeout(() => el.remove(), 800);
  };
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOut
    ring.style.strokeDashoffset = C * (1 - e);
    drawReformer(e);
    $('#ldPct', el).textContent = String(Math.round(e * 100)).padStart(2, '0') + '%';
    const sub = $('#ldSub', el); const msg = p < 0.45 ? 'Tarik napas…' : p < 0.85 ? 'Hembuskan perlahan…' : 'Mari bergerak.';
    if (sub.textContent !== msg) sub.textContent = msg;
    if (p < 1) requestAnimationFrame(tick); else setTimeout(finish, 250);
  };
  requestAnimationFrame(tick);
  setTimeout(finish, 4200); // cadangan bila tab di latar belakang
}

/* ---------- Efek "antigravity": elemen melayang + parallax halus ---------- */
function initFloat() {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const items = $$('[data-depth]'); if (!items.length) return;
  let mx = 0, my = 0, sy = 0, raf = 0;
  const apply = () => {
    raf = 0;
    items.forEach((el) => {
      const d = parseFloat(el.dataset.depth) || 0;
      el.style.translate = `${(mx * d).toFixed(1)}px ${(my * d - sy * d * 0.04).toFixed(1)}px`;
    });
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(apply); };
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; req(); }, { passive: true });
  }
  addEventListener('scroll', () => { sy = Math.min(scrollY, 900); req(); }, { passive: true });
}

/* ---------- Reveal saat scroll ---------- */
function initReveal(root = document) {
  const els = $$('[data-reveal]:not(.visible)', root);
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((e, i) => { e.style.setProperty('--d', `${(i % 4) * 70}ms`); io.observe(e); });
}

/* ---------- Foto gagal dimuat → tetap tampil rapi ---------- */
function initImgFallback() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && !e.target.dataset.failed) {
      e.target.dataset.failed = '1'; e.target.classList.add('img-fail');
    }
  }, true);
}

/* ---------- Efek miring halus pada kartu (desktop saja) ---------- */
function initTilt() {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Komponen yang dipakai banyak halaman ---------- */
function branchCard(b, i = 0) {
  return `
  <a class="bcard" href="${b.file}" data-reveal data-tilt>
    <div class="bcard-img"><img src="${img(b.cover, 800)}" alt="Studio ${b.title}" loading="lazy"><span class="bcard-no">0${i + 1}</span></div>
    <div class="bcard-body">
      <div class="bcard-chips">${b.classes.map((c) => `<span class="chip">${c}</span>`).join('')}</div>
      <h3>${b.title}</h3>
      <p class="bcard-area">${icon('ri:map-pin-2-line')} ${b.area}</p>
      <p class="bcard-desc">${b.short}</p>
      <span class="bcard-go">Jadwal &amp; booking ${icon('ri:arrow-right-up-line')}</span>
    </div>
  </a>`;
}

/* ---------- Coach: foto, kelas yang diajar, kartu ---------- */
const COACH_PHOTOS = ['studio', 'twist', 'plank', 'seated', 'core', 'glow', 'stretch', 'sunset', 'group', 'crunch', 'downdog', 'prayer', 'park', 'mats', 'beach'];
let _coachCache = null;
function coachList() { return _coachCache || (_coachCache = allCoaches()); }
function coachPhoto(name) { const i = coachList().findIndex((c) => c.name === name); return COACH_PHOTOS[(i < 0 ? 0 : i) % COACH_PHOTOS.length]; }
function classesOf(branchNames) {
  const set = new Set();
  BRANCHES.filter((b) => branchNames.includes(b.name)).forEach((b) => b.classes.forEach((c) => set.add(c)));
  return [...set];
}
/* opt: { no, href, classes[], metaIcon, meta, tag } */
function coachCard(name, opt) {
  const tag = opt.tag ? `<span class="t">${opt.tag}</span>` : '';
  return `<a class="ccard" href="${opt.href}">
    <img src="${img(coachPhoto(name), 600)}" alt="Coach ${name}" loading="lazy">
    <span class="cc-no">${icon('ri:medal-line')}${String(opt.no).padStart(2, '0')}</span>
    <div class="cc-panel">
      <span class="cc-role">Pilates Coach</span>
      <h3>Coach ${name}</h3>
      <div class="cc-tags">${opt.classes.map((c) => `<span>${c}</span>`).join('')}${tag}</div>
      <div class="cc-meta">${icon(opt.metaIcon || 'ri:map-pin-2-line')}<span>${opt.meta}</span></div>
    </div></a>`;
}

/* ---------- CTA "Siap mencoba?" (baris foto bergerak) ---------- */
function ctaHTML() {
  const keys = ['group', 'twist', 'plank', 'seated', 'studio', 'glow', 'crunch', 'mats', 'sunset', 'core', 'stretch', 'downdog'];
  const row = (list) => `<div class="cta3-track">${[...list, ...list].map((k) => `<figure><img src="${img(k, 420)}" alt="" loading="lazy"></figure>`).join('')}</div>`;
  return `<div class="cta3" data-reveal>
    <div class="cta3-rows" aria-hidden="true">
      <div class="cta3-row r1">${row(keys.slice(0, 6))}</div>
      <div class="cta3-row r2">${row(keys.slice(6))}</div>
    </div>
    <div class="cta3-body">
      <span class="kicker">Siap mencoba?</span>
      <h2 class="h2">Rasakan <em>bedanya.</em></h2>
      <p>Kelas pertama paling berkesan saat dipandu dengan baik. Pilih sesi, kami siapkan tempatnya.</p>
      <div class="cta3-actions">
        <a class="btn btn-primary" href="booking.html">${icon('ri:calendar-check-line')} Booking kelas</a>
        <a class="btn btn-ghost" href="${waLink()}" target="_blank" rel="noopener">${icon('ri:whatsapp-line')} Chat WhatsApp</a>
      </div>
      <div class="cta3-chips"><span>${icon('ri:seedling-line')} Ramah pemula</span><span>${icon('ri:store-2-line')} 4 cabang</span><span>${icon('ri:time-line')} ${SITE.hours}</span></div>
    </div>
  </div>`;
}

function testiCard(t) {
  const b = BRANCHES.find((x) => x.id === t.branch);
  return `<figure class="tcard"><div class="stars" aria-label="5 dari 5 bintang">${icon('ri:star-fill').repeat(5)}</div>
    <blockquote>${t.text}</blockquote>
    <figcaption><i>${initials(t.name)}</i><div><b>${t.name}</b><small>${t.cls} · ${b ? b.title : 'Kinara'}</small></div></figcaption></figure>`;
}

function faqHTML() {
  return FAQ.map(([q, a]) => `<details data-reveal><summary>${q}<span>${icon('ri:add-line')}</span></summary><p>${a}</p></details>`).join('');
}
function initFaq(root = document) {
  $$('.faq-list details', root).forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) $$('.faq-list details', root).forEach((o) => { if (o !== d) o.open = false; });
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  initImgFallback();
  renderChrome();
  initLoader();
  initFloat();
});
