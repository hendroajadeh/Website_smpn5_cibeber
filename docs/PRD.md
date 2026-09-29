# Product Requirement Document (PRD): Website Profil Resmi & CMS SMPN 5 Cibeber
*Product Requirements Document (Modern PRD Framework for AI Prototyping)*
*Arketipe Produk: Institusi / Profil Sekolah / Edukasi / Perusahaan | Target Audiens: Calon siswa, orang tua murid, guru, alumni, dan masyarakat umum pemerhati pendidikan SMPN 5 Cibeber*

---

## 1. OPPORTUNITY FRAMING
- **Core Problem:** Kebutuhan operasional untuk Super Admin Tunggal: Sistem saat ini membutuhkan otomatisasi alur digital untuk website profil SMPN 5 Cibeber dengan CMS, mencegah inefisiensi dan kendala operasional dalam pengelolaan informasi sekolah.
- **Working Hypothesis:** Dengan mengimplementasikan mekanisme alur Infografis Step-by-Step Statis dan panel CMS terpusat, pengelolaan informasi berita, galeri, fasilitas, dan PPDB berjalan cepat, akurat, dan minim friksi bagi admin maupun pengunjung.
- **Strategy Fit:** Keunggulan arsitektur dan integrasi kunci: Mengandalkan Next.js 16 App Router, SQLite, Tailwind CSS dengan mode gelap-terang, serta Google Maps Embed Alamat untuk menjamin keandalan dan daya saing operasional institusi pendidikan.

---

## 2. BOUNDARIES & SCOPE
### Deep Feature Architecture (MVP Breakdown)
#### Fitur #1: [P0] Responsive Navbar & Theme Toggle
- **User Story:** Sebagai pengunjung, saya ingin menavigasi menu website dengan mudah di berbagai perangkat dan mengubah mode tampilan gelap/terang agar nyaman dibaca.
- **Alur Kerja (Happy Path):**
  1. Pengunjung membuka halaman web.
  2. Navbar merender logo SMPN 5 Cibeber, tautan menu, dan tombol theme toggle.
  3. Pengunjung mengklik tombol theme toggle.
  4. Aplikasi mengubah state kelas dark pada root HTML dan menyimpan preferensi ke localStorage.
  5. Antarmuka bertransisi mulus ke mode pilihan.
- **Aturan Bisnis & Validasi:**
  - Default mode mengikuti preferensi sistem operasi (prefers-color-scheme).
  - Navbar wajib sticky di bagian atas saat halaman di-scroll.
  - Menu otomatis berubah menjadi hamburger menu pada breakpoint mobile (< 768px).
- **Edge Cases & Solusi Gagal:**
  - LocalStorage dinonaktifkan browser: Fallback ke default light mode tanpa error.
  - Layar sangat kecil: Hamburger drawer terbuka penuh tanpa clipping konten.
- **Komponen Teknis Terkait:**
  - Frontend: components/Navbar.tsx, components/ThemeToggle.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat komponen Navbar.tsx di Next.js 16 dengan Tailwind CSS yang mendukung responsive mobile drawer, navigasi link ke Berita, Profil, Fasilitas, PPDB, Kontak, serta tombol switch dark/light mode menggunakan next-themes.
```

#### Fitur #2: [P0] Manajemen & Tampilan Berita Terkini
- **User Story:** Sebagai Super Admin, saya ingin mempublikasikan dan mengedit berita kegiatan sekolah agar informasi tersampaikan kepada publik secara aktual.
- **Alur Kerja (Happy Path):**
  1. Admin login ke panel CMS dan mengakses menu Berita.
  2. Admin mengklik Tambah Berita dan mengisi form judul, ringkasan, isi konten, dan gambar utama.
  3. Admin menekan tombol Simpan.
  4. Server Action memvalidasi data dengan Zod dan menyimpan ke tabel SQLite.
  5. Halaman publik Berita Terkini langsung menampilkan berita terbaru.
- **Aturan Bisnis & Validasi:**
  - Judul berita wajib diisi dengan minimal 5 karakter.
  - Gambar utama harus berformat JPG/PNG dengan ukuran maksimal 2MB.
  - Hanya Super Admin terautentikasi yang dapat melakukan operasi CRUD.
- **Edge Cases & Solusi Gagal:**
  - Ukuran gambar melebihi batas: Tampilkan pesan error validasi di form CMS.
  - Koneksi database terputus saat menyimpan: Tangkap error dan kembalikan state gagal dengan pesan ramah pengguna.
- **Komponen Teknis Terkait:**
  - Frontend: app/admin/news/page.tsx, components/NewsForm.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat halaman CMS Berita di app/admin/news/page.tsx dan Server Actions terkait untuk operasi CRUD artikel berita menggunakan SQLite dan validasi Zod.
```

