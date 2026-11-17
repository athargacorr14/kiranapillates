/* =========================================================
   KINARA — data pusat (jadwal, cabang, galeri, kontak)
   Ubah data di sini; semua halaman ikut berubah.
   ========================================================= */

const SITE = {
  name: 'Kinara Pilates & Movement Studio',
  wa: '6287781807636',
  instagram: 'https://www.instagram.com/kinara.pilates/',
  instagramHandle: '@kinara.pilates',
  tiktok: 'https://www.tiktok.com/@kinara.pilates',   // TODO: pastikan akun TikTok resmi
  hours: '07.00 – 21.00',
};

const waLink = (text) =>
  `https://wa.me/${SITE.wa}?text=${encodeURIComponent(text || 'Halo Kinara, saya ingin bertanya tentang jadwal dan booking kelas.')}`;

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SHIFTS = [
  { id: 'pagi', label: 'Sesi Pagi', time: '07.00 – 14.00', icon: 'ri:sun-line' },
  { id: 'sore', label: 'Sesi Sore', time: '14.00 – 21.00', icon: 'ri:moon-line' },
];

/* ---------- Foto (placeholder Unsplash — ganti dengan foto studio) ---------- */
const PHOTO = {
  studio: '1518611012118-696072aa579a',
  sunset: '1544367567-0f2fcb009e0b',
  plank: '1599447421416-3414500d18a5',
  twist: '1575052814086-f385e2e2ad1b',
  glow: '1506126613408-eca07ce68773',
  downdog: '1599901860904-17e6ed7083a0',
  crunch: '1571019613454-1cb2f99b2d8b',
  stretch: '1593810450967-f9c42742e326',
  seated: '1552196563-55cd4e45efb3',
  group: '1588286840104-8957b019727f',
  mats: '1601925260368-ae2f83cf8b7f',
  beach: '1545205597-3d9d02c29597',
  prayer: '1510894347713-fc3ed6fdf539',
  park: '1616699002805-0741e1e4a9c5',
  core: '1591258370814-01609b341790',
};
const img = (key, w = 900) =>
  `https://images.unsplash.com/photo-${PHOTO[key]}?auto=format&fit=crop&w=${w}&q=80`;

/* ---------- Cabang & jadwal ---------- */
/* sched[hari] = [sesiPagi, sesiSore]; tiap sesi bisa string atau array (dibagi dua coach). */
const BRANCHES = [
  {
    id: 'galaxy',
    file: 'cabang.html?id=galaxy',
    name: 'Galaxy',
    title: 'Kinara Galaxy',
    area: 'Grand Galaxy City, Bekasi',
    classes: ['Reformer', 'Tower'],
    tagline: 'Reformer & Tower dalam satu studio.',
    short: 'Satu-satunya cabang dengan kelas Tower, berdampingan dengan Reformer.',
    cover: 'group',
    album: 'galaxy',
    sched: {
      Senin: ['Pheny', 'Heni'],
      Selasa: ['Koming', 'Gek Dewi'],
      Rabu: ['Bianca', 'Febri'],
      Kamis: ['Nia', 'Nadya'],
      Jumat: ['Dea', 'Gek Dewi'],
      Sabtu: ['Yenni', 'Febri'],
      Minggu: ['Nury', 'Cover'],
    },
  },
  {
    id: 'persada',
    file: 'cabang.html?id=persada',
    name: 'Persada',
    title: 'Kinara Persada',
    area: 'Persada',
    classes: ['Reformer'],
    tagline: 'Ruang tenang untuk bergerak lebih sadar.',
    short: 'Jadwal padat dengan rotasi coach berpengalaman tiap hari.',
    cover: 'mats',
    album: 'persada',
    sched: {
      Senin: ['Febri', 'Risa'],
      Selasa: ['Dea', 'Nury'],
      Rabu: ['Jhovancka', 'Retno'],
      Kamis: ['Gek Dewi', 'Hanika'],
      Jumat: ['Bilqist', 'Bilqist'],
      Sabtu: ['Bianca', 'Cover'],
      Minggu: ['Nadya', 'Cover'],
    },
  },
  {
    id: 'kelapa-gading',
    file: 'cabang.html?id=kelapa-gading',
    name: 'Kelapa Gading',
    title: 'Kinara Kelapa Gading',
    area: 'Kelapa Gading, Jakarta Utara',
    classes: ['Reformer'],
    tagline: 'Gerak hangat di tengah ritme kota.',
    short: 'Kelas Reformer di Jakarta Utara dengan rotasi coach setiap hari.',
    cover: 'sunset',
    album: 'kelapa-gading',
    sched: {
      Senin: ['Sara', 'Ani'],
      Selasa: ['Titi', 'Sheren'],
      Rabu: ['Bilqist', 'Irna'],
      Kamis: ['Bilqist', 'Paulina'],
      Jumat: [['Yenni P.', 'Keysha'], 'Cover'],
      Sabtu: ['Irna', 'Sara'],
      Minggu: ['Melda', 'Melda'],
    },
    notes: { Jumat: 'Sesi pagi dibagi dua coach: Yenni P. dan Keysha.' },
  },
  {
    id: 'cikarang-selatan',
    file: 'cabang.html?id=cikarang-selatan',
    name: 'Cikarang Selatan',
    title: 'Kinara Cikarang Selatan',
    area: 'Cikarang Selatan, Bekasi',
    classes: ['Reformer'],
    tagline: 'R.FIT Pilates Reformer, powered by Kinara.',
    short: 'Cabang R.FIT dengan energi sporty dan jadwal penuh di akhir pekan.',
    cover: 'crunch',
    album: 'cikarang-selatan',
    fullDay: ['Jumat', 'Sabtu'],
    sched: {
      Senin: ['Tari', 'Rhinoy'],
      Selasa: ['Rhinoy', 'Rhinoy'],
      Rabu: ['Tari', 'Rhinoy'],
      Kamis: ['Rhinoy', 'Tari'],
      Jumat: ['Rhinoy', 'Rhinoy'],
      Sabtu: ['Rhinoy', 'Rhinoy'],
      Minggu: ['Rhinoy', 'Nathania'],
    },
  },
];

