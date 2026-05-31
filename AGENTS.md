# 🤖 Kainest Frontend - Software Requirements Specification (SRS) & Guidelines

Dokumen ini mendefinisikan spesifikasi kebutuhan perangkat lunak (SRS), arsitektur, standar UI/UX, manajemen state, perbaikan sistem terbaru, serta rencana pengembangan masa depan untuk **Kainest Frontend**. Dokumen ini ditujukan bagi pengembang dan AI Agent yang bekerja pada repositori ini.

---

## 1. PENDAHULUAN (SYSTEM OVERVIEW)
Kainest Frontend adalah aplikasi web (Single Page Application) responsif yang dibangun menggunakan **Vue 3** dengan **Composition API** dan **Vite** sebagai build tool. 
Aplikasi ini berfungsi sebagai antarmuka pengguna untuk mengelola keuangan personal dan pasangan, mencakup dashboard status anggaran, manajemen "Kantong" pengeluaran (Budget Pocket) berbasis persentase/nominal, pengelolaan transaksi harian, visualisasi tren pengeluaran, serta antarmuka AI asisten finansial.

---

## 2. ARSITEKTUR & STRUKTUR SISTEM (ARCHITECTURAL SPECIFICATION)
Proyek ini mengadopsi **Clean Architecture** (Domain-Driven Design) yang terbagi secara modular berdasarkan fitur di bawah direktori `src/features/`.

### 2.1 Struktur Folder Utama
```text
src/
├── core/                  # Utilitas inti, injeksi dependensi manual (di/di.js), definisi error
├── features/              # Modul fitur terisolasi (auth, budgeting, notes, dll.)
├── layouts/               # Layout Vue global (contoh: DashboardLayout.vue)
├── lib/                   # Integrasi pihak ketiga (Axios API Client)
├── pages/                 # Root views/pages aplikasi
├── router.js              # Konfigurasi Vue Router & Navigation Guards
└── main.js                # Entry point aplikasi
```

### 2.2 Lapisan Modul Fitur (Feature Layers)
Setiap fitur dibagi menjadi tiga lapisan terpisah untuk menjaga pemisahan tanggung jawab (Separation of Concerns):
1. **Presentation Layer (`presentation/`)**:
   - `pages/`: Halaman utama Vue (contoh: `BudgetDashboardPage.vue`).
   - `components/`: Komponen UI spesifik fitur (contoh: `PocketManagementModal.vue`).
   - `stores/`: State management menggunakan **Pinia** (contoh: `usePocketStore.js`).
2. **Domain Layer (`domain/`)**:
   - `use-cases/`: Logika bisnis client-side (contoh: `BulkSetupPocketsUseCase.js`).
   - `repository/`: Definsi interface repository.
3. **Data Layer (`data/`)**:
   - `repository/`: Implementasi konkret dari repository interface.
   - `source/`: Sumber data remote (Axios API request).
   - `mappers/`: Pemetaan data dari format API ke domain entity.

### 2.3 Dependency Injection (DI) Manual
- Pengelolaan dependensi diatur secara terpusat di `src/core/di/di.js`.
- **Aturan**: Setiap Use Case atau Repository baru **wajib didaftarkan di `di.js`** sebelum digunakan di dalam Pinia Store atau Komponen Vue.

### 2.4 Standar Penanganan Response (Either Pattern)
- Komunikasi antar layer menggunakan pola **Either** (`right` untuk sukses, `left` untuk gagal).
- **ATURAN PENTING**: Jangan memanggil `.isRight()` atau `.isLeft()` sebagai fungsi (misal: `result.isRight()`), karena akan menyebabkan error runtime. Lakukan pengecekan properti secara langsung:
  ```javascript
  const result = await getPocketsUseCase.execute();
  if (result.right) {
    // sukses
  } else {
    // gagal (result.left)
  }
  ```

---