#### Fitur #3: [P0] Sambutan Kepala Sekolah & Kepengurusan
- **User Story:** Sebagai pengunjung, saya ingin membaca sambutan kepala sekolah dan melihat struktur kepengurusan untuk mengenal pimpinan institusi. Sebagai Super Admin, saya ingin dapat mengelola teks sambutan kepala sekolah dan struktur pohon kepengurusan (menambah, mengedit, menghapus staf) agar informasi selalu akurat dan terkini.
- **Alur Kerja (Happy Path):**
  1. Pengunjung membuka halaman beranda atau profil.
  2. Sistem mengambil data sambutan kepala sekolah dan struktur organisasi dari database.
  3. Komponen merender foto kepala sekolah, teks sambutan resmi, serta pohon kepengurusan interaktif.
  4. Pengunjung dapat melihat hierarki staf pengajar sekolah.
  5. Admin login ke panel CMS dan mengakses menu Profil Sekolah.
  6. Admin mengedit teks sambutan kepala sekolah atau mengelola daftar staf kepengurusan (menambah/mengedit/menghapus detail staf).
  7. Admin menekan tombol 'Simpan'.
  8. Server Action memvalidasi data dengan Zod dan menyimpan ke tabel SQLite (misal: `settings` untuk sambutan, `staff` untuk kepengurusan).
  9. Halaman publik Profil menampilkan perubahan terbaru.
- **Aturan Bisnis & Validasi:**
  - Data sambutan kepala sekolah bersifat tunggal dan dapat diperbarui melalui CMS.
  - Pohon kepengurusan mendukung hierarki hingga 3 level (Kepala Sekolah, Wakil/Staf, Guru) dan dapat dikelola sepenuhnya oleh Super Admin melalui panel CMS.
  - Hanya Super Admin terautentikasi yang dapat melakukan operasi CRUD pada sambutan kepala sekolah dan data kepengurusan.
- **Edge Cases & Solusi Gagal:**
  - Data belum diinput di database: Tampilkan placeholder teks informatif default.
  - Gambar profil gagal dimuat: Tampilkan inisial avatar sebagai fallback.
- **Komponen Teknis Terkait:**
  - Frontend: components/HeadmasterWelcome.tsx, components/OrganizationalChart.tsx, app/admin/profile/page.tsx, components/HeadmasterWelcomeForm.tsx, components/OrganizationalChartForm.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat komponen HeadmasterWelcome.tsx dan OrganizationalChart.tsx yang mengambil data dari SQLite dan menampilkannya dengan layout grid dan hierarki pohon yang bersih. Tambahkan halaman CMS di app/admin/profile/page.tsx untuk mengelola teks sambutan kepala sekolah dan item-item pohon kepengurusan (staf), terintegrasi dengan SQLite dan Zod validation.
