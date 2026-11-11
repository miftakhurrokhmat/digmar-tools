# digmar-tools

**digmar-tools** adalah platform CRM & Pipeline Deal Tracker berbasis web yang dirancang khusus untuk memetakan target promosi, memantau pergerakan prospek (*pipeline states*), serta menganalisis konversi penjualan di wilayah **D.I. Yogyakarta (5 wilayah)** dan **Solo Raya (7 wilayah)**.

Aplikasi ini berfokus pada segmentasi produk **Pelatihan Profesional** dan **Mentoring Anak**, dilengkapi visualisasi spasial interaktif Leaflet GIS dengan geofencing radius, engine pengiriman email proposal otomatis terpusat, audit log komunikasi terpadu, **Executive Analytics Dashboard** untuk pemantauan manajemen, serta kontrol multi-user berbasis peran (*Role-Based Access Control*).

---

## 🚀 Fitur Utama & Pembaruan Terkini

### 1. Autentikasi & Keamanan Sesi
- **Sistem Login & Logout**: Autentikasi terenkripsi berbasis JSON Web Token (JWT) yang disimpan dalam *HTTP-only cookie* aman untuk menangkal celah XSS.
- **Validasi Sesi Otomatis**: Proteksi rute navigasi dashboard dengan pengalihan otomatis (*auto-redirect*) ke halaman login jika sesi kadaluarsa atau tidak valid.
- **Manajemen Akun Terpadu (CRUD User)**:
  - Pembatasan hak akses multi-role: **ADMIN** dan **MARKETING**.
  - Administrator dapat menambah staf baru, memperbarui data akun/password, serta menghapus staf marketing.
  - Akun aktif diproteksi agar tidak dapat menghapus dirinya sendiri saat sedang login demi konsistensi data.

### 2. Dashboard Analitik Eksekutif (Manajemen & Admin)
- **Akses Khusus Manajemen / Admin**: Terisolasi pada rute `/analytics` dan diproteksi ketat pada layer backend API & frontend UI.
- **Filter Multi-Periode Fleksibel**:
  - Filter berdasarkan **Tahun Tertentu** (misal 2026, 2025, 2024).
  - Filter **Bulan Spesifik** (Januari s.d. Desember) atau **Semua Bulan (1 Tahun Penuh)**.
  - Tombol aksi instan *Bulan Ini*.
- **Metrik Utama (KPIs)**:
  - **Win Rate Penjualan**: Persentase rasio konversi deal berhasil (`Won / Total Deals`).
  - **Realisasi Pendapatan (Won)**: Akumulasi nilai riil deal yang sukses closing.
  - **Potensi Pipeline Tertunda**: Total nilai deal aktif yang masih dalam proses negosiasi.
  - **Total Aktivitas Outbound**: Akumulasi proposal email terkirim dan chat WhatsApp yang dilancarkan.
- **Analisis Komparasi Wilayah (DIY vs Solo Raya)**:
  - Progress bar proporsi kontribusi nilai pipeline antara wilayah D.I. Yogyakarta dan Solo Raya.
  - Rincian jumlah deal terdata serta realisasi closing per region.
- **Segmentasi Penjualan & Produk**:
  - Perbandingan omzet *Pelatihan Profesional* vs *Mentoring Anak*.
  - Klasifikasi segmen prospek: B2B (Instansi/Kampus), B2C Profesional, dan B2C Siswa/Ortu.
- **Leaderboard Performa Tim Sales**:
  - Peringkat staf sales berdasarkan total deal terinput, jumlah deal closing, total nominal closing (IDR), potensi pipeline, dan intensitas kontak prospek.

### 3. Papan Pipeline Kanban & Aksi Cepat
- **Drag-and-Drop State Deals**: Pemindahan status prospek secara responsif dan *real-time* melintasi 5 tahapan penjualan:
  1. `Lead In` (Prospek Baru Masuk)
  2. `Contacted` (Proses Komunikasi Berjalan)
  3. `Proposal` (Pengiriman Penawaran & Silabus)
  4. `Closed Won` (Berhasil Closing / Penjualan Sukses)
  5. `Closed Lost` (Batal / Tidak Terkonversi)
- **Step-Color Header Theme**: Indikator warna bertahap (*step-progression color*) pada titik peluru (*bullet*) dan *badge counter* masing-masing kolom (Biru $\rightarrow$ Ungu $\rightarrow$ Amber $\rightarrow$ Hijau Emerald $\rightarrow$ Merah Rose).
- **Shortcut Direct WhatsApp**: Tombol chat langsung di kartu prospek yang menormalisasi format nomor telepon (misal `08...` ke `628...`) dan membuat draf pesan pembuka otomatis (mencakup nama klien, instansi, dan kebutuhan topik).
- **Auto-Log Klik WhatsApp**: Setiap klik tautan WhatsApp di kartu prospek otomatis tercatat ke dalam audit log sistem.
- **Shortcut Email Proposal**: Tombol cepat untuk membuka formulir kirim proposal pada tahap prospek aktif.
- **Kartu Deal Informatif**: Menampilkan nama kontak klien, instansi, kebutuhan topik spesifik, estimasi nominal, wilayah, label produk (`Pelatihan Pro` vs `Mentoring Anak`), klasifikasi prospek (`B2C SMK`, `B2C Siswa/Ortu`, `B2B Korporat/Kampus`), serta avatar/nama PIC marketing penginput data.

