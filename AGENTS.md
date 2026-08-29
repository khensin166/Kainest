# Kainest Project - Agent Handoff Notes

## Status Terkini (03 Juni 2026)
- **Frontend (Kainest Vue 3):**
  - ~~Menggunakan UI/UX modern (vibrant colors, glassmorphism, blob animation).~~ **Sudah tidak berlaku sejak 30 Agustus 2026** — blob, glassmorphism, dan gradien dekoratif dibongkar; lihat Design System v4.0 di bawah.
  - Auth flow (Login, Register, Forgot Password, Reset Password) sudah terkoneksi dengan backend *Better Auth*.
  - Halaman Lupa Password (`/forgot-password`) & Reset Password (`/reset-password`) telah didesain ulang dengan gaya *split-screen* yang sama dengan halaman Login.
  - Terdapat komponen panduan (`<PageGuide>`) di seluruh halaman utama.

- **Backend (Kainest_Be - Hono & Prisma):**
  - Menggunakan *Better Auth* v1.6+. Endpoint untuk lupa password berada di `/auth/request-password-reset`.
  - Integrasi **Resend** telah ditambahkan di dalam `auth.ts` untuk mengirimkan email *Reset Password*.
  - Template email telah diekstrak secara rapi ke `src/infrastructure/email/templates/resetPasswordTemplate.ts`.
  - Variabel lingkungan `RESEND_FROM_EMAIL` sudah disiapkan di `.env`.

## Update 04 Juni 2026
- **Frontend**: Dashboard dirombak dengan memfokuskan layout pada ringkasan keuangan dan Aktivitas Terbaru di sisi utama. `System Updates` dan `User Feedback` ditarik dinamis dari API. `DropdownNotifications` kini interaktif (terhubung ke backend). Sidebar `filteredMenu` bereaksi otomatis saat login, dan menu `Vault Rahasia` sudah dilindungi permission.
- **Backend**: Skema `NotificationLog` dan `ShiftActivity` lama dihilangkan, digantikan dengan `AppNotification` & `UserFeedback` serta `SystemUpdate`. Endpoint API notifikasi, feedback, dan changelog (termasuk fitur *Sync dari GitHub* dengan deteksi keyword `[BLAST]`) telah aktif di Hono.
- **Bot WhatsApp**: Alur registrasi `!link` diperketat (tidak bisa lagi aktivasi personal sebelum membuat grup). Bot kini juga merespons transaksi berhasil dengan mengirimkan stiker animasi *kicaw*.

## Update 13 Juni 2026
- **Frontend**:
  - Menyederhanakan modal Atur Pemasukan (`BudgetSetupModal.vue`) dengan menghapus input target tabungan yang redundan dan menambahkan teks edukasi penjelas gaji sebagai acuan 100%.
  - Memberikan helper text tambahan pada tabel input Kelola Kantong (`PocketManagementModal.vue`).
  - Menambahkan panduan visual interaktif (efek *glow pulse* ungu) pada tombol "Kelola Kantong" di dashboard saat terdeteksi user telah mengisi gaji namun belum memiliki kantong sama sekali (alurnya diarahkan secara visual).
- **Backend**:
  - Sinkronisasi skema Prisma (`schema.prisma`) untuk model `BackupTargets`, `ChatLogs`, dan `ApiKeys` dengan schema `kainest`.
  - Pembersihan file client Supabase lama (`supabaseClient.ts`) yang tidak digunakan untuk menjaga kebersihan repositori.
- **Bot WhatsApp (Staging Safe Mode, Ephemeral Fix & Schema Views)**:
  - Mengembalikan konfigurasi schema Supabase ke default (`public`) dan menggunakan PostgreSQL Views di skema `public` yang merujuk ke tabel asli di skema `kainest` untuk menghindari pemblokiran query oleh PostgREST.
  - Menerapkan isolasi environment via `BOT_ENV_MODE` (`staging` / `production`). Pada mode staging, bot hanya merespons nomor terdaftar di `STAGING_ALLOWED_NUMBERS` dan harus diawali perintah `!dev ` (prefix dilepas otomatis saat masuk ke pemrosesan AI).
  - Isolasi blast pengingat shift kerja pada mode staging agar hanya terkirim ke `STAGING_ALLOWED_NUMBERS`.
  - Perbaikan warning *"This message will not disappear..."* dengan menyalin status durasi ephemeral (`expiration` milidetik) dari pesan masuk dan meneruskannya ke objek `sendMessage` (baik teks maupun stiker).

