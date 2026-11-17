/* KINARA — halaman cabang (satu template, data dari data.js) */
document.addEventListener('DOMContentLoaded', () => {
  const b = BRANCHES.find((x) => x.id === document.body.dataset.branch) || BRANCHES[0];
  const album = ALBUMS.find((a) => a.id === b.album);
  const today = todayName();
  const isFull = (d) => (b.fullDay || []).includes(d);
  const coachTag = (n) => `<span class="coach${isCover(n) ? ' is-cover' : ''}">${coachLabel(n)}</span>`;
  const coachesOf = (shift) => asList(shift).map(coachTag).join('');
  const bookUrl = (day, shift) => `booking.html?branch=${b.id}${day ? `&day=${day}` : ''}${shift ? `&shift=${shift}` : ''}`;

  document.title = `${b.title} — Jadwal & Booking | Kinara Pilates`;
  $('#bArea').textContent = b.area;
  $('#bArea2').textContent = b.name;
  $('#bTitle').innerHTML = b.id === 'cikarang-selatan' ? 'Kinara <em>Cikarang Selatan</em>' : `Kinara <em>${b.name}</em>`;
  $('#bLead').textContent = `${b.tagline} ${b.short}`;
  $('#bTags').innerHTML = b.classes.map((c) => `<span class="chip">${c}</span>`).join('') + '<span class="chip">Setiap hari 07.00–21.00</span>';
  $('#bBook').href = bookUrl(); $('#bBook2').href = bookUrl();

  /* Carousel hero (efek creative) */
  $('#bSlides').innerHTML = album.photos.slice(0, 5).map(([k, cap]) => `<div class="swiper-slide"><img src="${img(k, 1000)}" alt="${cap}"><span class="slide-cap">${cap}</span></div>`).join('');
  if (window.Swiper) {
    new Swiper('#bSwiper', {
      loop: true, speed: 1000, grabCursor: true, effect: 'creative',
      creativeEffect: { prev: { translate: ['-100%', 0, -160], rotate: [0, 0, -6], opacity: 0 }, next: { translate: ['100%', 0, -160], rotate: [0, 0, 6], opacity: 0 } },
      autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '#bSwiper .swiper-pagination', clickable: true },
    });
  }

  /* Info bar */
  const coachSet = new Set();
  DAYS.forEach((d) => b.sched[d].forEach((s) => asList(s).forEach((c) => !isCover(c) && coachSet.add(c))));
  $('#infoBar').innerHTML = `
    <div class="info-item">${icon('ri:map-pin-2-line')}<div><small>Lokasi</small><b>${b.area}</b></div></div>
    <div class="info-item">${icon('ri:time-line')}<div><small>Jam latihan</small><b>${SITE.hours}</b></div></div>
    <div class="info-item">${icon('ri:swap-box-line')}<div><small>Jenis kelas</small><b>${b.classes.join(' & ')}</b></div></div>
    <div class="info-item">${icon('ri:user-star-line')}<div><small>Coach</small><b>${coachSet.size} coach aktif</b></div></div>`;

  /* Kelas di cabang */
  $('#bClass').innerHTML = CLASSES.filter((c) => c.where.includes(b.id)).map((c) =>
    `<article data-reveal><img src="${img(c.cover, 400)}" alt="${c.name}" loading="lazy"><div><h3>${c.name}</h3><p>${c.tag}</p></div></article>`).join('');

  /* Jadwal: tab hari + tabel mingguan */
  const host = $('#schedule');
  host.innerHTML = `
    <div class="dtabs" role="tablist" aria-label="Pilih hari">${DAYS.map((d) => `<button role="tab" data-d="${d}" aria-selected="${d === today}"><b>${d.slice(0, 3)}</b><span>${d}</span></button>`).join('')}</div>
    <div class="dpanel" id="dpanel" aria-live="polite"></div>
    <h3 class="mx-title">Jadwal seminggu</h3>
    <div class="mx-wrap"><table class="matrix"><thead><tr><th></th>${DAYS.map((d) => `<th class="${d === today ? 'is-today' : ''}">${d.slice(0, 3)}</th>`).join('')}</tr></thead>
    <tbody>${SHIFTS.map((s, i) => `<tr><th scope="row">${s.label.replace('Sesi ', '')}<small>${s.time}</small></th>${DAYS.map((d) =>
      isFull(d) ? (i === 0 ? `<td rowspan="2" class="full${d === today ? ' is-today' : ''}">${asList(b.sched[d][0]).join(', ')}<small>Seharian</small></td>` : '')
        : `<td class="${d === today ? 'is-today' : ''}${asList(b.sched[d][i]).some(isCover) ? ' cover' : ''}">${asList(b.sched[d][i]).join(' / ')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="legend">${icon('ri:information-line')} <span><b>Coach Cover</b> adalah coach pengganti; namanya dikonfirmasi tim cabang. Jadwal dapat berubah sewaktu-waktu.</span></p>`;
  const paint = (d) => {
    $('#dpanel').innerHTML = `<div class="dp-head"><h3>${d}</h3>${d === today ? '<span class="now">Hari ini</span>' : ''}</div>
      <div class="dp-cards">${isFull(d)
        ? `<div class="shift-card wide"><span class="sc-ic">${icon('ri:calendar-check-line')}</span><small>Seharian</small><em>07.00 – 21.00</em>${coachesOf(b.sched[d][0])}<a class="btn btn-primary sc-book" href="${bookUrl(d)}">Booking hari ini ${icon('ri:arrow-right-line')}</a></div>`
        : SHIFTS.map((s, i) => `<div class="shift-card"><span class="sc-ic">${icon(s.icon)}</span><small>${s.label}</small><em>${s.time}</em>${coachesOf(b.sched[d][i])}<a class="btn btn-primary sc-book" href="${bookUrl(d, s.id)}">Booking sesi ${icon('ri:arrow-right-line')}</a></div>`).join('')}</div>
      ${b.notes && b.notes[d] ? `<p class="note">${icon('ri:information-line')} ${b.notes[d]}</p>` : ''}`;
  };
  host.addEventListener('click', (e) => {
    const t = e.target.closest('.dtabs button'); if (!t) return;
    $$('.dtabs button', host).forEach((x) => x.setAttribute('aria-selected', x === t)); paint(t.dataset.d);
  });
  paint(today);

  /* Coach cabang */
  const slots = new Map();
  DAYS.forEach((d) => b.sched[d].forEach((s, i) => asList(s).forEach((c) => {
    if (isCover(c)) return;
    const e = slots.get(c) || [];
    const label = `${d.slice(0, 3)} ${isFull(d) ? 'seharian' : i ? 'sore' : 'pagi'}`;
    if (!(isFull(d) && i === 1)) e.push(label);
    slots.set(c, e);
  })));
  $('#bCoaches').innerHTML = [...slots.entries()].sort((a, z) => z[1].length - a[1].length).map(([c, list], i) => {
    const shown = list.slice(0, 3).join(' · ') + (list.length > 3 ? ` +${list.length - 3}` : '');
    return coachCard(c, { no: i + 1, href: bookUrl(), classes: b.classes, tag: `${list.length} sesi/minggu`, metaIcon: 'ri:calendar-2-line', meta: shown });
  }).join('');

  /* Galeri: satu bingkai (slideshow) */
  const shots = album.photos.slice(0, 5);
  $('#miniGallery').innerHTML = shots.map(([k, cap]) =>
    `<div class="swiper-slide"><a href="album.html?id=${album.id}" aria-label="Buka album ${album.title}"><img src="${img(k, 1400)}" alt="${cap}" loading="lazy"></a></div>`).join('');
  $$('.js-album').forEach((a) => { a.href = `album.html?id=${album.id}`; });
  $('#oneBar').innerHTML = shots.map(() => '<i><b></b></i>').join('');
  const bars = $$('#oneBar i');
  const mark = (sw) => {
    const i = sw.realIndex;
    bars.forEach((x, n) => { x.classList.toggle('done', n < i); x.classList.remove('on'); void x.offsetWidth; x.classList.toggle('on', n === i); });
    $('#oneCap').textContent = shots[i][1]; $('#oneCount').textContent = `${i + 1} / ${shots.length}`;
  };
  if (window.Swiper) {
    new Swiper('#oneSwiper', {
      loop: true, effect: 'fade', fadeEffect: { crossFade: true }, speed: 1000, grabCursor: true,
      autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { prevEl: '#onePrev', nextEl: '#oneNext' },
      on: { init: mark, slideChange: mark },
    });
  } else { $('#oneCap').textContent = shots[0][1]; }
  $$('.js-wa').forEach((a) => { a.href = waLink(`Halo Kinara ${b.name}, saya ingin bertanya tentang kelas dan jadwal.`); a.target = '_blank'; a.rel = 'noopener'; });
  $$('.js-maps').forEach((a) => { a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.title} ${b.area}`)}`; a.target = '_blank'; a.rel = 'noopener'; });
  $('#others').innerHTML = BRANCHES.filter((x) => x.id !== b.id).map((x) => branchCard(x, BRANCHES.indexOf(x))).join('');

  initReveal(); initTilt();
});