### 4. Engine Email Proposal & Kuota Harian Bersama
- **Konfigurasi SMTP Terpusat (Admin)**: Pengaturan server SMTP kantor (Gmail App Password / Custom SMTP) disimpan langsung di database via antarmuka modal tanpa perlu mengubah file `.env`.
- **Kuota Email Harian Terpusat (Shared Quota)**:
  - Pembatasan kuota pengiriman email harian kantor (misal 50 email/hari).
  - Indikator counter kuota *real-time* (`Terpakai / Limit (Sisa)`) ditampilkan di bilah navigasi atas dan dapat dipantau bersama oleh seluruh staf sales maupun admin.
  - Reset otomatis kuota harian setiap pergantian hari (00:00).
  - Pengecekan kuota di sisi server (*guard*) untuk mencegah over-limit pengiriman email.
- **Kirim Proposal + Lampiran PDF**: Pengiriman silabus dan penawaran resmi dengan lampiran file PDF langsung ke alamat email klien.
- **Otomasi Perpindahan Tahapan (Stage Automation)**: Deal otomatis bergeser dari tahap *Lead In* / *Contacted* ke tahap *Proposal* saat email berhasil terkirim, sekaligus mencatat ringkasan pengiriman ke riwayat aktivitas deal.

### 5. Audit Log Komunikasi Terpadu (WhatsApp & Email)
- **Tabel Rekap Komunikasi Tunggal**: Mencatat seluruh riwayat interaksi outbound (kanal Email & WhatsApp).
- **Detail Jejak Audit**: Meliputi pengirim (PIC marketing/admin), penerima (nomor WA atau alamat email), instansi/klien terkait, subjek email, metadata lampiran dokumen, stempel waktu presisi, dan status keberhasilan (*Terkirim* atau *Gagal* dengan pesan error).
- **Pencarian & Filter Interaktif**: Filter berdasarkan kanal komunikasi (Semua, Email, WhatsApp) serta kolom pencarian instan nama penerima, instansi, atau nama staf pengirim.

### 6. Pemetaan Spasial Wilayah (Leaflet GIS) & Geofencing Kluster
- **Cakupan 12 Wilayah Presisi**:
  - **D.I. Yogyakarta**: Kota Yogyakarta, Kab. Sleman, Kab. Bantul, Kab. Kulon Progo, Kab. Gunungkidul.
  - **Solo Raya**: Kota Surakarta, Kab. Sukoharjo, Kab. Karanganyar, Kab. Sragen, Kab. Boyolali, Kab. Klaten, Kab. Wonogiri.
- **Visual Geofencing & Radius Kluster**:
  - *Kluster Kampus & Edutech DIY* (Sleman - Kota Yogyakarta, radius 7,5 km).
  - *Kluster Industri & Vokasi Solo Raya* (Surakarta - Sukoharjo, radius 9,5 km).
  - *Koridor Klaten* (radius 7,0 km).
- **Kontrol Layer & Filter Cepat**: Toggle sakelar radius visual on/off serta menu dropdown pemilihan zona untuk mengarahkan kamera peta (*flyTo*) ke kluster target.
- **Popup Marker Target**: Menampilkan nama klien, instansi, nominal potensi transaksi, wilayah, dan PIC yang bertanggung jawab.

