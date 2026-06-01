# 🤖 Kainest Frontend — Software Requirements Specification (SRS) & Agent Guidelines

Dokumen ini mendefinisikan spesifikasi kebutuhan perangkat lunak (SRS), arsitektur, standar UI/UX, manajemen state, perubahan sistem terbaru, serta rencana pengembangan masa depan untuk **Kainest Frontend**. Dokumen ini bersifat _living document_ dan ditujukan bagi pengembang serta AI Agent yang bekerja pada repositori ini.

> **PENTING UNTUK AGENT**: Selalu baca dokumen ini terlebih dahulu sebelum melakukan perubahan apapun pada kode. Patuhi aturan arsitektur, konvensi DI, dan pola response yang sudah ditetapkan.

---

## 1. PENDAHULUAN (SYSTEM OVERVIEW)

Kainest Frontend adalah aplikasi web (Single Page Application / SPA) responsif yang dibangun menggunakan **Vue 3 (Composition API)** dengan **Vite** sebagai build tool.

Aplikasi ini menyediakan antarmuka pengguna untuk:
- Dashboard ringkasan keuangan bulanan (status kantong, pengeluaran vs alokasi)
- Pengelolaan "Kantong" Budget (Pocket) berbasis persentase atau nominal Rupiah
- Pengelolaan & riwayat transaksi harian
- Pembuatan kategori kantong kustom oleh user
- Visualisasi tren pengeluaran harian (grafik)
- Antarmuka AI asisten finansial (Kenin)
- Halaman Riwayat Keuangan Bulanan (Bar Chart + Akordion per bulan dengan rincian kantong)

---

## 2. ARSITEKTUR & STRUKTUR SISTEM (ARCHITECTURAL SPECIFICATION)

Proyek ini mengadopsi **Feature-Based Clean Architecture** (Domain-Driven Design) yang tersusun secara modular di bawah `src/features/`.

### 2.1 Struktur Folder Utama

```text
src/
├── core/
│   └── di/di.js             # Pusat Dependency Injection manual — WAJIB diperbarui saat menambah Use Case baru
├── features/                # Modul fitur terisolasi
│   ├── auth/
│   ├── budgeting/
│   ├── notes/
│   ├── todos/
│   ├── profile/
│   ├── couple/
│   ├── security/
│   ├── wabot/
│   └── admin/
├── layouts/                 # Layout Vue global (DashboardLayout.vue, dll.)
├── components/              # Komponen UI global (forms, modals, dll.)
├── lib/
│   └── apiClient.js         # Axios singleton dengan interceptor token otomatis
├── router.js                # Vue Router & Navigation Guards (RBAC)
└── main.js                  # Entry point aplikasi
```

### 2.2 Lapisan Modul Fitur (`features/budgeting/` sebagai contoh)

| Lapisan | Lokasi | Tanggung Jawab |
|---|---|---|
| **Presentation** | `presentation/pages/` | Halaman utama Vue |
| **Presentation** | `presentation/components/` | Komponen UI spesifik fitur |
| **Presentation** | `presentation/stores/` | State management via **Pinia** |
| **Domain** | `domain/use-cases/` | Logika bisnis client-side — agnostik terhadap API & framework |
| **Data** | `data/repository/` | Implementasi konkret repository (memanggil Remote Source) |
| **Data** | `data/source/` | Axios HTTP request ke backend API |
| **Data** | `data/mappers/` | Pemetaan data dari format API ke domain entity |

### 2.3 Dependency Injection (DI) Manual — Aturan Wajib

Semua dependensi dikelola secara terpusat di **`src/core/di/di.js`**.

> **ATURAN AGENT**: Setiap Use Case atau Repository baru **WAJIB** didaftarkan di `di.js` sebelum bisa digunakan di Pinia Store atau komponen Vue. Kegagalan mendaftarkan di sini adalah penyebab paling umum error `is not a function` atau `undefined`.

Pola penambahan:
```javascript
// 1. Import class baru
import { CreateCategoryUseCase } from "../../features/budgeting/domain/use-cases/CreateCategoryUseCase";

// 2. Buat singleton instance
export const createCategoryUseCase = new CreateCategoryUseCase(budgetRepository);
```

### 2.4 Standar Penanganan Response (Either Pattern) — Aturan Wajib

Komunikasi antar layer menggunakan pola **Either** (`right` untuk sukses, `left` untuk gagal).

> **ATURAN AGENT**: **JANGAN** memanggil `.isRight()` atau `.isLeft()` sebagai fungsi. Ini akan menyebabkan runtime error. Lakukan pengecekan properti secara langsung:

```javascript
const result = await createCategoryUseCase.execute(name, icon);

if (result.right) {
  // Sukses — data ada di result.right
  console.log(result.right);
} else {
  // Gagal — pesan error ada di result.left.message
  console.error(result.left.message);
}
```

---

## 3. STANDAR UI/UX & DESAIN SISTEM

Aplikasi ini mengutamakan visual premium dan kemudahan interaksi.

### 3.1 Komponen Global

