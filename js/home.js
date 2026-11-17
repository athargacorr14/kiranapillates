/* KINARA — beranda */
document.addEventListener('DOMContentLoaded', () => {
  const coaches = allCoaches();
  $('#coachCount').textContent = coaches.length;

  /* Foto tentang */
  $('#apImg1').src = img('studio', 800);
  $('#apImg2').src = img('seated', 700);

  /* Marquee (diduplikasi agar loop mulus) */
  const words = ['Bergerak dengan niat', 'Temukan keseimbanganmu', 'Reformer', 'Tower', 'Napas · Kontrol · Kekuatan', 'Rayakan dirimu'];
  $('#marquee').innerHTML = [...words, ...words].map((w) => `<span>${w}</span>`).join('');

  /* Hero carousel: crossfade + ken-burns + progress bar */
  const heroSlides = [
    ['group', 'Kelas bersama', 'Reformer · Tower'],
    ['studio', 'Kontrol & kekuatan', 'Core Strength'],
    ['seated', 'Napas yang tenang', 'Mindful Breathing'],
    ['twist', 'Mobilitas tulang belakang', 'Flexibility'],
    ['glow', 'Gerak dengan niat', 'Move with Intention'],
  ];
  $('#heroSlides').innerHTML = heroSlides.map(([k, t, s], i) =>
    `<div class="swiper-slide"><img src="${img(k, 1000)}" alt="${t}" ${i ? 'loading="lazy"' : ''}><div class="cap"><small>${s}</small><strong>${t}</strong></div></div>`).join('');
  $('#heroProgress').innerHTML = heroSlides.map(() => '<i><b></b></i>').join('');

  if (window.Swiper) {
    const bars = $$('#heroProgress i');
    const pad = (n) => String(n).padStart(2, '0');
    const mark = (sw) => {
      bars.forEach((b, i) => { b.classList.toggle('done', i < sw.realIndex); b.classList.remove('on'); void b.offsetWidth; b.classList.toggle('on', i === sw.realIndex); });
      $('#heroCount').textContent = `${pad(sw.realIndex + 1)} / ${pad(heroSlides.length)}`;
    };
    new Swiper('#heroSwiper', {
      loop: true, effect: 'fade', fadeEffect: { crossFade: true }, speed: 1200,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '#heroPrev', nextEl: '#heroNext' },
      on: { init: mark, slideChange: mark },
    });
  } else { $('#heroProgress').remove(); }

  /* Tab kelas */
  const tabs = $('#classTabs'); const panels = $('#classPanels');
  tabs.innerHTML = CLASSES.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${c.name}</button>`).join('');
  panels.innerHTML = CLASSES.map((c, i) => `
    <article class="class-panel${i === 0 ? ' on' : ''}" role="tabpanel">
      <div class="class-pic"><img src="${img(c.cover, 900)}" alt="${c.name}" loading="lazy"><span class="chip">${c.where.length > 1 ? 'Tersedia di 4 cabang' : 'Khusus Kinara Galaxy'}</span></div>
      <div class="class-info">
        <span class="tag">${c.tag}</span>
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <ul class="fits">${c.fits.map((f) => `<li>${icon('ri:checkbox-circle-fill')}<span>${f}</span></li>`).join('')}</ul>
        <div class="where"><small>Tersedia di</small><div>${c.where.map((id) => { const b = BRANCHES.find((x) => x.id === id); return `<a href="${b.file}">${b.title}</a>`; }).join('')}</div></div>
        <div class="class-actions">
          <a class="btn btn-primary" href="${waLink(`Halo Kinara, saya ingin tahu lebih lanjut tentang kelas ${c.name}.`)}" target="_blank" rel="noopener">${icon('ri:whatsapp-line')} Tanya kelas ini</a>
          <a class="btn btn-ghost" href="album.html?id=${c.album}">Lihat foto kelas</a>
        </div>
      </div>
    </article>`).join('');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', tabs).forEach((x) => x.setAttribute('aria-selected', x === b));
    $$('.class-panel', panels).forEach((p, i) => p.classList.toggle('on', i === +b.dataset.i));
  });

  /* Cabang */
  $('#branchGrid').innerHTML = BRANCHES.map(branchCard).join('');

  /* Carousel galeri (coverflow) */
  $('#coverSlides').innerHTML = ALBUMS.map((a) =>
    `<div class="swiper-slide"><a href="album.html?id=${a.id}"><img src="${img(a.cover, 700)}" alt="Album ${a.title}" loading="lazy"><div class="info"><small>${a.type} · ${a.photos.length} foto</small><b>${a.title}</b></div></a></div>`).join('');
  if (window.Swiper) {
    new Swiper('#coverSwiper', {
      effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', loop: true, speed: 700,
      coverflowEffect: { rotate: 26, stretch: 0, depth: 160, modifier: 1, slideShadows: false },
      autoplay: { delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '#coverSwiper .swiper-pagination', clickable: true },
    });
  }

  /* Coach: carousel foto (foto placeholder kelas, ganti dengan foto coach asli) */
  $('#coachSlides').innerHTML = coaches.map((c, i) => {
    const br = [...c.branches];
    return `<div class="swiper-slide">${coachCard(c.name, {
      no: i + 1, href: BRANCHES.find((b) => b.name === br[0]).file, classes: classesOf(br),
      tag: `${c.sessions} sesi/minggu`, meta: br.map((n) => `Kinara ${n}`).join(' · '),
    })}</div>`;
  }).join('');
  if (window.Swiper) {
    new Swiper('#coachSwiper', {
      slidesPerView: 'auto', spaceBetween: 18, centeredSlides: false, grabCursor: true, loop: true, speed: 800, loopAdditionalSlides: 3,
      autoplay: { delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '#coachPrev', nextEl: '#coachNext' },
      pagination: { el: '#coachBar', type: 'progressbar' },
    });
  }

  /* Testimoni: efek cards */
  $('#testiSlides').innerHTML = TESTIMONIALS.map((t) => `<div class="swiper-slide">${testiCard(t)}</div>`).join('');
  if (window.Swiper) {
    new Swiper('#testiSwiper', {
      effect: 'cards', grabCursor: true, loop: false, cardsEffect: { slideShadows: false, perSlideOffset: 8, perSlideRotate: 3 },
      autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '#testiSwiper .swiper-pagination', clickable: true },
    });
  }

  /* Foto bulat kecil di hero & CTA */
  $('#hvOrb').src = img('seated', 400);
  $('#ctaMount').innerHTML = ctaHTML();

  /* FAQ & CTA */
  $('#faqList').innerHTML = faqHTML(); initFaq();

  initReveal(); initTilt();
});