/* ---------- Kelas ---------- */
const CLASSES = [
  {
    id: 'reformer',
    name: 'Reformer Pilates',
    tag: 'Kekuatan · Kontrol · Stabilitas',
    cover: 'plank',
    desc: 'Latihan di atas mesin reformer dengan carriage yang meluncur dan tahanan pegas (spring). Setiap gerakan dipandu coach agar otot inti, punggung, dan postur bekerja benar.',
    fits: ['Pemula yang ingin dipandu detail', 'Perbaikan postur dan kekuatan core', 'Pemulihan ringan dan latihan low-impact'],
    where: ['galaxy', 'persada', 'kelapa-gading', 'cikarang-selatan'],
    album: 'reformer',
  },
  {
    id: 'tower',
    name: 'Tower Pilates',
    tag: 'Mobilitas · Presisi · Tahanan',
    cover: 'twist',
    desc: 'Menggunakan unit tower di dinding dengan pegas, push-through bar, dan roll-down bar. Cocok untuk melatih mobilitas tulang belakang, kekuatan kaki, dan kontrol gerak yang lebih presisi.',
    fits: ['Yang ingin variasi di luar reformer', 'Melatih mobilitas dan fleksibilitas', 'Penyempurnaan teknik dan kontrol'],
    where: ['galaxy'],
    album: 'tower',
  },
];

/* ---------- Album galeri ---------- */
const ALBUMS = [
  {
    id: 'reformer', type: 'Kelas', title: 'Reformer Pilates', cover: 'plank',
    desc: 'Momen latihan di atas reformer: dari pemanasan, kontrol core, hingga pendinginan.',
    photos: [
      ['group', 'Kelas kecil, perhatian penuh dari coach'],
      ['studio', 'Latihan core di atas matras'],
      ['plank', 'Plank dengan kontrol napas'],
      ['crunch', 'Penguatan otot perut'],
      ['stretch', 'Peregangan setelah sesi'],
      ['core', 'Kontrol punggung dan bahu'],
      ['twist', 'Rotasi tulang belakang'],
      ['seated', 'Duduk tenang, napas dalam'],
    ],
  },
  {
    id: 'tower', type: 'Kelas', title: 'Tower Pilates', cover: 'twist',
    desc: 'Gerakan presisi dengan tahanan pegas: mobilitas, kekuatan, dan kontrol.',
    photos: [
      ['twist', 'Mobilitas tulang belakang'],
      ['downdog', 'Memanjangkan tubuh bagian belakang'],
      ['seated', 'Postur duduk yang tinggi'],
      ['glow', 'Gerak lembut di sore hari'],
      ['prayer', 'Menutup sesi dengan hening'],
      ['stretch', 'Fleksibilitas pinggul dan punggung'],
      ['studio', 'Latihan beriringan'],
      ['mats', 'Perlengkapan siap pakai'],
    ],
  },
  {
    id: 'galaxy', type: 'Cabang', title: 'Kinara Galaxy', cover: 'group',
    desc: 'Studio Reformer & Tower di Grand Galaxy City, Bekasi.',
    photos: [
      ['group', 'Kelas bersama di Galaxy'],
      ['mats', 'Ruang latihan yang rapi'],
      ['studio', 'Sesi pagi yang berenergi'],
      ['plank', 'Fokus pada kontrol'],
      ['glow', 'Cahaya sore di studio'],
      ['park', 'Komunitas yang saling menyemangati'],
      ['seated', 'Momen jeda'],
      ['core', 'Menguatkan inti tubuh'],
    ],
  },
  {
    id: 'persada', type: 'Cabang', title: 'Kinara Persada', cover: 'mats',
    desc: 'Ruang tenang Kinara Persada untuk latihan yang konsisten.',
    photos: [
      ['mats', 'Matras dan perlengkapan'],
      ['seated', 'Mulai dengan napas'],
      ['stretch', 'Peregangan dalam'],
      ['studio', 'Latihan pagi'],
      ['prayer', 'Menenangkan pikiran'],
      ['beach', 'Gerak seimbang bersama'],
      ['downdog', 'Fleksibilitas dan kekuatan'],
      ['group', 'Kelas kecil yang akrab'],
    ],
  },
  {
    id: 'kelapa-gading', type: 'Cabang', title: 'Kinara Kelapa Gading', cover: 'sunset',
    desc: 'Studio Reformer di Kelapa Gading, Jakarta Utara.',
    photos: [
      ['sunset', 'Gerak hangat sore hari'],
      ['twist', 'Rotasi yang terkontrol'],
      ['crunch', 'Latihan core'],
      ['park', 'Napas bersama'],
      ['glow', 'Senja di studio'],
      ['plank', 'Stabilitas bahu dan core'],
      ['prayer', 'Penutup yang tenang'],
      ['mats', 'Siap bergerak'],
    ],
  },
  {
    id: 'cikarang-selatan', type: 'Cabang', title: 'Kinara Cikarang Selatan', cover: 'crunch',
    desc: 'R.FIT Pilates Reformer, powered by Kinara.',
    photos: [
      ['crunch', 'Core yang makin kuat'],
      ['core', 'Latihan dengan beban ringan'],
      ['studio', 'Sesi yang berenergi'],
      ['group', 'Kelas penuh semangat'],
      ['beach', 'Keseimbangan bersama'],
      ['plank', 'Plank tanpa menyerah'],
      ['stretch', 'Pendinginan'],
      ['sunset', 'Tarik napas panjang'],
    ],
  },
];