## 3. STANDAR UI/UX & DESAIN SISTEM (UI/UX SPECIFICATION)
Aplikasi ini mengutamakan visual premium dan kemudahan interaksi.
1. **Gunakan Komponen Existing**: Selalu prioritaskan penggunaan komponen UI yang sudah terdaftar secara global atau lokal, seperti `DropdownSelect.vue` untuk memilih opsi kategori/tipe limit, guna menjaga konsistensi visual.
2. **Responsif & Layout Aman**:
   - Cegah pemotongan (cropping) layout form atau modal dengan memberikan lebar modal yang dinamis (misal: `size="2xl"` pada pembungkus `BaseModal.vue` untuk form konfigurasi yang lebar).
   - Pastikan area form memiliki scrollbar internal yang aman menggunakan kelas utility Tailwind (`max-h-[85vh] overflow-y-auto`).
3. **Mikro-Animasi & State Loading**: Berikan feedback visual yang jelas pada tombol submit (`disabled` dan teks berubah menjadi "Menyimpan...") selama proses API berlangsung.

---

## 4. INTEGRASI STATE & FITUR UTAMA (STATE MANAGEMENT)
### 4.1 Modul Budget Pockets (`usePocketStore.js`)
State management untuk "Kantong" pengeluaran diatur oleh `usePocketStore.js` dengan fungsi-fungsi utama:
- `fetchPockets()`: Mengambil daftar kantong user.
- `upsertPocket(data)`: Membuat/memperbarui satu kantong.
- `deletePocket(categoryId)`: Menghapus kantong berdasarkan kategori.
- `bulkSetupPockets(data)`: Mengatur konfigurasi kantong secara massal.
- `updateKeywords(categoryId, keywords)`: Menyimpan kata kunci pencocokan transaksi AI ke database.

### 4.2 Alur Otorisasi & RBAC (`authStore.js`)
- `UserEntity` menyimpan status `role` dan array `permissions`.
- `authStore.js` menyediakan getter `isAdmin` dan method `hasPermission(module_name)`.
- Router Guard mengecek properti `meta.requiresAdmin` atau `meta.requiredPermission` sebelum mengizinkan navigasi halaman.

---

## 5. PERBAIKAN & FITUR YANG SUDAH DILAKUKAN (RECENT FIXES & FEATURES)
1. **Perbaikan Runtime Error (`result.isRight` Bug)**: Mengoreksi bug pemanggilan fungsi `.isRight()` di store dan komponen frontend. Logika pengecekan kini langsung membaca properti `.right` dan `.left`.
2. **Refactoring Komponen "Kelola Kantong"**: 
   - Membuat komponen `PocketManagementModal.vue` untuk menggantikan `BudgetSetupModal.vue` yang sudah usang (tidak lagi memaksa konsep budget statis ala "Anak Kos").
   - Integrasi penuh dengan komponen `DropdownSelect.vue` untuk pemilihan kategori dan tipe batas (persentase/nominal).
3. **Perbaikan Layout & Kategori Dropdown**: Menyelesaikan masalah binding kategori di mana data tidak terpanggil saat memilih opsi, serta memperbaiki pemotongan konten pada layar resolusi sedang.
4. **Optimasi Chunking Bundle**: Membagi library vendor utama (Vue, Pinia, Axios) ke dalam chunk terpisah di file `vite.config.js` untuk meningkatkan kecepatan muat halaman pertama.

---

## 6. RENCANA PENGEMBANGAN MASA DEPAN (FUTURE DEVELOPMENT)
1. **PWA Quick Input Widget**: Menyediakan antarmuka widget input cepat (Quick Input) pada layar utama ponsel (PWA) agar pengguna dapat menulis pengeluaran instan berbasis AI tanpa masuk ke dashboard utama.
2. **Visualisasi Alokasi vs Realisasi (Progress Tracker)**: Grafik visual dinamis pada dashboard utama untuk membandingkan alokasi persentase kantong dengan persentase pengeluaran riil saat ini secara real-time.
3. **AI Categorization Approval Prompt**: Dialog konfirmasi otomatis setelah pengguna memasukkan teks pengeluaran AI, menampilkan hasil parsing (kategori, nominal, catatan) sebelum disimpan secara permanen.