## Update 14 Juni 2026
- **Frontend & Backend (Isolasi Kata Kunci Kantong)**: 
  - Logika kata kunci AI (*keywords*) dipindahkan dari level Kategori ke level Kantong (`BudgetPocket`). Ini memungkinkan pengguna menambahkan kata kunci custom ke kantong mereka sendiri tanpa memengaruhi kategori global atau pengguna lain.
  - Kategori tetap menyimpan `keywords` sebagai *template* (nilai *default*) saat pengguna membuat kantong baru.
  - Jika pengguna mengosongkan *keywords* pada kantongnya, sistem (Kenin AI) akan otomatis melakukan *fallback* ke *keywords* milik kategori sebagai pengaman.

## Update 19 Juni 2026
- **Frontend (UI & UX Dashboard/Rekap)**:
  - Halaman **Rekap Bulanan** (`FinancialHistoryPage.vue`) mendapat fitur *filter* dinamis (3, 6, 12, Semua rentang bulan). Kartu akordion bulan yang berjalan otomatis terbuka (*auto-expand*) saat halaman dimuat. 
  - Membersihkan elemen statis "Rincian segera hadir" dari *Donut Chart* pemasukan, serta mengoptimalkan desain UI dengan menghilangkan label nominal (Masuk/Keluar) ganda di header daftar akordion.
  - Perbaikan *Trend Line Chart* di Dashboard: Sistem sekarang mengagregasi data transaksi sehingga nominal di hari yang sama tergabung menjadi satu titik koordinat yang akurat.
- **Frontend (Transaksi & Form)**:
  - Transaksi tipe pemasukan (*Income*) kini stabil ditampilkan dengan warna Hijau dan *prefix* `+`.
  - Memperbaiki siklus hidup (*lifecycle*) form edit transaksi (`TransactionForm.vue`) dengan menambah *watcher* pada `props.initialData`. Form kini berpindah tab (Pemasukan/Pengeluaran) secara reaktif saat mengedit transaksi berbeda.
  - Menambal *property* `type` yang terlewat pada proses *mapping* (`TransactionEntity.js` dan `BudgetMapper.js`), memastikan komponen UI mengenali tipe transaksi dengan benar.
  - Saat menambah/mengedit transaksi, `useBudgetStore` kini memicu sinkronisasi otomatis ke Riwayat Bulanan.

## Update 20 Juni 2026
- **Frontend (Profile Store)**:
  - Memperbaiki `useProfileStore.js` agar data role dan permissions user tidak hilang (dipertahankan dari session yang sedang berjalan) saat memperbarui profil atau foto profil.
- **Backend (Transaction & Spending Trend)**:
  - Menyertakan include `category` saat data transaksi baru dibuat di `TransactionRepository.ts`.
  - Melakukan agregasi (group-by tanggal) di `GetSpendingTrendUseCase.ts` untuk memastikan transaksi yang terjadi di hari yang sama terjumlah ke satu titik koordinat di diagram tren pengeluaran, sehingga tidak ada duplikasi tanggal.
  - Memastikan properti `type` (INCOME/EXPENSE) hasil klasifikasi AI diteruskan dengan benar ke prisma create di `ProcessBotTransactionUseCase.ts`.
- **Bot WhatsApp (Unified Message Template)**:
  - Memperbarui template respons transaksi berhasil di `expenseUseCase.js` menjadi format tunggal yang dinamis.
  - Template baru mendukung icon kategori dinamis di label Pocket, format waktu terstandar (`20 Juni 2026 pukul 06.33`), header/footer bervariasi yang disesuaikan secara cerdas berdasarkan tipe transaksi (Pemasukan vs Pengeluaran).

## Update 21 Juni 2026
- **Frontend (Tren Keuangan)**:
  - Mengubah tampilan grafik Tren Pengeluaran menjadi _Dual Line Chart_ (Pengeluaran berwarna Merah dan Pemasukan berwarna Hijau).
  - Komponen Vue dan Store telah disesuaikan untuk membaca struktur balasan API baru yang memisahkan `expenseTrend` dan `incomeTrend`.
