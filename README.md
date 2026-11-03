# digmar-tools

**digmar-tools** adalah platform CRM & Pipeline Deal Tracker berbasis web yang dirancang khusus untuk memetakan target promosi, memantau pergerakan prospek (*pipeline states*), serta menganalisis konversi penjualan di wilayah **D.I. Yogyakarta (5 wilayah)** dan **Solo Raya (7 wilayah)**.

Aplikasi ini berfokus pada segmentasi produk **Pelatihan Profesional** dan **Mentoring Anak**, dilengkapi visualisasi spasial interaktif serta manajemen multi-user berbasis peran (*Role-Based Access Control*).

---

## 🚀 Fitur yang Telah Diselesaikan

### 1. Autentikasi & Keamanan Sesi
- **Sistem Login & Logout**: Autentikasi terenkripsi berbasis JSON Web Token (JWT) yang disimpan dalam *HTTP-only cookie* aman untuk menangkal celah XSS.
- **Validasi Sesi Otomatis**: Proteksi rute navigasi dashboard dengan pengalihan otomatis (*auto-redirect*) ke halaman login jika sesi kadaluarsa atau tidak valid.
- **Manajemen Akun Terpadu (CRUD User)**:
  - Pembatasan hak akses multi-role: **ADMIN** dan **MARKETING**.
  - Administrator dapat menambah staf baru, memperbarui data akun/password, serta menghapus staf marketing.
  - Akun aktif diproteksi agar tidak dapat menghapus dirinya sendiri saat sedang login demi konsistensi data.

### 2. Papan Pipeline Kanban Interaktif
- **Drag-and-Drop State Deals**: Pemindahan status prospek secara responsif dan *real-time* melintasi 5 tahapan penjualan:
  1. `Lead In` (Prospek Baru Masuk)
  2. `Contacted` (Proses Komunikasi Berjalan)
  3. `Proposal` (Pengiriman Penawaran & Silabus)
  4. `Closed Won` (Berhasil Closing / Penjualan Sukses)
  5. `Closed Lost` (Batal / Tidak Terkonversi)
- **Step-Color Header Theme**: Indikator warna bertahap (*step-progression color*) pada titik peluru (*bullet*) dan *badge counter* masing-masing kolom (Biru $\rightarrow$ Ungu $\rightarrow$ Amber $\rightarrow$ Hijau Emerald $\rightarrow$ Merah Rose), di mana kolom *Closed Won* serasi dengan indikator realisasi closing di dashboard utama.
- **Kartu Deal yang Rapi & Informatif**:
  - Tampilan ringkas berisi nama klien, instansi/perusahaan, kebutuhan/topik spesifik (`topic`), nominal deal, serta wilayah target.
  - Label segmentasi produk (`Pelatihan Pro` vs `Mentoring Anak`) dan klasifikasi prospek (`B2C SMK`, `B2C Siswa/Ortu`, `B2B Korporasi/Kampus`).
  - **Badge PIC Marketing**: Pencantuman identitas staf penginput data pada footer kartu secara otomatis.
  - Akses cepat tombol edit deal, hapus deal, dan log riwayat catatan.

### 3. Pemetaan Spasial Wilayah (Leaflet GIS)
- **Distribusi Titik Target Berbasis Peta**: Visualisasi geografis interaktif persebaran prospek menggunakan Leaflet.
- **Cakupan 12 Wilayah Presisi**:
  - **D.I. Yogyakarta**: Kota Yogyakarta, Kab. Sleman, Kab. Bantul, Kab. Kulon Progo, Kab. Gunungkidul.
  - **Solo Raya**: Kota Surakarta, Kab. Sukoharjo, Kab. Karanganyar, Kab. Sragen, Kab. Boyolali, Kab. Klaten, Kab. Wonogiri.
- **Auto-Pan & Zoom**: Peta otomatis mengarahkan fokus koordinat kamera dan tingkat perbesaran (*zoom level*) saat wilayah tertentu dipilih pada bilah filter.

### 4. Filter Data Multi-Dimensi & Ringkasan Metrik
- **Sistem Filter Komprehensif**:
  - Berdasarkan **Periode Bulanan Target** (`YYYY-MM`).
  - Berdasarkan **Kabupaten / Kota** (D.I. Yogyakarta & Solo Raya).
  - Berdasarkan **PIC Marketing / User** (*Semua PIC* atau per staf tertentu).
- **Kartu Indikator Metrik (KPIs)**:
  - *Total Target Terdata* (jumlah deal aktif terdaftar).
  - *Total Nilai Pipeline* (akumulasi potensi pendapatan dari semua deal).
  - *Realisasi Closing (Won)* (total riil pendapatan dari kesepakatan yang berhasil ditutup).

### 5. Riwayat Aktivitas & Catatan Komunikasi (*Deal Activity Log*)
- Modal riwayat kronologis interaktif per prospek.
- Kategori kontak terstruktur (WhatsApp, Telepon, Meeting Langsung, dan Catatan Internal).
- Pencatatan progres negosiasi berkala untuk mempermudah koordinasi dan tindak lanjut (*follow-up*) antar tim.

### 6. Arsitektur Basis Data & Database Seeder
- Skema database relasional terstruktur menggunakan **Prisma ORM** dan **PostgreSQL**.
- Skrip *database seeder* otomatis untuk menginisialisasi:
  - Akun bawaan Super Admin (`admin@digmar.com`) & Tim Marketing (`marketing@digmar.com`).
  - Master data 12 wilayah DIY & Solo Raya lengkap dengan koordinat lintang/bujur dan radius *zoom level*.
  - Master 5 tahapan alur pipeline deal.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **GIS Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Keamanan & Autentikasi**: `jose` (JWT) & `bcryptjs` (Password Hashing)

---

## 💻 Panduan Instalasi Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/miftakhurrokhmat/digmar-tools.git
   cd digmar-tools
   ```

2. **Pasang dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**:
   Buat file `.env` di direktori utama:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/digmar_db?schema=public"
   JWT_SECRET="kunci-rahasia-jwt-super-aman-2026"
   ```

4. **Migrasi Database & Seeding Data**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban.

---

## 👤 Informasi Pengembang

- **Developer**: [Miftakhurrokhmat](https://github.com/miftakhurrokhmat)
- **Year**: 2026