Selalu prioritaskan penggunaan komponen UI yang sudah terdaftar secara global sebelum membuat komponen baru:
- **`DropdownSelect.vue`** — Untuk semua dropdown pilihan (kategori, tipe limit, dll.)
- **`BaseModal.vue`** — Pembungkus semua modal dialog

### 3.2 Responsif & Layout Aman

- Gunakan `max-h-[85vh] overflow-y-auto` pada konten modal agar scroll internal tersedia dan konten tidak terpotong.
- Gunakan `size="2xl"` atau ukuran yang sesuai pada `BaseModal.vue` untuk form dengan banyak kolom.

### 3.3 Loading & Feedback State

Selalu berikan feedback visual yang jelas pada elemen interaktif:
- Tombol submit: `disabled` saat loading + ganti teks menjadi `"Menyimpan..."`.
- Gunakan variabel reaktif `isLoading`, `isSubmitting`, `isCreating` sesuai konteks.

---

## 4. INTEGRASI STATE & FITUR UTAMA (STATE MANAGEMENT)

### 4.1 Budget Store (`useBudgetStore.js`)

State management terpusat untuk seluruh fitur keuangan. Fungsi-fungsi utama:

| Action | Deskripsi |
|---|---|
| `fetchDashboardSummary()` | Mengambil ringkasan bulanan dari `/budget/summary` |
| `fetchAllCategories()` | Mengambil semua kategori (global + kustom user) — hasil di-cache |
| `createCategory(name, icon)` | Membuat kategori kustom baru, lalu otomatis me-refresh `categoriesList` |
| `fetchPockets()` | Mengambil daftar kantong budget user |
| `upsertPocket(data)` | Membuat atau memperbarui satu kantong |
| `deletePocket(categoryId)` | Menghapus kantong |
| `bulkSetupPockets(data)` | Setup massal kantong (onboarding / manajemen) |
| `updateKeywords(categoryId, keywords)` | Menyimpan kata kunci klasifikasi AI ke database |
| `submitTransaction(data)` | Catat transaksi baru |
| `fetchTransactions(params)` | List riwayat transaksi dengan pagination & filter |
| `updateTransaction(id, data)` | Perbarui transaksi |
| `deleteTransaction(id)` | Hapus transaksi |
| `fetchMonthlyHistory()` | 🆕 Mengambil seluruh riwayat keuangan bulanan user dari `/budget/history` — hasilnya disimpan di `historyList` |

### 4.2 Manajemen Kantong & Kategori Kustom (`PocketManagementModal.vue`) 🆕

Modal ini adalah antarmuka utama untuk konfigurasi budget user. Fitur yang tersedia:

- **Blueprint Cepat**: Tombol "50-30-20" dan "Mahasiswa Hemat" untuk konfigurasi kantong sekali klik.
- **Form Kantong**: Menambah/menghapus kantong, memilih kategori, mengatur tipe limit (persentase atau nominal).
- **Pembuatan Kategori Kustom**: Tombol "Buat Kategori Kustom Sendiri" membuka form inline untuk membuat kategori baru dengan nama dan emoji icon. Setelah berhasil dibuat, kategori langsung muncul di dropdown dan otomatis ditambahkan sebagai kantong baru.

### 4.3 Alur Otorisasi & RBAC (`authStore.js`)

- `UserEntity` menyimpan `role` dan array `permissions`.
- `authStore.js` menyediakan getter `isAdmin` dan method `hasPermission(module_name)`.
- Router Guard membaca `meta.requiresAdmin` atau `meta.requiredPermission` sebelum mengizinkan navigasi.

---

## 5. PERUBAHAN & FITUR YANG SUDAH DILAKUKAN (CHANGELOG)