- **Backend (API & Skema DB)**:
  - Endpoint Tren Pengeluaran kini mem- _fetch_ data transaksi INCOME dan EXPENSE secara paralel dari database dan memisahkannya dalam respons JSON.
  - Menambahkan kolom `botPhoneNumberStaging` ke tabel `WaBotConfig` agar bot Staging dan Production bisa menggunakan nomor WA yang berbeda tanpa saling menimpa data satu sama lain.
  - Membalik urutan validasi grup: Jika *user* tak terdaftar mengirim pesan dari dalam grup, bot akan melakukan _silent ignore_ (tanpa balasan/reaksi sama sekali) untuk mencegah *spam*. Sapaan dasar (`hai`, `halo`) kini diproses sebagai perintah agar bot bisa merespons di grup yang belum diaktifkan.
  - Memperbaiki fitur sinkronisasi *System Updates* dari GitHub. Mengatasi *delay cache* endpoint `/releases` GitHub dengan cara memanggil `/releases/latest` secara paralel dan menggabungkan hasilnya tanpa duplikasi, sehingga rilis yang baru saja dipublikasikan bisa langsung terdeteksi.
- **Bot WhatsApp**:
  - `syncBotInfo` sekarang mengirimkan informasi `BOT_ENV_MODE` ke Backend saat me-*restart* koneksi, memungkinkan Backend memisahkan _update_ profil bot Staging vs Prod.
  - Mengimplementasikan **Jeda Mengetik Universal (1.5s)** pada seluruh _outgoing message_. Selain memberi kesan natural, hal ini terbukti menyelesaikan masalah permanen di mana pesan pertama bot pasca _restart_ sering memunculkan _error_ "Waiting for this message" akibat berpacu dengan inisialisasi _E2EE Sender Key_.

## Update 27 Juni 2026
- **Bot WhatsApp (Auto-Restart QR Code)**:
  - Memperbaiki bug di mana bot tidak memunculkan QR Code baru di web setelah pengguna melakukan *logout* (keluar dari perangkat tertaut di HP).
  - Kini, ketika sesi terputus dengan alasan `loggedOut`, sistem akan secara fisik menghapus folder kredensial `baileys_auth_info` dan melakukan *auto-restart* sesi dalam 3 detik, sehingga QR Code baru otomatis ter- *generate* dan dikirimkan kembali ke Frontend.

## Update 2 Juli 2026
- **Backend (Perbaikan Rollover Kantong Awal Bulan)**:
  - Memperbaiki bug di mana kantong yang dikonfigurasi menggunakan **persentase gaji** mendapatkan `limitAmount = 0` saat sistem secara otomatis membuat rekap (*history*) bulan baru.
  - Penyebab: Saat membuat snapshot kantong untuk bulan baru, sistem hanya membaca kolom `limitAmount` tanpa menghitung ulang nilai persentase terhadap gaji terkini.
  - Perbaikan di `BudgetRepository.ts` → fungsi `syncMonthlyHistory`: Sekarang sistem mengecek kolom `percentage`. Jika bernilai `> 0`, maka limit dihitung ulang secara otomatis dengan formula `Math.floor((percentage / 100) * salary)`, memastikan template kantong bulan baru selalu akurat.

## Update 21 Juli 2026
- **Frontend**:
  - Menyederhanakan alur *Onboarding* dengan menghapus langkah usang "Pairing Perangkat" di `pageGuides.js`.
  - Mengotomatiskan pemicu modal "Kelola Kantong" di Dashboard agar tampil secara langsung bagi pengguna yang belum mengatur kantong mereka.
- **Backend (WA Bot Commands & Universal Footer)**:
  - Mengimplementasikan sejumlah *command* baru untuk berinteraksi dengan bot WhatsApp: `!today`, `!weekly`, `!monthly`, `!balance`, `!top`, `!recent`, `!undo`, dan `!help` melalui `ProcessBotTransactionUseCase.ts`.
  - Memperbaiki logika penghitungan `!balance` agar secara akurat menjumlahkan transaksi (INCOME dan EXPENSE) berdasarkan bulan berjalan dan menggabungkannya dengan batas/anggaran (*limit*) dari `BudgetPocket`.
  - Menambahkan *Universal Help Footer* (`💡 Ketik !help untuk bantuan.`) ke seluruh balasan bot (termasuk *error*, *greeting*, dan perintah yang sukses) agar pengguna awam selalu tahu cara meminta bantuan.
