import { db as prisma } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting seed...');

  // ================================
  // ADMIN USER
  // ================================
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@smpn5cibeber.sch.id' },
    update: {},
    create: {
      email: 'admin@smpn5cibeber.sch.id',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // ================================
  // SETTINGS
  // ================================
  const settings = [
    // GENERAL
    { key: 'school_name', value: 'SMPN 5 Cibeber', label: 'Nama Sekolah', group: 'GENERAL' },
    { key: 'school_npsn', value: '20217851', label: 'NPSN', group: 'GENERAL' },
    { key: 'school_nss', value: '201026501005', label: 'NSS', group: 'GENERAL' },
    { key: 'school_email', value: 'smpn5cibeber@gmail.com', label: 'Email Sekolah', group: 'GENERAL' },
    { key: 'school_phone', value: '(0266) 6321234', label: 'Telepon', group: 'GENERAL' },
    { key: 'school_whatsapp', value: '6281234567890', label: 'WhatsApp (tanpa +)', group: 'GENERAL' },
    { key: 'school_address', value: 'Jl. Raya Cibeber No.5, Cibeber, Kec. Cibeber, Kabupaten Cianjur, Jawa Barat 43261', label: 'Alamat', group: 'GENERAL' },
    { key: 'school_accreditation', value: 'A', label: 'Akreditasi', group: 'GENERAL' },
    // HEADMASTER
    { key: 'headmaster_name', value: 'Drs. H. Ahmad Fauzi, M.Pd.', label: 'Nama Kepala Sekolah', group: 'HEADMASTER' },
    { key: 'headmaster_nip', value: '196801011994031001', label: 'NIP Kepala Sekolah', group: 'HEADMASTER' },
    { key: 'headmaster_welcome', value: 'Assalamualaikum Warahmatullahi Wabarakatuh.\n\nPuji syukur kehadirat Allah SWT atas segala rahmat dan hidayah-Nya sehingga SMPN 5 Cibeber terus berkembang menjadi lembaga pendidikan yang berkualitas dan berdaya saing.\n\nSelamat datang di website resmi SMPN 5 Cibeber. Melalui website ini, kami berharap dapat memberikan informasi yang lengkap dan akurat kepada seluruh pemangku kepentingan pendidikan, khususnya siswa, orang tua, dan masyarakat luas.\n\nKami berkomitmen untuk terus meningkatkan mutu pendidikan dengan menghadirkan pembelajaran yang inovatif, kreatif, dan berkarakter sesuai dengan visi misi sekolah.\n\nSalam hormat,\nKepala SMPN 5 Cibeber', label: 'Teks Sambutan', group: 'HEADMASTER' },
    { key: 'headmaster_image', value: '', label: 'Foto Kepala Sekolah', group: 'HEADMASTER' },
    // SCHOOL INFO
    { key: 'school_vision', value: 'Terwujudnya peserta didik yang beriman, bertaqwa, berilmu, berprestasi, berbudaya, dan berwawasan lingkungan.', label: 'Visi Sekolah', group: 'SCHOOL_INFO' },
    { key: 'school_mission', value: '1. Menumbuhkan penghayatan dan pengamalan ajaran agama serta nilai-nilai budaya bangsa.\n2. Melaksanakan pembelajaran dan bimbingan yang efektif dan menyenangkan.\n3. Menumbuhkan semangat berprestasi kepada seluruh warga sekolah.\n4. Menerapkan manajemen partisipatif dengan melibatkan seluruh warga sekolah.\n5. Melestarikan dan mengembangkan budaya daerah.\n6. Menciptakan lingkungan sekolah yang bersih, sehat, dan nyaman.', label: 'Misi Sekolah', group: 'SCHOOL_INFO' },
    { key: 'school_history', value: 'SMPN 5 Cibeber didirikan pada tahun 1985 sebagai salah satu sekolah menengah pertama negeri yang melayani masyarakat di Kecamatan Cibeber, Kabupaten Cianjur. Sejak berdirinya, sekolah ini telah berkomitmen untuk memberikan pendidikan berkualitas kepada generasi muda Cianjur.', label: 'Sejarah Sekolah', group: 'SCHOOL_INFO' },
    // MAPS
    { key: 'maps_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.6!2d107.0!3d-6.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnMDAuMCJTIDEwN8KwMDAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1234567890', label: 'URL Embed Google Maps', group: 'MAPS' },
    // PPDB INFO
    { key: 'ppdb_year', value: '2025/2026', label: 'Tahun Ajaran PPDB', group: 'PPDB' },
    { key: 'ppdb_quota', value: '240', label: 'Kuota Siswa Baru', group: 'PPDB' },
    { key: 'ppdb_open_date', value: '1 Juni 2025', label: 'Tanggal Buka Pendaftaran', group: 'PPDB' },
    { key: 'ppdb_close_date', value: '30 Juni 2025', label: 'Tanggal Tutup Pendaftaran', group: 'PPDB' },
    { key: 'ppdb_announcement_date', value: '5 Juli 2025', label: 'Tanggal Pengumuman', group: 'PPDB' },
    { key: 'ppdb_registration_date', value: '7-10 Juli 2025', label: 'Tanggal Daftar Ulang', group: 'PPDB' },
    { key: 'ppdb_info', value: 'PPDB SMPN 5 Cibeber Tahun Ajaran 2025/2026 dilaksanakan melalui jalur Zonasi, Afirmasi, Perpindahan Tugas, dan Prestasi. Untuk informasi lebih lanjut, hubungi pihak sekolah.', label: 'Info Tambahan PPDB', group: 'PPDB' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Settings seeded');

  // ================================
  // STAFF / KEPENGURUSAN
  // ================================
  const staffData = [
    { name: 'Drs. H. Ahmad Fauzi, M.Pd.', position: 'Kepala Sekolah', level: 1, order: 1, nip: '196801011994031001', education: 'S2 Manajemen Pendidikan' },
    { name: 'Hj. Siti Rahayu, S.Pd.', position: 'Wakil Kepala Sekolah Bidang Kurikulum', level: 2, order: 2, nip: '197002151995122001', education: 'S1 Pendidikan Bahasa Indonesia' },
    { name: 'Drs. Bambang Susilo', position: 'Wakil Kepala Sekolah Bidang Kesiswaan', level: 2, order: 3, nip: '196905201994031002', education: 'S1 Pendidikan Jasmani' },
    { name: 'Endang Supriatna, S.Pd.', position: 'Wakil Kepala Sekolah Bidang Sarana', level: 2, order: 4, nip: '197103101995031001', education: 'S1 Pendidikan Matematika' },
    { name: 'Yayah Nurhayati, S.Pd.', position: 'Wakil Kepala Sekolah Bidang Humas', level: 2, order: 5, nip: '197204251996022001', education: 'S1 Pendidikan IPS' },
    { name: 'Asep Kurniawan, S.Pd.', position: 'Guru Matematika', level: 3, order: 6, nip: '197801022003011001', education: 'S1 Pendidikan Matematika' },
    { name: 'Dewi Lestari, S.Pd.', position: 'Guru Bahasa Indonesia', level: 3, order: 7, nip: '197902142004012001', education: 'S1 Pendidikan Bahasa Indonesia' },
    { name: 'Rudi Hermawan, S.Pd.', position: 'Guru IPA', level: 3, order: 8, nip: '198003202004011001', education: 'S1 Pendidikan IPA' },
    { name: 'Nia Sari, S.Pd.', position: 'Guru IPS', level: 3, order: 9, nip: '198105052005012001', education: 'S1 Pendidikan IPS' },
    { name: 'Agus Pratama, S.Pd.', position: 'Guru Bahasa Inggris', level: 3, order: 10, nip: '197906152003011002', education: 'S1 Pendidikan Bahasa Inggris' },
    { name: 'Leni Marlina, S.Pd.', position: 'Guru Seni Budaya', level: 3, order: 11, nip: '198207302006012001', education: 'S1 Pendidikan Seni' },
    { name: 'Hendra Gunawan, S.Kom.', position: 'Guru TIK', level: 3, order: 12, nip: '198409152007011001', education: 'S1 Teknik Informatika' },
  ];

  for (const s of staffData) {
    const existing = await prisma.staff.findFirst({ where: { nip: s.nip } });
    if (!existing) {
      await prisma.staff.create({ data: s });
    }
  }
  console.log('✅ Staff seeded');

  // ================================
  // ARTICLES
  // ================================
  const articles = [
    {
      title: 'SMPN 5 Cibeber Raih Juara 1 Lomba Matematika Tingkat Kabupaten',
      slug: 'smpn5-raih-juara-1-lomba-matematika',
      excerpt: 'Siswa SMPN 5 Cibeber berhasil meraih juara pertama dalam Olimpiade Matematika tingkat Kabupaten Cianjur tahun 2025.',
      content: '<p>Sebuah prestasi membanggakan berhasil ditorehkan oleh siswa SMPN 5 Cibeber dalam ajang Olimpiade Matematika tingkat Kabupaten Cianjur yang diselenggarakan pada 15 Maret 2025.</p><p>Muhammad Rizki Fauzan, siswa kelas IX, berhasil menyisihkan ratusan peserta dari berbagai sekolah se-Kabupaten Cianjur dan keluar sebagai juara pertama. Prestasi ini merupakan buah dari kerja keras siswa yang bersangkutan serta bimbingan intensif dari guru matematika SMPN 5 Cibeber.</p><p>Kepala sekolah, Drs. H. Ahmad Fauzi, M.Pd., menyatakan kebanggaannya atas pencapaian ini. "Ini adalah bukti bahwa siswa SMPN 5 Cibeber memiliki kemampuan akademis yang tidak kalah dengan sekolah lain," ujarnya.</p>',
      published: true,
      publishedAt: new Date('2025-03-16'),
    },
    {
      title: 'Program Adiwiyata: SMPN 5 Cibeber Berhasil Pertahankan Predikat Sekolah Hijau',
      slug: 'smpn5-pertahankan-predikat-adiwiyata',
      excerpt: 'Melalui berbagai program lingkungan hidup yang konsisten, SMPN 5 Cibeber kembali berhasil mempertahankan predikat Sekolah Adiwiyata.',
      content: '<p>SMPN 5 Cibeber kembali menorehkan prestasi di bidang lingkungan hidup. Sekolah kami berhasil mempertahankan predikat Sekolah Adiwiyata dari Dinas Lingkungan Hidup Kabupaten Cianjur.</p><p>Program-program unggulan seperti bank sampah, kebun sekolah, dan hemat energi menjadi faktor utama keberhasilan ini. Seluruh warga sekolah, mulai dari siswa, guru, hingga tenaga kependidikan, terlibat aktif dalam menjaga kelestarian lingkungan sekolah.</p>',
      published: true,
      publishedAt: new Date('2025-02-20'),
    },
    {
      title: 'Kegiatan MPLS Tahun Ajaran 2025/2026 Berjalan Lancar dan Meriah',
      slug: 'kegiatan-mpls-2025-2026',
      excerpt: 'Masa Pengenalan Lingkungan Sekolah (MPLS) tahun ajaran baru berlangsung dengan penuh semangat dan kegembiraan.',
      content: '<p>Kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) SMPN 5 Cibeber Tahun Ajaran 2025/2026 telah resmi dimulai pada Senin, 14 Juli 2025. Sebanyak 240 siswa baru menerima berbagai materi pengenalan sekolah dengan antusias.</p><p>Berbagai kegiatan positif diselenggarakan selama MPLS, mulai dari pengenalan visi misi sekolah, pengenalan ekstrakurikuler, penyuluhan karakter, hingga kegiatan outbound yang menyenangkan.</p>',
      published: true,
      publishedAt: new Date('2025-07-14'),
    },
    {
      title: 'Workshop Peningkatan Kompetensi Guru dalam Implementasi Kurikulum Merdeka',
      slug: 'workshop-peningkatan-kompetensi-guru-kurikulum-merdeka',
      excerpt: 'SMPN 5 Cibeber menyelenggarakan workshop peningkatan kompetensi guru dalam rangka implementasi Kurikulum Merdeka yang lebih baik.',
      content: '<p>Dalam rangka meningkatkan kualitas pembelajaran, SMPN 5 Cibeber menyelenggarakan Workshop Peningkatan Kompetensi Guru dalam Implementasi Kurikulum Merdeka pada 25-26 April 2025.</p><p>Workshop yang diikuti oleh seluruh guru SMPN 5 Cibeber ini menghadirkan narasumber dari Dinas Pendidikan Kabupaten Cianjur dan praktisi pendidikan yang berpengalaman.</p>',
      published: true,
      publishedAt: new Date('2025-04-27'),
    },
    {
      title: 'Tim Paskibra SMPN 5 Cibeber Tampil Memukau di Upacara HUT RI ke-80',
      slug: 'paskibra-smpn5-hut-ri-ke-80',
      excerpt: 'Tim Pasukan Pengibar Bendera (Paskibra) SMPN 5 Cibeber tampil dengan gagah dan memukau dalam upacara peringatan HUT RI ke-80 tingkat kecamatan.',
      content: '<p>Tim Paskibra SMPN 5 Cibeber tampil memukau dalam Upacara Peringatan Hari Ulang Tahun Republik Indonesia ke-80 tingkat Kecamatan Cibeber yang berlangsung pada 17 Agustus 2025.</p><p>Penampilan yang rapi, kompak, dan penuh semangat dari anggota Paskibra SMPN 5 Cibeber mendapat apresiasi dari seluruh hadirin yang menyaksikan.</p>',
      published: true,
      publishedAt: new Date('2025-08-17'),
    },
  ];

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }
  console.log('✅ Articles seeded');

  // ================================
  // GALLERIES
  // ================================
  const galleries = [
    { title: 'Upacara Bendera Hari Senin', category: 'KEGIATAN', imageUrl: '/uploads/seed/gallery-upacara.jpg', order: 1 },
    { title: 'Laboratorium IPA', category: 'FASILITAS', imageUrl: '/uploads/seed/gallery-lab-ipa.jpg', order: 2 },
    { title: 'Perpustakaan Sekolah', category: 'FASILITAS', imageUrl: '/uploads/seed/gallery-perpustakaan.jpg', order: 3 },
    { title: 'Juara Olimpiade Matematika', category: 'PRESTASI', imageUrl: '/uploads/seed/gallery-prestasi-mtk.jpg', order: 4 },
    { title: 'Kegiatan Pramuka', category: 'KEGIATAN', imageUrl: '/uploads/seed/gallery-pramuka.jpg', order: 5 },
    { title: 'Lapangan Olahraga', category: 'FASILITAS', imageUrl: '/uploads/seed/gallery-lapangan.jpg', order: 6 },
    { title: 'Juara LCC PKn Kabupaten', category: 'PRESTASI', imageUrl: '/uploads/seed/gallery-prestasi-pkn.jpg', order: 7 },
    { title: 'Kegiatan Seni Budaya', category: 'KEGIATAN', imageUrl: '/uploads/seed/gallery-seni.jpg', order: 8 },
  ];

  for (const g of galleries) {
    const existing = await prisma.gallery.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.gallery.create({ data: { ...g, description: '' } });
    }
  }
  console.log('✅ Galleries seeded');

  // ================================
  // FACILITIES
  // ================================
  const facilities = [
    { name: 'Laboratorium IPA', description: 'Laboratorium IPA modern dilengkapi peralatan sains terkini untuk mendukung pembelajaran praktikum siswa.', category: 'AKADEMIK', order: 1 },
    { name: 'Perpustakaan', description: 'Perpustakaan dengan koleksi lebih dari 5.000 judul buku, dilengkapi ruang baca yang nyaman dan fasilitas digital.', category: 'AKADEMIK', order: 2 },
    { name: 'Laboratorium Komputer', description: 'Laboratorium komputer dengan 40 unit PC terbaru terkoneksi internet untuk mendukung pembelajaran TIK dan digitalisasi.', category: 'AKADEMIK', order: 3 },
    { name: 'Lapangan Olahraga', description: 'Lapangan olahraga multifungsi yang dapat digunakan untuk sepak bola, voli, basket, dan kegiatan upacara.', category: 'OLAHRAGA', order: 4 },
    { name: 'Ruang Seni', description: 'Ruang seni dan budaya untuk mendukung pengembangan kreativitas dan bakat siswa di bidang seni.', category: 'SENI', order: 5 },
    { name: 'Masjid Sekolah', description: 'Masjid yang representatif untuk kegiatan ibadah dan pembinaan karakter keagamaan seluruh warga sekolah.', category: 'IBADAH', order: 6 },
    { name: 'Kantin Sehat', description: 'Kantin sekolah yang menyediakan makanan sehat dan bergizi dengan harga terjangkau.', category: 'PENDUKUNG', order: 7 },
    { name: 'Ruang Konseling', description: 'Ruang bimbingan dan konseling untuk mendukung perkembangan psikologis dan karier siswa.', category: 'PENDUKUNG', order: 8 },
    { name: 'Aula Sekolah', description: 'Aula serbaguna berkapasitas 300 orang untuk kegiatan rapat, seminar, pentas seni, dan kegiatan besar lainnya.', category: 'PENDUKUNG', order: 9 },
    { name: 'Ruang UKS', description: 'Unit Kesehatan Sekolah dengan fasilitas lengkap untuk memberikan layanan kesehatan dasar kepada siswa.', category: 'KESEHATAN', order: 10 },
  ];

  for (const f of facilities) {
    const existing = await prisma.facility.findFirst({ where: { name: f.name } });
    if (!existing) {
      await prisma.facility.create({ data: f });
    }
  }
  console.log('✅ Facilities seeded');

  // ================================
  // ACHIEVEMENTS
  // ================================
  const achievements = [
    { title: 'Juara 1 Olimpiade Matematika', description: 'Juara 1 Olimpiade Matematika tingkat Kabupaten Cianjur', level: 'KOTA', year: 2025, order: 1 },
    { title: 'Juara 2 LCC PKn', description: 'Juara 2 Lomba Cerdas Cermat PKn tingkat Kabupaten Cianjur', level: 'KOTA', year: 2024, order: 2 },
    { title: 'Sekolah Adiwiyata', description: 'Penghargaan Sekolah Adiwiyata dari Dinas Lingkungan Hidup Kabupaten Cianjur', level: 'KOTA', year: 2024, order: 3 },
    { title: 'Juara 3 Lomba Karya Ilmiah', description: 'Juara 3 Lomba Karya Ilmiah Remaja tingkat Provinsi Jawa Barat', level: 'PROVINSI', year: 2024, order: 4 },
    { title: 'Juara 1 Pramuka Tingkat Kecamatan', description: 'Juara 1 Jambore Pramuka tingkat Kecamatan Cibeber', level: 'KECAMATAN', year: 2025, order: 5 },
    { title: 'Juara 2 Voli Putra', description: 'Juara 2 Turnamen Voli Putra POPDA Kabupaten Cianjur', level: 'KOTA', year: 2025, order: 6 },
  ];

  for (const a of achievements) {
    const existing = await prisma.achievement.findFirst({ where: { title: a.title, year: a.year } });
    if (!existing) {
      await prisma.achievement.create({ data: a });
    }
  }
  console.log('✅ Achievements seeded');

  // ================================
  // PPDB STEPS
  // ================================
  const ppdbSteps = [
    { title: 'Pendaftaran Akun', description: 'Calon peserta didik atau orang tua mendaftar akun di portal PPDB online Kabupaten Cianjur menggunakan Nomor Induk Kependudukan (NIK).', icon: 'user-plus', stepOrder: 1 },
    { title: 'Pengisian Formulir', description: 'Isi formulir pendaftaran secara lengkap dan benar, termasuk data diri, nilai rapor, dan pilihan sekolah tujuan.', icon: 'file-text', stepOrder: 2 },
    { title: 'Unggah Berkas', description: 'Unggah dokumen persyaratan: fotokopi akta kelahiran, KK, rapor semester 1-5, dan sertifikat prestasi jika ada.', icon: 'upload-simple', stepOrder: 3 },
    { title: 'Verifikasi Berkas', description: 'Panitia PPDB melakukan verifikasi berkas dan dokumen yang diunggah. Peserta akan mendapat notifikasi status verifikasi.', icon: 'check-circle', stepOrder: 4 },
    { title: 'Pengumuman Seleksi', description: 'Hasil seleksi diumumkan secara online di portal PPDB. Peserta dapat melihat status penerimaan menggunakan akun yang telah didaftarkan.', icon: 'megaphone', stepOrder: 5 },
    { title: 'Daftar Ulang', description: 'Peserta yang dinyatakan diterima wajib melakukan daftar ulang di sekolah dengan membawa dokumen asli sesuai jadwal yang ditentukan.', icon: 'check-square', stepOrder: 6 },
  ];

  for (const p of ppdbSteps) {
    const existing = await prisma.ppdbStep.findFirst({ where: { stepOrder: p.stepOrder } });
    if (!existing) {
      await prisma.ppdbStep.create({ data: p });
    }
  }
  console.log('✅ PPDB steps seeded');

  console.log('\n🎉 Seed completed successfully!');
  console.log('📧 Admin login: admin@smpn5cibeber.sch.id');
  console.log('🔑 Password: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