### 7. Ekspor Laporan Pipeline (CSV / Excel UTF-8)
- **Ekspor Data Dinamis**: Mengunduh rekapitulasi data prospek ke dalam file format `.csv` yang disesuaikan dengan filter yang sedang aktif di layar (filter periode bulan, wilayah, maupun PIC marketing).
- **Dukungan UTF-8 BOM**: Dilengkapi Byte Order Mark (BOM) agar file langsung dapat dibuka rapi di Microsoft Excel, Google Sheets, atau LibreOffice tanpa kendala format font atau karakter rusak.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **GIS Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Email Engine**: [Nodemailer](https://nodemailer.com/)
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
   DATABASE_URL="postgresql://postgres:password@localhost:5432/digmar_db?schema=public"
   JWT_SECRET="kunci-rahasia-jwt-super-aman-2026"
   ```

4. **Migrasi Database & Seeding Data**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
   *Default Admin:* `admin@digmar.com` | *Password:* `admin123`

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban. Akses analitik melalui menu ikon analitik di header atau langsung ke `http://localhost:3000/analytics`.

---

## 🌐 Panduan Setup & Deployment di VPS Linux (Ubuntu 22.04 / 24.04 LTS)

Panduan ini menggunakan arsitektur produksi standar industri: **Node.js LTS**, **PostgreSQL**, **PM2 Process Manager**, **Nginx Reverse Proxy**, dan **SSL Gratis (Let's Encrypt / Certbot)**.

### Langkah 1: Persiapan Server VPS
Hubungkan ke VPS melalui terminal SSH:
```bash
ssh root@IP_VPS_ANDA
```
Perbarui sistem operasi server:
```bash
apt update && apt upgrade -y
apt install -y git curl ufw
```

### Langkah 2: Instalasi Node.js LTS & Build Tools
Pasang Node.js LTS (v20 atau v22):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs build-essential
npm install -g pm2
```

### Langkah 3: Instalasi & Konfigurasi PostgreSQL
1. Pasang service PostgreSQL:
   ```bash
   apt install -y postgresql postgresql-contrib
   systemctl enable postgresql
   systemctl start postgresql
   ```

2. Buat database dan user PostgreSQL khusus untuk aplikasi:
   ```bash
   sudo -u postgres psql
   ```
   Jalankan query SQL berikut di dalam prompt postgres:
   ```sql
   CREATE DATABASE digmar_db;
   CREATE USER digmar_user WITH ENCRYPTED PASSWORD 'PasswordKuatAnda2026!';
   GRANT ALL PRIVILEGES ON DATABASE digmar_db TO digmar_user;
   ALTER DATABASE digmar_db OWNER TO digmar_user;
   \c digmar_db
   GRANT ALL ON SCHEMA public TO digmar_user;
   \q
   ```

### Langkah 4: Clone & Setup Proyek
1. Clone repositori ke direktori `/var/www/`:
   ```bash
   mkdir -p /var/www
   cd /var/www
   git clone https://github.com/miftakhurrokhmat/digmar-tools.git
   cd digmar-tools
   ```

2. Buat file `.env` untuk mode produksi:
   ```bash
   nano .env
   ```
   Isi file dengan konfigurasi produksi:
   ```env
   NODE_ENV="production"
   DATABASE_URL="postgresql://digmar_user:PasswordKuatAnda2026!@localhost:5432/digmar_db?schema=public"
   JWT_SECRET="buat-string-acak-panjang-dan-unik-disini-2026"
   PORT=3000
   ```
   Simpan dengan menekan `Ctrl + O`, `Enter`, lalu keluar dengan `Ctrl + X`.

3. Pasang dependensi dan bangun (*build*) aplikasi Next.js:
   ```bash
   npm install --production=false
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   npm run build
   ```

### Langkah 5: Jalankan Aplikasi Menggunakan PM2
Jalankan Next.js di latar belakang menggunakan PM2:
```bash
pm2 start npm --name "digmar-tools" -- start
pm2 save
pm2 startup
```
*(Jalankan perintah yang disarankan oleh output `pm2 startup` jika ada).*

Periksa status aplikasi:
```bash
pm2 status
```

### Langkah 6: Konfigurasi Nginx sebagai Reverse Proxy
1. Pasang Nginx:
   ```bash
   apt install -y nginx
   ```

2. Buat file konfigurasi virtual host:
   ```bash
   nano /etc/nginx/sites-available/digmar-tools
   ```

3. Tempel konfigurasi berikut (ganti `domainanda.com` dengan domain atau subdomain Anda):
   ```nginx
   server {
       listen 80;
       server_name domainanda.com www.domainanda.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       client_max_body_size 25M;
   }
   ```

4. Aktifkan konfigurasi dan restart Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/digmar-tools /etc/nginx/sites-enabled/
   rm -f /etc/nginx/sites-enabled/default
   nginx -t
   systemctl restart nginx
   ```

### Langkah 7: Pasang Sertifikat SSL Gratis (Certbot)
1. Pasang Certbot untuk Nginx:
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. Generate sertifikat SSL Let's Encrypt secara otomatis:
   ```bash
   certbot --nginx -d domainanda.com -d www.domainanda.com
   ```
   Ikuti petunjuk di layar (masukkan email dan setujui ToS). Certbot akan secara otomatis memperbarui konfigurasi Nginx menjadi HTTPS (port 443).

### Langkah 8: Konfigurasi Firewall Server (UFW)
Amankan server dengan membuka hanya port yang dibutuhkan:
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

Selesai! Aplikasi Anda sekarang dapat diakses secara publik dan aman melalui `https://domainanda.com`.

---

## 👤 Informasi Pengembang

- **Developer**: [Miftakhurrokhmat](https://github.com/miftakhurrokhmat)
- **Year**: 2026