- **Backend (Perbaikan Voice Note GOWA)**:
  - Memperbaiki *bug* kegagalan transkripsi suara (pesan *error* `"Audio buffer kosong"` dan `"phone: cannot be blank"`). Akar masalahnya adalah hilangnya parameter `?phone=` pada *endpoint download media* GOWA.
  - Memodifikasi `GowaWebhookController.ts` agar menyisipkan `targetPhone` di kueri URL saat mengunduh VN, sehingga data audio dapat diteruskan dengan sukses ke layanan Cloudflare Whisper untuk ditranskripsi ke teks.

## Catatan untuk Agent Selanjutnya
1. Pastikan selalu mematuhi instruksi **Web Application Development** yang mengutamakan UI yang estetik, tidak generik, dan menggunakan animasi ringan (micro-animations).
2. Jika ada masalah terkait rute autentikasi *Better Auth*, perhatikan versi terbarunya (khususnya perbedaan antara endpoint lama `/forget-password` dengan yang baru `/request-password-reset`).
3. Database *Supabase* (pooler port 6543) sesekali mungkin mengalami *timeout* saat inisialisasi awal di mode *development* lokal, cukup jalankan ulang jika terjadi *error*.
4. **Perhatian Penting**: Di sisi Backend, saat ini chat pribadi melalui Linked Devices (`@lid`) memicu error 403 ("bot belum diaktifkan di grup") karena validasi backend menganggap domain JID `@lid` memerlukan aktivasi grup. Ke depannya, validasi ini harus disesuaikan agar mengenali chat pribadi secara tepat.
5. **Peringatan/Future Repair (Disappearing Messages di WA)**: Meskipun parameter `ephemeralExpiration` sudah diekstrak dari pesan masuk dan diteruskan ke opsi pengiriman Baileys sehingga pesan bot kini dapat terbaca dengan baik, terkadang gelembung peringatan WhatsApp *"This message won't disappear. The sender may be on an old version of WhatsApp"* masih muncul secara paralel. Investigasi lebih lanjut diperlukan (misal: memeriksa apakah format ekstraksi regex dari `JSON.stringify(msg)` ada yang kurang presisi, atau status default chat-level ephemeral di sisi client perlu diatur). Hal ini didefer untuk perbaikan di masa mendatang.
6. **Desain Sistem & Tema Warna Terpusat**: Seluruh token warna Tailwind v4 wajib memakai variabel CSS di `src/css/theme-variables.css`, lalu dijembatani ke blok `@theme` di `src/css/style.css`. Jangan pernah *hardcode* warna heksadesimal (`#`) di komponen Vue. Jika butuh warna di JavaScript (seperti Chart.js), gunakan `getCssVar()`.
   **Aplikasi punya EMPAT tema**: `Light` (tanpa kelas), `Dark` (`.dark`), `Factory` (`.dark.theme-factory`), dan `Spidey` (`.dark.theme-spidey`). Tema diterapkan lewat `src/composables/useTheme.js` yang dipanggil di `App.vue` — bukan lagi dari dalam `ThemeToggle`, karena dulu halaman tanpa komponen itu tidak mendapat tema tersimpan. Setiap token semantik wajib ada di ketiganya — token yang absen di satu tema membuat class-nya tidak menghasilkan CSS sama sekali di tema itu. Dijaga oleh aturan lint `no-theme-parity-gap`.