| # | Fitur / Perbaikan | Deskripsi Singkat |
|---|---|---|
| 1 | **Kategori Kustom User** | Ditambahkan `CreateCategoryUseCase.js`, endpoint baru `POST /budget/categories`, dan form inline di `PocketManagementModal.vue`. User bisa membuat kategori kantong sendiri dengan emoji + nama. |
| 2 | **Refactoring `PocketManagementModal.vue`** | Menggantikan `BudgetSetupModal.vue` yang usang. Integrasi `DropdownSelect.vue`, sistem blueprint cepat (50-30-20 & Mahasiswa Hemat), form kategori kustom. Dihapus: input "Biaya Sewa/Kos" dan "Target Tabungan (%)" karena kini dikelola lewat sistem Pocket. |
| 3 | **Dashboard Hanya Tampilkan Pocket User** | Perbaikan endpoint summary agar hanya mengembalikan kategori yang ada di `pocketsSnapshot` (kantong user), bukan semua kategori sistem. |
| 4 | **Perbaikan Runtime Error (Either Pattern)** | Mengoreksi bug `.isRight()` di seluruh store dan komponen. Pengecekan kini menggunakan `.right` dan `.left` secara langsung. |
| 5 | **Optimasi Bundle Chunking** | Library vendor (Vue, Pinia, Axios) dipisah ke chunk terpisah di `vite.config.js` untuk mempercepat muat halaman pertama. |
| 6 | **Pendaftaran DI Lengkap** | `di.js` diperbarui dengan `CreateCategoryUseCase` dan semua Use Case terbaru lainnya. |
| 7 | **Perbaikan Bug `createCategory()` di Repository** | Method `createCategory()` hilang dari `BudgetRepository.js` frontend sehingga klik tombol tidak mengirim request ke backend. Diperbaiki dengan menambahkan method tersebut di antara `getCategories()` dan `getSpendingTrend()`. |
| 8 | **Halaman Riwayat Keuangan Bulanan** | Halaman baru `FinancialHistoryPage.vue` di rute `/app/history` (permission: `budgeting`). Menampilkan Bar Chart perbandingan bulanan (Rencana / Aktual / Tabungan) dan Akordion kartu per bulan yang memuat rincian kantong dari `pocketsSnapshot`. Menu "Riwayat Bulanan" dengan `ChartBarIcon` ditambahkan ke `Sidebar.vue`. |
| 9 | **`GetMonthlyHistoryUseCase.js` & DI** | Use Case baru didaftarkan di `di.js`. State `historyList`, `isLoadingHistory`, dan action `fetchMonthlyHistory()` ditambahkan ke `useBudgetStore.js`. Data source `getMonthlyHistory()` ditambahkan ke `BudgetRemoteSource.js` dan `BudgetRepository.js`. |
| 10 | **Perbaikan Caching API Pocket** | Mengatasi aggressive browser caching pada data `GET /budget/pockets` dengan menambahkan header `Cache-Control: no-cache` secara global di `apiClient.js`. Serta mengimplementasikan strict unmounting (`v-if`) pada `PocketManagementModal.vue` agar state modal ter-reset total saat ditutup. |
| 11 | **Perbaikan Bug Update Transaksi & Sinkronisasi Sejarah Bulanan** | Bug format tanggal `"2026-05-31 00:00:00"` pada form `TransactionForm.vue` telah diperbaiki agar menggunakan `.substring(0, 10)` absolut tanpa mencari huruf 'T'. Disuntikkan pula fitur interaktif `Progress Bar` dan teks `Rp Terpakai / Rp Limit` pada daftar riwayat kantong bulan lalu (`FinancialHistoryPage.vue`). Terakhir, mengembalikan fungsi `updateTransaction` yang sempat terhapus di Pinia Store `useBudgetStore.js`. |
| 12 | **Perbaikan Bug Re-Opening Modal Atur Pemasukan** | Memperbaiki bug di mana `BudgetSetupModal.vue` tiba-tiba tertutup/terbuka kembali setelah tombol simpan ditekan. Penyebabnya adalah mutasi state global `isLoadingSummary` di `useBudgetStore.js` yang memicu re-render (`v-if`) di parent page `BudgetDashboardPage.vue`. Solusinya adalah menggunakan local state `isSubmitting` di modal tersebut untuk melacak proses loading pengiriman form. |
| 13 | **Perbaikan Kalkulasi Total Persentase di Pengelolaan Kantong** | Memperbaiki kalkulasi total persentase terpakai (`totalPercentage`) di `PocketManagementModal.vue` agar nominal limit pada kantong juga ikut dikonversi secara dinamis ke bentuk persentase terhadap gaji pengguna, sehingga total persentase yang ditampilkan akurat. |

---

## 6. RENCANA PENGEMBANGAN MASA DEPAN (FUTURE DEVELOPMENT)

1. **PWA Quick Input Widget**: Widget input cepat berbasis AI di layar utama ponsel (PWA) agar pengguna dapat mencatat pengeluaran tanpa membuka dashboard.
2. **Visualisasi Alokasi vs Realisasi**: Grafik dinamis yang membandingkan alokasi persentase kantong dengan realisasi pengeluaran bulan berjalan secara real-time.
3. **AI Categorization Approval Prompt**: Dialog konfirmasi setelah input teks AI — menampilkan hasil parsing (kategori, nominal, catatan) sebelum disimpan permanen.
4. **Handbook / Panduan Fitur In-App**: Sistem onboarding atau halaman dokumentasi interaktif yang menjelaskan setiap fitur Kainest kepada pengguna baru (opsi: guided tour via Driver.js, halaman `/app/handbook`, atau tooltip kontekstual).
5. **Pembatasan Query Default Riwayat (6/12 Bulan)**: Endpoint `GET /budget/history` saat ini mengembalikan seluruh riwayat all-time. Perlu ditambahkan parameter query opsional (misal `?limit=12`) agar default hanya 6 atau 12 bulan terakhir untuk efisiensi dan keterbacaan.
6. **Filter Dropdown Tahun/Bulan di Halaman Riwayat**: Menambahkan komponen filter interaktif (dropdown atau range picker) di `FinancialHistoryPage.vue` agar user dapat memfilter data riwayat berdasarkan tahun atau rentang bulan tertentu.
7. **Integrasi WhatsApp Bot (Kenin WA Bot) - Sisi Frontend**: Halaman pengaturan integrasi WhatsApp di Profile UI untuk memfasilitasi "Pairing" (menghubungkan nomor HP WhatsApp pengguna dengan akun Kainest) serta mengelola kata kunci (*keywords*) kategori untuk mendukung pencatatan transaksi yang efisien (Hybrid Routing).

