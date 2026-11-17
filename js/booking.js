/* KINARA — booking kelas (stepper → pesan WhatsApp) */
document.addEventListener('DOMContentLoaded', () => {
  const STEPS = ['Cabang', 'Kelas', 'Jadwal', 'Data', 'Kirim'];
  const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const S = { step: 1, branch: null, cls: null, date: null, hour: null, level: 'Pemula (belum pernah)' };
  const q = new URLSearchParams(location.search);

  const dayOf = (d) => DAYS[(d.getDay() + 6) % 7];
  const fmtDate = (d) => `${dayOf(d)}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const pad = (n) => String(n).padStart(2, '0');
  const slotLabel = (h) => `${pad(h)}.00 – ${pad(h + 1)}.00`;
  const shiftIdx = (h) => (h < 14 ? 0 : 1);
  const branch = () => BRANCHES.find((b) => b.id === S.branch);
  const klass = () => CLASSES.find((c) => c.id === S.cls);
  const coachFor = (b, d, h) => asList(b.sched[dayOf(d)][shiftIdx(h)]).map((c) => (isCover(c) ? 'Coach Cover (dikonfirmasi tim)' : `Coach ${c}`)).join(' / ');

  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; });
  const sameDay = (a, b) => a && b && a.getTime() === b.getTime();

  /* ---------- Stepper ---------- */
  const stepper = $('#stepper');
  const paintStepper = () => {
    stepper.innerHTML = STEPS.map((s, i) => `<li class="${i + 1 === S.step ? 'cur' : i + 1 < S.step ? 'ok' : ''}"><i>${i + 1 < S.step ? icon('ri:check-line') : i + 1}</i><span>${s}</span></li>`).join('');
    stepper.style.setProperty('--pn', (S.step - 1) / (STEPS.length - 1));
  };

  /* ---------- Langkah 1: cabang ---------- */
  $('#optBranch').innerHTML = BRANCHES.map((b) => `
    <button type="button" class="opt" role="radio" aria-checked="false" data-id="${b.id}">
      <img src="${img(b.cover, 400)}" alt="" loading="lazy">
      <div><b>${b.title}</b><small>${icon('ri:map-pin-2-line')} ${b.area}</small><span>${b.classes.join(' · ')}</span></div>
      <em>${icon('ri:check-line')}</em>
    </button>`).join('');

  /* ---------- Langkah 2: kelas ---------- */
  const paintClasses = () => {
    const b = branch();
    $('#optClass').innerHTML = !b ? '' : CLASSES.filter((c) => c.where.includes(b.id)).map((c) => `
      <button type="button" class="opt big" role="radio" aria-checked="${S.cls === c.id}" data-id="${c.id}">
        <img src="${img(c.cover, 400)}" alt="" loading="lazy">
        <div><b>${c.name}</b><small>${c.tag}</small><span>${c.fits[0]}</span></div>
        <em>${icon('ri:check-line')}</em>
      </button>`).join('');
  };

  /* ---------- Langkah 3: tanggal & jam ---------- */
  const paintDates = () => {
    $('#dateStrip').innerHTML = dates.map((d, i) => `
      <button type="button" role="radio" aria-checked="${sameDay(S.date, d)}" data-i="${i}">
        <small>${i === 0 ? 'Hari ini' : dayOf(d).slice(0, 3)}</small><b>${d.getDate()}</b><span>${MONTHS[d.getMonth()].slice(0, 3)}</span>
      </button>`).join('');
  };
  const paintSlots = () => {
    const area = $('#slotArea'); const b = branch();
    if (!S.date || !b) { area.innerHTML = '<p class="empty">Pilih tanggal untuk melihat jam yang tersedia.</p>'; return; }
    const now = new Date(); const isToday = sameDay(S.date, new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    area.innerHTML = SHIFTS.map((sh, si) => {
      const hours = si === 0 ? [7, 8, 9, 10, 11, 12, 13] : [14, 15, 16, 17, 18, 19, 20];
      return `<div class="shift-block">
        <div class="sb-head">${icon(sh.icon)}<div><b>${sh.label}</b><small>${sh.time}</small></div><span class="sb-coach">${coachFor(b, S.date, hours[0])}</span></div>
        <div class="slots" role="radiogroup" aria-label="${sh.label}">${hours.map((h) => {
          const past = isToday && h <= now.getHours();
          return `<button type="button" role="radio" class="slot" aria-checked="${S.hour === h}" data-h="${h}" ${past ? 'disabled' : ''}>${slotLabel(h)}</button>`;
        }).join('')}</div>
      </div>`;
    }).join('');
  };

  /* ---------- Ringkasan ---------- */
  const row = (ic, k, v) => `<div class="${v ? 'filled' : ''}"><dt>${icon(ic)} ${k}</dt><dd>${v || '—'}</dd></div>`;
  const paintSummary = () => {
    const b = branch(); const c = klass();
    $('#sumList').innerHTML =
      row('ri:store-2-line', 'Cabang', b && b.title) +
      row('ri:shape-line', 'Kelas', c && c.name) +
      row('ri:calendar-2-line', 'Tanggal', S.date && fmtDate(S.date)) +
      row('ri:time-line', 'Jam', S.hour != null && `${slotLabel(S.hour)} (${SHIFTS[shiftIdx(S.hour)].label})`) +
      row('ri:user-star-line', 'Coach', b && S.date && S.hour != null && coachFor(b, S.date, S.hour));
  };

  /* ---------- Pesan WhatsApp ---------- */
  const message = () => {
    const b = branch(); const c = klass();
    const lines = [
      `Halo Kinara ${b.name}, saya ingin booking kelas:`,
      `• Kelas: ${c.name}`,
      `• Tanggal: ${fmtDate(S.date)}`,
      `• Jam: ${slotLabel(S.hour)} (${SHIFTS[shiftIdx(S.hour)].label})`,
      `• Coach: ${coachFor(b, S.date, S.hour)}`,
      `• Nama: ${$('#fName').value.trim()}`,
      `• WhatsApp: ${$('#fPhone').value.trim()}`,
      `• Pengalaman: ${S.level}`,
    ];
    const note = $('#fNote').value.trim(); if (note) lines.push(`• Catatan: ${note}`);
    lines.push('', 'Mohon dikonfirmasi ketersediaannya. Terima kasih!');
    return lines.join('\n');
  };
  const paintReview = () => {
    const b = branch(); const c = klass();
    $('#review').innerHTML = [
      ['Cabang', `${b.title}<small>${b.area}</small>`], ['Kelas', c.name], ['Tanggal', fmtDate(S.date)],
      ['Jam', `${slotLabel(S.hour)} <small>${SHIFTS[shiftIdx(S.hour)].label}</small>`], ['Coach', coachFor(b, S.date, S.hour)],
      ['Nama', $('#fName').value.trim()], ['WhatsApp', $('#fPhone').value.trim()], ['Pengalaman', S.level],
      ...($('#fNote').value.trim() ? [['Catatan', $('#fNote').value.trim().replace(/</g, '&lt;')]] : []),
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  };

  /* ---------- Validasi & navigasi ---------- */
  const err = $('#err');
  const showErr = (m) => { err.textContent = m; err.hidden = !m; };
  const validate = (n) => {
    if (n === 1 && !S.branch) return 'Pilih salah satu cabang dulu.';
    if (n === 2 && !S.cls) return 'Pilih jenis kelas dulu.';
    if (n === 3 && !S.date) return 'Pilih tanggal dulu.';
    if (n === 3 && S.hour == null) return 'Pilih jam kelas dulu.';
    if (n === 4) {
      if ($('#fName').value.trim().length < 2) return 'Isi nama lengkap Anda.';
      if ($('#fPhone').value.replace(/\D/g, '').length < 9) return 'Nomor WhatsApp belum lengkap.';
    }
    return '';
  };
  const go = (n) => {
    S.step = Math.max(1, Math.min(5, n));
    $$('.panel').forEach((p) => p.classList.toggle('on', +p.dataset.step === S.step));
    $('#btnBack').style.visibility = S.step === 1 ? 'hidden' : 'visible';
    $('#btnNext').innerHTML = S.step === 5 ? `${icon('ri:whatsapp-line')} Kirim via WhatsApp` : `Lanjut ${icon('ri:arrow-right-line')}`;
    $('#btnNext').classList.toggle('btn-wa', S.step === 5); $('#btnNext').classList.toggle('btn-primary', S.step !== 5);
    if (S.step === 2) paintClasses();
    if (S.step === 3) { paintDates(); paintSlots(); }
    if (S.step === 5) paintReview();
    showErr(''); paintStepper();
    const top = $('.bk-main').getBoundingClientRect().top + scrollY - 100;
    if (scrollY > top) scrollTo({ top, behavior: 'smooth' });
  };
  $('#btnNext').addEventListener('click', () => {
    const m = validate(S.step); if (m) { showErr(m); return; }
    if (S.step < 5) { go(S.step + 1); return; }
    const url = waLink(message());
    $('#reSend').href = url; window.open(url, '_blank', 'noopener');
    $('#bkForm').hidden = true; $('#done').hidden = false; $('#stepper').hidden = true;
    scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#btnBack').addEventListener('click', () => go(S.step - 1));
  $('#bkForm').addEventListener('submit', (e) => e.preventDefault());

  /* ---------- Interaksi pilihan ---------- */
  const setBranch = (id) => {
    if (S.branch !== id) { S.cls = null; S.hour = null; }
    S.branch = id;
    $$('#optBranch .opt').forEach((o) => o.setAttribute('aria-checked', o.dataset.id === id));
    const b = branch(); if (b.classes.length === 1) S.cls = CLASSES.find((c) => c.name.startsWith(b.classes[0])).id;
    paintSummary();
  };
  $('#optBranch').addEventListener('click', (e) => {
    const o = e.target.closest('.opt'); if (!o) return;
    setBranch(o.dataset.id); showErr('');
    setTimeout(() => go(2), 220);
  });
  $('#optClass').addEventListener('click', (e) => {
    const o = e.target.closest('.opt'); if (!o) return;
    S.cls = o.dataset.id; paintClasses(); paintSummary(); showErr('');
    setTimeout(() => go(3), 220);
  });
  $('#dateStrip').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    S.date = dates[+b.dataset.i]; S.hour = null; paintDates(); paintSlots(); paintSummary(); showErr('');
  });
  $('#slotArea').addEventListener('click', (e) => {
    const b = e.target.closest('.slot'); if (!b || b.disabled) return;
    S.hour = +b.dataset.h; paintSlots(); paintSummary(); showErr('');
  });
  $('#segLevel').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    S.level = b.dataset.v; $$('#segLevel button').forEach((x) => x.setAttribute('aria-checked', x === b));
  });

  /* ---------- Prefill dari halaman cabang ---------- */
  const pre = q.get('branch');
  if (pre && BRANCHES.some((b) => b.id === pre)) {
    setBranch(pre);
    const day = q.get('day');
    if (day && DAYS.includes(day)) {
      const hit = dates.find((d) => dayOf(d) === day); if (hit) S.date = hit;
    }
    S.step = S.cls ? 3 : 2;
  }
  $('#helpWa').href = waLink(); $('#helpWa').textContent = 'Chat tim Kinara';
  paintSummary(); go(S.step);
  initReveal();
});