7. **Struktur & aliran data**: dokumentasi lengkap ada di `KAINEST_ARCHITECTURE.md` — lapisan `data`/`domain`/`presentation`, model error `Either` + hierarki `Failure`, composition root `core/di/di.js`, dan klien HTTP `src/lib/apiClient.js`. **Komponen `.vue` dilarang mengimpor `axios`**; HTTP hanya boleh di `data/source/` dan selalu lewat `apiClient` agar interceptor 401/403 (auto-logout) tetap berjalan. Dijaga aturan lint `no-http-in-component`. Seluruh kebocoran sudah ditutup kecuali `SharedSplitPage.vue` (halaman publik tanpa auth, disengaja).
8. **Pagar desain wajib hijau sebelum commit**: `npm run lint:design` (17 aturan, semuanya blocking). Termasuk `no-missing-import` — `vite build` TIDAK menangkap import ikon yang hilang/salah tempat di komponen Options API; build hijau tapi aplikasi layar putih. Aturan lengkap dan alasan tiap pengecualian ada di `KAINEST_DESIGN.md` dan `scripts/lint-design.mjs`.
9. **Build hijau bukan bukti aplikasi hidup**: setelah perubahan UI berskala besar, buka aplikasinya (`/`, `/login`, `/dev/ui`, dan satu halaman di balik autentikasi). Kelalaian ini pernah meloloskan layar putih ke tangan pengguna.
10. **Dev server hidup pun bukan bukti PRODUKSI hidup**: sebelum deploy, jalankan `npm run build && npm run preview` lalu buka `localhost:4173`. Dev server memuat modul ES satu per satu, sedangkan produksi menggabungkannya jadi chunk — masalah urutan inisialisasi antar-chunk **hanya muncul di build produksi**. Ini pernah membuat situs Vercel tampil kosong total sementara dev server baik-baik saja.
11. **Jangan pakai `manualChunks` berbasis `id.includes()`**: pola `id.includes("vue")` menyapu 8 paket (`@vue`, `@vueuse`, `vue-router`, `vue-chartjs`, `vue-flatpickr-component`, `vue3-toastify`, `qrcode.vue`) ke satu chunk, sementara `reka-ui`/`chart.js`/`flatpickr` masuk chunk lain yang saling bergantung. Hasilnya `ReferenceError: Cannot access 'X' before initialization`. Pemecahan chunk otomatis Rollup aman terhadap siklus — biarkan dia bekerja.
10. **Teks UI dibekukan**: pekerjaan desain mengubah warna, ikon, dan tata letak — **bukan kata-kata**. Termasuk kapitalisasi, tanda baca, dan emoji di dalam kalimat. Setelah pekerjaan desain, buktikan dengan mem-*diff* string UI sebelum vs sesudah.


---

## Panduan Operasional Administrator
### Cara Merilis "System Updates" & Notifikasi Blast
Untuk menambahkan pembaruan sistem (*changelog*) agar muncul di Dashboard aplikasi, dan/atau mengirim notifikasi ke semua pengguna:

1. **Buat Release di GitHub**:
   - Buka repositori frontend/backend di GitHub.
   - Pergi ke menu **Releases** lalu klik **Draft a new release**.
   - Isi form (pilih/buat Tag baru seperti `v1.4.0`, masukkan judul fitur, dan tulis deskripsi rilis).
2. **Berikan Keyword Blast (Opsional)**:
   - Jika Anda **ingin mengirim notifikasi lonceng** ke semua pengguna terdaftar saat rilis ini disinkronisasi, tambahkan kata kunci `[BLAST]` di bagian mana saja pada deskripsi GitHub Anda.
   - Jika *tidak ingin* mengirim notifikasi (hanya *silent update*), **jangan** cantumkan kata kunci tersebut.
   - Klik **Publish release** di GitHub.
3. **Sinkronisasi di Aplikasi Kainest**:
   - Buka aplikasi Kainest dan *login* menggunakan akun yang memiliki *role* **Admin**.
   - Masuk ke **Dashboard**.
   - Pada panel *System Updates* (Kainest Changelog) di sebelah kanan, klik tombol ungu **"Sync GitHub"**.
   - Server otomatis akan mem- *parsing* rilis baru, menyimpannya di database, dan menghapus teks `[BLAST]` tersebut agar tidak terlihat aneh di UI pengguna.
   - Selesai! Pembaruan kini sudah terpampang di layar seluruh pengguna.

### Cara Mengonfigurasi Docker & Staging Safe Mode di VPS
Karena bot Staging dan Production berjalan di atas VPS yang sama dan menggunakan berkas `.env` yang sama, gunakan fitur override environment pada berkas `docker-compose.yml` VPS Anda untuk mengisolasi perilaku masing-masing instance.

#### 1. Perbarui Berkas `.env` di VPS Anda
Tambahkan/sesuaikan variabel berikut di dalam berkas `.env` global di VPS Anda:

