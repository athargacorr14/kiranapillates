/* KINARA — halaman testimoni */
document.addEventListener('DOMContentLoaded', () => {
  const grid = $('#tGrid'); const filters = $('#tFilters');
  const paint = (f) => {
    const list = TESTIMONIALS.filter((t) => f === 'all' || t.branch === f);
    grid.innerHTML = list.length ? list.map((t) => `<div data-reveal>${testiCard(t)}</div>`).join('') : '<p class="lead">Belum ada testimoni untuk cabang ini.</p>';
    initReveal(grid);
  };
  filters.innerHTML = `<button class="on" data-f="all">Semua</button>` + BRANCHES.map((b) => `<button data-f="${b.id}">${b.name}</button>`).join('');
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', filters).forEach((x) => x.classList.toggle('on', x === b)); paint(b.dataset.f);
  });
  paint('all');

  $('#tBranch').innerHTML = BRANCHES.map((b) => `<option value="${b.title}">${b.title}</option>`).join('');
  $('#tForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#tName').value.trim(); const text = $('#tText').value.trim(); const err = $('#tErr');
    if (!name || text.length < 10) { err.textContent = 'Isi nama dan ceritakan pengalamanmu (minimal beberapa kalimat).'; err.hidden = false; return; }
    if (!$('#tOk').checked) { err.textContent = 'Centang persetujuan agar testimoni boleh ditampilkan.'; err.hidden = false; return; }
    err.hidden = true;
    const msg = `Halo Kinara, saya ingin berbagi testimoni.\n\nNama: ${name}\nCabang: ${$('#tBranch').value}\n\n"${text}"\n\nSaya mengizinkan testimoni ini ditampilkan di website Kinara.`;
    window.open(waLink(msg), '_blank', 'noopener');
  });

  $('#ctaMount').innerHTML = ctaHTML();
  initReveal(); initTilt();
});