```

#### Fitur #4: [P0] Fasilitas Sekolah & Galeri Prestasi Siswa
- **User Story:** Sebagai calon siswa atau orang tua, saya ingin melihat fasilitas sekolah dan galeri prestasi siswa untuk menilai kualitas lingkungan belajar. Sebagai Super Admin, saya ingin dapat menambah, mengedit, dan menghapus item prestasi siswa dan fasilitas sekolah agar informasi selalu relevan dan terkini.
- **Alur Kerja (Happy Path):**
  1. Pengunjung memilih menu Galeri / Fasilitas.
  2. Sistem menampilkan grid foto fasilitas (laboratorium, perpustakaan, lapangan) dan galeri prestasi siswa.
  3. Pengunjung dapat mengklik salah satu item untuk melihat modal foto ukuran penuh dengan keterangan.
  4. Admin login ke panel CMS dan mengakses menu Galeri/Fasilitas.
  5. Admin mengklik 'Tambah Item Baru' atau 'Edit' pada item yang sudah ada.
  6. Admin mengisi form (judul, deskripsi, kategori, gambar) dan menekan 'Simpan'.
  7. Server Action memvalidasi data dengan Zod dan menyimpan ke tabel SQLite (misal: `galleries` dan `facilities`).
  8. Halaman publik Galeri/Fasilitas langsung menampilkan perubahan.
- **Aturan Bisnis & Validasi:**
  - Setiap item galeri wajib memiliki judul, kategori (Fasilitas atau Prestasi), dan gambar.
  - Gambar dioptimalkan menggunakan Next.js Image component dengan lazy loading.
  - Hanya Super Admin terautentikasi yang dapat melakukan operasi CRUD pada item galeri dan fasilitas.
- **Edge Cases & Solusi Gagal:**
  - Galeri kosong: Tampilkan komponen state kosong (empty state) yang rapi.
  - Gagal memuat gambar galeri: Tampilkan gambar placeholder broken link penanganan.
- **Komponen Teknis Terkait:**
  - Frontend: app/gallery/page.tsx, components/GalleryLightbox.tsx, app/admin/gallery/page.tsx, components/GalleryForm.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat halaman galeri interaktif di app/gallery/page.tsx dengan filter kategori dan modal lightbox menggunakan Tailwind CSS. Tambahkan juga halaman CMS di app/admin/gallery/page.tsx dengan form CRUD untuk mengelola item galeri prestasi dan fasilitas, terintegrasi dengan SQLite dan Zod validation.
```

#### Fitur #5: [P0] Infografis Step-by-Step Alur PPDB
- **User Story:** As calon siswa, saya ingin melihat infografis alur Pendaftaran Peserta Didik Baru (PPDB) secara step-by-step agar paham tahapan pendaftaran.
- **Alur Kerja (Happy Path):**
  1. Pengunjung mengklik menu PPDB.
  2. Sistem merender infografis step-by-step statis berurutan (Langkah 1: Pendaftaran Akun, Langkah 2: Unggah Berkas, Langkah 3: Verifikasi, Langkah 4: Pengumuman).
  3. Admin dapat mengubah urutan atau teks langkah melalui CMS.
- **Aturan Bisnis & Validasi:**
  - Alur PPDB ditampilkan secara kronologis dari nomor urut terkecil ke terbesar.
  - Setiap langkah memiliki ikon representatif dan deskripsi singkat.
- **Edge Cases & Solusi Gagal:**
  - Urutan langkah tidak berurutan di database: Urutkan secara asc berdasarkan field step_order di query backend.
- **Komponen Teknis Terkait:**
  - Frontend: components/InfographicPPDB.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat komponen InfographicPPDB.tsx yang merender tahapan step-by-step statis dengan desain visual card bernomor dan panah alur, mengambil data dari SQLite.
```

#### Fitur #6: [P1] Alamat, Kontak & Google Maps Embed
- **User Story:** Sebagai pengunjung, saya ingin melihat alamat lengkap, nomor kontak, dan peta lokasi sekolah agar dapat berkunjung dengan mudah.
- **Alur Kerja (Happy Path):**
  1. Pengunjung membuka halaman Kontak.
  2. Sistem merender alamat lengkap sekolah, nomor telepon, email resmi, dan iframe Google Maps Embed.
  3. Pengunjung dapat melihat titik lokasi sekolah secara interaktif.
- **Aturan Bisnis & Validasi:**
  - URL Google Maps Embed diambil dari pengaturan dinamis CMS sekolah.
  - Nomor kontak dilengkapi tombol tautan langsung ke WhatsApp.
- **Edge Cases & Solusi Gagal:**
  - URL Google Maps tidak valid: Tampilkan fallback teks alamat lengkap tanpa merusak layout halaman.
- **Komponen Teknis Terkait:**
  - Frontend: app/contact/page.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat halaman Kontak di app/contact/page.tsx yang memuat informasi alamat, tombol WhatsApp direct link, dan responsive Google Maps iframe embed.
```