```env
# ==========================================
# 🤖 WA BOT ADVANCED CONFIGURATIONS (Staging Safe Mode)
# ==========================================
# Nomor WhatsApp Admin yang diperbolehkan di mode Staging (pisahkan dengan koma)
STAGING_ALLOWED_NUMBERS="62812345678,62887654321"

# URL Backend Terpisah
KAINEST_API_URL_PROD="https://kainest.be.kenantomfie.com"
KAINEST_API_URL_STAGING="https://staging.kainest.be.kenantomfie.com"
```

#### 2. Perbarui Berkas `docker-compose.yml` di VPS Anda
Sesuaikan bagian service untuk container Production (`wa-bot`) dan Staging (`wa-bot-staging`) agar menggunakan *overrides* variabel lingkungan secara terpisah:

```yaml
version: '3.8'

services:
  # Instance Bot WhatsApp Production
  wa-bot:
    image: wa-bot:latest  # Sesuaikan dengan konfigurasi Anda
    container_name: wa-bot-prod
    restart: always
    environment:
      - PORT=3000
      - BOT_ENV_MODE=production
      - KAINEST_API_URL=${KAINEST_API_URL_PROD}
    env_file:
      - .env
    # ... volume, port, dll.

  # Instance Bot WhatsApp Staging
  wa-bot-staging:
    image: wa-bot:latest  # Sesuaikan dengan konfigurasi Anda
    container_name: wa-bot-staging
    restart: always
    environment:
      - PORT=3001  # Sesuaikan port jika diekspos
      - BOT_ENV_MODE=staging
      - KAINEST_API_URL=${KAINEST_API_URL_STAGING}
      - STAGING_ALLOWED_NUMBERS=${STAGING_ALLOWED_NUMBERS}
    env_file:
      - .env
    # ... volume, port, dll.
```

#### 3. Terapkan Perubahan & Restart Container
Jalankan perintah ini di direktori server VPS Anda untuk menerapkan konfigurasi baru:

```bash
docker compose down
docker compose up -d
```

## Roadmap & Ide Pengembangan Masa Depan (Inspirasi FinanceFlow PRO)
Berikut adalah daftar fitur potensial yang dapat dikembangkan untuk Kainest ke depannya berdasarkan inspirasi UI/UX aplikasi kelas profesional:

1. **Manajemen Tagihan & Cicilan (Upcoming Bills)**
   - **Konsep:** Membuat modul "Target & Tagihan" di mana pengguna bisa memasukkan tagihan bulanan (langganan, cicilan, listrik).
   - **Eksekusi AI:** Kainest atau Bot WhatsApp akan mengirimkan notifikasi pengingat otomatis (misal H-3) sebelum tagihan jatuh tempo.

2. **Visualisasi Progres Target Tabungan (Saving Goals)**
   - **Konsep:** Membuat tipe Kantong khusus bernama "Kantong Tabungan".
   - **Mekanisme:** Uang yang dialokasikan ke kantong ini tidak dihitung sebagai pengeluaran bulanan, melainkan akan menambah *progress bar* menuju target spesifik (misal: Beli Laptop Rp 10.000.000).

3. **Widget "AI Insight" & Status Kesehatan Keuangan**
   - **Konsep:** Menampilkan skor kesehatan finansial pengguna di Dashboard (contoh: jika pengeluaran > pemasukan, status = Critical).
   - **Eksekusi AI:** Menarik ringkasan analisis cerdas dari Groq AI untuk ditampilkan sebagai teks Insight harian di Dashboard (contoh: *"Pengeluaran makanmu minggu ini naik 20%, yuk rem sedikit"*).
   - **Perbandingan Antar Bulan:** AI akan dapat melakukan analisis perbandingan pengeluaran antar bulan yang dipilih pengguna (misal: membandingkan kebiasaan belanja bulan Juni dan Juli) untuk memberikan *insight* tren yang lebih mendalam.

4. **UI/UX: Premium Dark Mode & Glassmorphism Pekat**
   - **Konsep:** Menambahkan opsi tema "Premium Dark Mode" di pengaturan aplikasi.
   - **Visual:** Menggunakan latar belakang *navy blue/dark gray* polos dengan panel semi-transparan (Tailwind `dark:` classes yang lebih *deep*) untuk memberikan kesan elegan layaknya aplikasi finansial/trading level pro.

