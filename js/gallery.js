/* KINARA — galeri & detail album */
const albumCard = (a) => `
  <a class="album" href="album.html?id=${a.id}" data-type="${a.type}" data-reveal data-tilt>
    <img src="${img(a.cover, 800)}" alt="Album ${a.title}" loading="lazy">
    <span class="album-count">${a.photos.length} foto</span>
    <div class="album-info"><div><small>${a.type}</small><h3>${a.title}</h3><p>${a.desc}</p></div><span class="album-go">${icon('ri:arrow-right-up-line')}</span></div>
  </a>`;

function initGalleryIndex() {
  const grid = $('#albumGrid');
  grid.innerHTML = ALBUMS.map(albumCard).join('');
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#filters button').forEach((x) => x.classList.toggle('on', x === b));
    $$('.album', grid).forEach((a) => a.classList.toggle('hide', b.dataset.f !== 'all' && a.dataset.type !== b.dataset.f));
  });
  initReveal(); initTilt();
}

function initAlbum() {
  const id = new URLSearchParams(location.search).get('id');
  const album = ALBUMS.find((a) => a.id === id) || ALBUMS[0];
  document.title = `${album.title} — Galeri Kinara`;
  $('#crumbCur').textContent = album.title;
  $('#albumType').textContent = `Album ${album.type}`;
  $('#albumTitle').textContent = album.title;
  $('#albumDesc').textContent = album.desc;

  const cls = CLASSES.find((c) => c.id === album.id);
  const br = BRANCHES.find((b) => b.id === album.id);
  $('#albumMeta').innerHTML = `<span class="chip">${album.photos.length} foto</span>` +
    (br ? `<a class="btn btn-primary" href="${br.file}">Lihat jadwal ${br.name} ${icon('ri:arrow-right-up-line')}</a>` : '') +
    (cls ? `<a class="btn btn-primary" href="index.html#kelas">Tentang kelas ${icon('ri:arrow-right-up-line')}</a>` : '') +
    `<a class="btn btn-wa" href="${waLink(`Halo Kinara, saya tertarik dengan ${album.title}.`)}" target="_blank" rel="noopener">${icon('ri:whatsapp-line')} Tanya via WhatsApp</a>`;

  $('#masonry').innerHTML = album.photos.map(([k, cap], i) =>
    `<button class="shot" data-i="${i}" data-reveal aria-label="Buka foto: ${cap}"><img src="${img(k, 800)}" alt="${cap}" loading="lazy"><span class="shot-cap">${cap}</span></button>`).join('');

  $('#moreAlbums').innerHTML = ALBUMS.filter((a) => a.id !== album.id).slice(0, 3).map(albumCard).join('');

  /* Lightbox */
  const lb = $('#lb'); const lbImg = $('#lbImg'); const lbCap = $('#lbCap');
  let cur = 0; let lastFocus = null;
  const show = (i) => {
    cur = (i + album.photos.length) % album.photos.length;
    const [k, cap] = album.photos[cur];
    lbImg.src = img(k, 1600); lbImg.alt = cap;
    lbCap.innerHTML = `${cap}<small>${cur + 1} / ${album.photos.length}</small>`;
  };
  const open = (i) => { lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('#lbClose').focus(); };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  $('#masonry').addEventListener('click', (e) => { const s = e.target.closest('.shot'); if (s) open(+s.dataset.i); });
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(cur - 1));
  $('#lbNext').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); x0 = null; });

  initReveal(); initTilt();
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.dataset.page === 'album' ? initAlbum() : initGalleryIndex();
});