#### Fitur #7: [P0] Dedicated Admin Login Page
- **User Story:** Sebagai Super Admin, saya ingin login ke panel CMS melalui halaman terpisah agar akses manajemen konten lebih aman dan terisolasi dari website publik.
- **Alur Kerja (Happy Path):**
  1. Admin mengakses URL `/admin/login`.
  2. Admin memasukkan email dan password.
  3. Sistem memvalidasi kredensial dengan database SQLite.
  4. Jika berhasil, admin diarahkan ke Dashboard CMS.
- **Aturan Bisnis & Validasi:**
  - Hanya Super Admin yang terdaftar di database SQLite yang dapat login.
  - Implementasi proteksi rute untuk semua halaman `/admin/*`.
  - Menggunakan JWT (JSON Web Token) untuk sesi autentikasi.
- **Edge Cases & Solusi Gagal:**
  - Kredensial salah: Tampilkan pesan error yang jelas.
  - Sesi kadaluarsa: Redirect otomatis ke halaman login.
- **Komponen Teknis Terkait:**
  - Frontend: app/admin/login/page.tsx, components/AuthForm.tsx
  - API Endpoints: -
  - Tabel Database: -
- **Prompt Coding Agent (Cursor / Claude Code):**
```text
Buat halaman login admin di app/admin/login/page.tsx dengan form email/password, integrasi autentikasi berbasis SQLite (misalnya dengan NextAuth.js atau implementasi kustom), dan proteksi rute untuk seluruh panel admin.
```

### Non-Goals (Explicitly Out of Scope)
- Sistem pembayaran SPP online terintegrasi gateway pembayaran kompleks
- Aplikasi mobile native terpisah (fokus pada web responsive PWA-ready)
- Multi-tenant SaaS untuk sekolah lain (dikhususkan eksklusif untuk SMPN 5 Cibeber)
- Fitur live chat real-time dengan AI chatbot (cukup WhatsApp redirect)

---

## 3. SUCCESS MEASUREMENT
- **Offline Golden Set (Validation):** Semua alur utama (happy path) dari kunjungan publik hingga manajemen CMS lolos validasi fungsional dan pengujian end-to-end tanpa blocking bug.
- **Human Review (Qualitative Audit):** Uji kepuasan operasional Super Admin dalam mengunggah berita dan mengubah konten dalam waktu kurang dari 3 menit per entri.
- **Online Metrics (KPIs & Thresholds):** Tingkat keberhasilan akses halaman > 95%, adopsi modul informasi sekolah > 75%, latensi respons API < 1.0 detik.

---

## 4. ROLLOUT PLAN
- **Exposure:** 100% rilis publik web responsive SMPN 5 Cibeber.
- **Duration:** Fase evaluasi 14 hari pasca peluncuran awal.
- **Segments & Ramp Gates:** Pastikan performa loading < 2 detik, skor Lighthouse SEO > 90, dan tidak ada error fatal di log server Docker.

---

## 5. RISK MANAGEMENT
- **Detection Mechanism:** Log anomali server terpusat, validasi integritas skema database SQLite, dan pemantauan status API realtime.
- **Fallback & Kill Switch:** Kebijakan mitigasi risiko: Client Browser LocalStorage cache fallback. Sediakan saklar darurat (kill-switch) dan mode baca-saja jika terjadi gangguan koneksi database eksternal.

---

## 6. OWNERSHIP & ACTION
- **Primary Owner (PIC):** Lead Product Architect / PIC Operasional Sekolah (Super Admin Tunggal)
- **Decision Points & Cadence:** Evaluasi metrik operasional bulanan untuk menentukan peningkatan fitur tambahan pada fase berikutnya.

---