## Update 30 Juli 2026
- **Frontend (BudgetSetupModal.vue)**:
  - Menambahkan dropdown **"Tanggal Gajian / Reset Siklus Bulanan"** dengan pilihan tanggal 1-30 serta `31/Akhir Bulan (Default)`.
  - Mengirim properti `payday` ke backend API `/budget/setup` bersama dengan nilai `salary`.

## Update 30 Agustus 2026
- **Frontend (Design System v4.0)** — dikerjakan di branch `chore/design-system-fase-0-1`:
  - **Lapis primitif baru** `src/ui/` (13 komponen: Button, Badge, Card, Input, Select, Switch, Tabs, Modal, Skeleton, Spinner, PageShell, EmptyState, StatCard). Varian memakai `class-variance-authority` + `tailwind-merge`; perilaku & aksesibilitas dari **reka-ui**. Halaman demo dev-only di `/dev/ui`.
  - **Dicabut**: daisyUI (dipakai setengah lalu ditimpa utility), HeadlessUI (diganti reka-ui), Heroicons dan lucide-vue-next (diganti Material Symbols). 25 berkas template Mosaic yang tidak terpakai dihapus.
  - **Ikon → Material Symbols** lewat `unplugin-icons` (compile-time, tree-shaken, tanpa request jaringan). Semua ikon melewati satu peta `src/ui/icons.js` (76 ekspor bernama domain). 61 Heroicon + 82 inline SVG + 1 lucide dimigrasi; inline `<svg>` kini hanya untuk logo merek dan `<Spinner>`.
  - **Font Inter → Geist** (self-hosted `@fontsource-variable/geist`, bukan Google Fonts).
  - **Konsistensi warna**: satu peran = satu keluarga warna di ketiga tema. `chart-expense` berhenti memakai ungu (ungu = brand) dan mengikuti keluarga `danger`. Token `--color-ai` (violet) ditambahkan ke ketiga tema untuk seluruh fitur AI.
  - **Pagar `npm run lint:design`** — 17 aturan blocking, termasuk `no-theme-parity-gap`, `no-undefined-token`, dan `no-missing-import`.
- **Bug yang ditemukan & diperbaiki dalam proses**:
  - `bg-brand-surface` dipakai di 10 tempat tetapi tokennya **tidak pernah didefinisikan** — elemen-elemen itu selama ini tanpa background.
  - `bg-surface-canvas` di `SharedSplitPage` juga tidak pernah ada — halaman publik itu tanpa background.
  - `max-w-9xl` dipakai 8 halaman tetapi tidak terdefinisi, sehingga halaman-halaman itu selebar layar sementara halaman lain dibatasi. Kini `--container-9xl: 96rem`.
- **Bug yang lolos ke pengguna, lalu diperbaiki (pelajaran penting)**:
  - Migrasi ikon otomatis mengandaikan semua komponen memakai `<script setup>`. Komponen **Options API** (`Sidebar.vue`, `Header.vue`, `Tooltip.vue`) tidak punya anchor itu, sehingga baris `import` hilang atau nyasar ke luar blok `<script>`. **`vite build` tetap hijau** — SFC compiler mengabaikan teks di luar blok — tetapi aplikasi menampilkan layar putih saat dibuka. Kini dijaga aturan lint `no-missing-import`.
  - `GetStartedPage.vue` memakai `IconChecklist` sementara yang diimpor `IconCheckCircle` (sisa penggantian saat mengembalikan teks asli "Todo List").
  - Primitif `Input.vue` berakar `<div>`, sehingga atribut `placeholder`/`type`/`autocomplete` menempel ke div dan **semua placeholder tidak muncul**. Diperbaiki dengan `inheritAttrs: false` + `v-bind="$attrs"` pada `<input>`.
  - Ketiganya tidak terdeteksi `vite build` maupun `lint` versi saat itu. Verifikasi runtime di browser sekarang wajib — lihat catatan #8.
