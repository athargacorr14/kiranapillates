KINARA PILATES & MOVEMENT STUDIO — WEBSITE (statis, satu konsep desain)

Halaman
- index.html        Beranda (hero carousel, kelas, cabang, manfaat, galeri coverflow, FAQ)
- cabang.html?id=   Template satu halaman untuk semua cabang: galaxy | persada | kelapa-gading | cikarang-selatan
- booking.html      Booking kelas 5 langkah (cabang > kelas > tanggal & jam > data diri > kirim ke WhatsApp)
- testimoni.html    Testimoni + form "bagikan pengalaman" (dikirim ke WhatsApp, dengan centang izin tampil)
- galeri.html       Daftar album (filter Kelas / Cabang)
- album.html?id=    Detail album + lightbox

Mengubah isi
- js/data.js : SEMUA data (jadwal coach, cabang, kelas, album & foto, FAQ, nomor WA, Instagram, TikTok).
- css/style.css (gaya bersama), css/branch.css (halaman cabang), css/booking.css (booking).
- Header, footer, dan loading screen dibuat otomatis oleh js/main.js.

Catatan penting
- TESTIMONI di js/data.js (TESTIMONIALS) adalah CONTOH TEKS dengan nama "Member Kinara". Ganti dengan testimoni asli member (dengan izin) sebelum publish.
- Foto di carousel coach adalah foto kelas placeholder, bukan foto coach. Ganti dengan foto coach asli.
- css/extras.css berisi gaya carousel coach, testimoni, dan CTA.
- Booking = permintaan yang dikirim ke WhatsApp (nomor di data.js). Belum ada sistem slot/kuota; tim cabang yang mengonfirmasi.
- Akun TikTok di data.js (SITE.tiktok) masih perkiraan: https://www.tiktok.com/@kinara.pilates
- Alamat lengkap cabang (field "area" di data.js), terutama Persada, perlu diisi. Tombol "Buka lokasi" memakai pencarian Google Maps.
- Foto masih placeholder dari Unsplash; ganti di data.js (objek PHOTO / album).
- Ikon memakai Iconify (CDN), carousel memakai Swiper (CDN), font Google: butuh internet.