## 7. AI-SPECIFIC ADDITIONS
### Behavior Contract
#### [GOOD] Wajib Dilakukan:
- [GOOD] Menggunakan Server Components default Next.js 16 untuk performa optimal dan SEO
- [GOOD] Validasi input form CMS menggunakan Zod secara ketat di Server Actions
- [GOOD] Penerapan Tailwind CSS dengan variabel warna yang mendukung toggle dark/light mode sempurna

#### [REJECT] Dilarang Keras:
- [REJECT] Menggunakan 'use client' pada seluruh komponen tanpa alasan arsitektural yang jelas
- [REJECT] Menyimpan kredensial database atau secret key di dalam client bundle
- [REJECT] Mengabaikan penanganan error pada operasi database query

### Guardrails
- Validasi input ketat dengan Zod pada setiap mutasi data CMS
- Sanitasi konten HTML rich text untuk mencegah kerentanan XSS
- Penerapan kontrol akses berbasis aplikasi untuk proteksi tabel admin

---

## 8. ACTIONABLE TASK BREAKDOWN (FOR AI CODING AGENTS)
- [ ] Step 1: [FASE 1 - FRONTEND & APP SHELL LAYOUT]: Bangun kerangka Layout App Shell dengan Responsive Navbar, Footer, dan Theme Toggle (app/layout.tsx & components/Navbar.tsx).
- [ ] Step 2: [FASE 1 - FRONTEND & APP SHELL LAYOUT]: Bangun Landing Page publik responsif (Hero Sambutan Kepala Sekolah, Quick Info, Fasilitas Grid) di app/page.tsx.
- [ ] Step 3: [FASE 1 - FRONTEND & APP SHELL LAYOUT]: Bangun kerangka Admin Panel Layout dengan Sidebar CMS dan Role Guard autentikasi di app/admin/layout.tsx.
- [ ] Step 4: [FASE 1 - FRONTEND & APP SHELL LAYOUT]: Bangun komponen UI untuk Halaman Berita, Galeri, Pohon Kepengurusan, dan Infografis Alur PPDB.
- [ ] Step 5: [FASE 1 - FRONTEND & APP SHELL LAYOUT]: Bangun halaman Dedicated Admin Login (app/admin/login/page.tsx) dengan form autentikasi.
- [ ] Step 6: [FASE 2 - BACKEND & DB]: Inisialisasi skema database SQLite (tabel articles, galleries, facilities, staff, ppdb_steps, settings).
- [ ] Step 7: [FASE 2 - BACKEND & DB]: Implementasi Zod schema validation untuk payload artikel, galeri, staf kepengurusan, dan pengaturan sekolah.
- [ ] Step 8: [FASE 2 - BACKEND & DB]: Buat Next.js Server Actions untuk operasi CRUD data CMS (createArticle, updateGallery, updateStaff, dsb).
- [ ] Step 9: [FASE 2 - BACKEND & DB]: Buat API Route Handler untuk public data fetching dengan caching revalidation.
- [ ] Step 10: [FASE 2 - BACKEND & DB]: Konfigurasi autentikasi email/password berbasis SQLite (misalnya dengan NextAuth.js atau implementasi kustom) dan implementasi proteksi rute admin.
- [ ] Step 11: [FASE 3 - INTEGRASI]: Hubungkan komponen frontend CMS Admin dengan Server Actions dan feedback toast state untuk manajemen berita, galeri, fasilitas, sambutan, dan kepengurusan.
- [ ] Step 12: [FASE 3 - INTEGRASI]: Integrasikan Google Maps Embed pada halaman Kontak dan Alamat Sekolah.
- [ ] Step 13: [FASE 3 - INTEGRASI]: Integrasikan fungsionalitas Dark/Light mode menggunakan Tailwind class toggling dan localStorage persistence.
- [ ] Step 14: [FASE 4 - DEPLOY & TEST]: Konfigurasi Dockerfile multi-stage build untuk Next.js production container.
- [ ] Step 15: [FASE 4 - DEPLOY & TEST]: Setup docker-compose.yml untuk manajemen environment dan reverse proxy.
- [ ] Step 16: [FASE 4 - DEPLOY & TEST]: Jalankan pengujian End-to-End, verifikasi performa, dan deploy ke server produksi VPS.