- **Verifikasi yang sudah dilakukan**: `/`, `/login`, `/register`, `/forgot-password`, `/valentine`, `/dev/ui` (tema Light & Factory), serta pemeriksaan terukur 13 token semantik × 3 tema (nol yang kosong).
- **Belum diverifikasi runtime**: seluruh halaman di balik autentikasi (Dashboard, Kantong Keuangan, Riwayat Transaksi, Rekap Bulanan, Split Bill, Settings, WaBot, Manajemen User).

## Update 30 Agustus 2026 (lanjutan) — Tema Spidey
- **Tema keempat `Spidey` — "Web Strike"** (`.dark.theme-spidey`): hitam hangat `#09090B` / kartu `#17161A`, **biru elektrik `#4DA3FF` memegang aksi** (teks gelap, 7.58:1), **merah Marvel `#E62429` dipakai MURNI** untuk bar, aksen, dan `chart-expense`. Melewati tiga iterasi: v1 navy nyaris-hitam terlalu desaturasi sehingga terasa dashboard generik; v2 medan biru jenuh membuat angka melelahkan dibaca **dan** menjatuhkan merah Marvel ke 2.76:1 sehingga harus diencerkan sampai berhenti terasa merah Marvel. Basis hitam justru memberi merah ruang (3.99:1 — cukup untuk grafis, ambang 3:1), sementara teks merah memakai `status-danger-text` `#FF6B6F`. Merah tetap **bukan** warna tombol: di aplikasi keuangan merah sudah berarti bahaya, dan menjadikannya warna aksi membuat tombol Simpan dan Hapus tampak sama.

- **`ThemeToggle` jadi dropdown** (`DropdownMenuRadioGroup` reka-ui) — dengan empat tema, tombol siklus butuh sampai 4 klik untuk kembali. API komponen tidak berubah sehingga 7 halaman pemanggilnya tidak disentuh.
- **Bug laten diperbaiki**: `useColorMode` dulu dipanggil di dalam `ThemeToggle`, sehingga tema tersimpan **tidak diterapkan** pada halaman yang tidak memuat komponen itu (`/dev/ui`, halaman berbagi publik). Kini diangkat ke `src/composables/useTheme.js` dan dipanggil di `App.vue`.
- **Audit kontras WCAG** menemukan 4 masalah yang tidak terlihat dari melihat layar: `text-inverse` di tombol brand (4.23 gagal), `text-muted` (4.16 gagal), `text-faint` (2.35 gagal), dan `brand-text` Factory yang bernilai `#101010` — gelap di atas gelap, rasio 1.05, karena semantiknya melenceng jadi "teks di atas tombol". Semua diperbaiki; setiap tema baru wajib diaudit dengan cara yang sama.
- **Keterbatasan yang diketahui**: 51 lokasi memakai `text-status-danger` (warna permukaan) sebagai warna teks, rasio ~3.9. Lolos untuk ikon dan angka besar, tidak untuk teks kecil. Bukan khas Spidey — tema Dark pun ~4.0. Perbaikannya per lokasi ke `text-status-danger-text`.

## Update 30 Agustus 2026 (lanjutan) — Buku panduan & perbaikan sesi
- **Bug "selalu keluar sendiri" diperbaiki**: interceptor `apiClient` dulu memperlakukan **403 sama dengan 401** dan memanggil `logout()`. Padahal 403 berarti *sudah login tapi tidak diizinkan* — misalnya membuka fitur yang butuh pasangan tertaut. Kini 403 memunculkan modal global dan sesi dipertahankan; hanya 401 yang mengakhiri sesi.
- **Buku panduan lengkap**: `src/config/pageGuides.js` dari 7 → 13 kunci. Seluruh 13 halaman yang fiturnya sudah jadi punya tombol Buku Panduan. Panduan `wabot` ternyata sudah ditulis tapi tak pernah dipasang; kunci `dashboard` salah menempel di Kantong Keuangan (diganti jadi `budgeting`).
- **Tiga menu stub** (`Galeri Kenangan`, `Kalender Cinta`, `Vault Rahasia`) dulu mengarah ke `Dashboard.vue` sehingga pengguna mengira aplikasi rusak. Kini memakai `ComingSoonPage.vue`.
- **Catatan keamanan**: `PageGuide` merender `step.desc` dengan `v-html`. Isinya HANYA boleh dari `pageGuides.js` yang statis — jangan pernah mengalirkan teks dari API ke sana.