/* ---------- FAQ ---------- */
const FAQ = [
  ['Apakah Pilates cocok untuk pemula?', 'Sangat cocok. Setiap gerakan bisa disesuaikan dengan kemampuan. Beri tahu coach bahwa ini kali pertama Anda agar dipandu dari dasar.'],
  ['Apa bedanya Reformer dan Tower?', 'Reformer memakai mesin dengan carriage yang meluncur dan tahanan pegas, bagus untuk kekuatan dan kontrol. Tower memakai unit di dinding dengan pegas dan bar, bagus untuk mobilitas dan presisi. Tower tersedia di Kinara Galaxy.'],
  ['Pakaian apa yang sebaiknya dipakai?', 'Pakaian olahraga yang pas di badan dan nyaman untuk bergerak. Kaus kaki grip biasanya disarankan; konfirmasikan ke cabang yang Anda pilih.'],
  ['Bagaimana cara booking kelas?', 'Pilih cabang dan sesi yang cocok di halaman jadwal, lalu klik tombol WhatsApp. Tim Kinara akan membantu ketersediaan dan reservasi Anda.'],
  ['Apa arti “Coach Cover” di jadwal?', 'Cover berarti coach pengganti untuk sesi tersebut. Nama coach akan dikonfirmasi oleh tim cabang saat Anda reservasi.'],
  ['Berapa harga per sesi atau paket?', 'Harga dan paket dapat berubah. Tanyakan langsung ke tim Kinara melalui WhatsApp untuk info terbaru.'],
];

/* ---------- Testimoni ----------
   PENTING: isi di bawah adalah CONTOH TEKS (sample:true). Ganti dengan testimoni asli member
   (nama boleh disingkat atau anonim, dengan izin) sebelum situs dipublikasikan. */
const TESTIMONIALS = [
  { name: 'Member Kinara', branch: 'galaxy', cls: 'Reformer', text: 'Coach-nya sabar menjelaskan tiap gerakan. Sebagai pemula, saya tidak merasa canggung sama sekali.', sample: true },
  { name: 'Member Kinara', branch: 'galaxy', cls: 'Tower', text: 'Tower memberi sensasi latihan yang berbeda. Punggung terasa lebih ringan setelah beberapa pertemuan.', sample: true },
  { name: 'Member Kinara', branch: 'persada', cls: 'Reformer', text: 'Suasana studionya tenang dan bersih. Jadwal pagi dan sore memudahkan saya mengatur waktu.', sample: true },
  { name: 'Member Kinara', branch: 'persada', cls: 'Reformer', text: 'Kelasnya kecil jadi koreksi postur dari coach terasa personal dan jelas.', sample: true },
  { name: 'Member Kinara', branch: 'kelapa-gading', cls: 'Reformer', text: 'Setelah sesi, badan segar dan pikiran lebih ringan. Jadi jeda favorit di tengah minggu yang padat.', sample: true },
  { name: 'Member Kinara', branch: 'kelapa-gading', cls: 'Reformer', text: 'Booking lewat WhatsApp cepat dan tim cabang responsif. Prosesnya tidak ribet.', sample: true },
  { name: 'Member Kinara', branch: 'cikarang-selatan', cls: 'Reformer', text: 'Latihannya terarah dan berenergi. Core terasa lebih kuat dari minggu ke minggu.', sample: true },
  { name: 'Member Kinara', branch: 'cikarang-selatan', cls: 'Reformer', text: 'Coach selalu menyesuaikan gerakan dengan kondisi tubuh saya. Merasa aman dan didampingi.', sample: true },
];
