# Kainest Architecture

**Versi:** 1.3 · **Last Updated:** 2026-08-30

> Dokumen ini mendeskripsikan struktur yang **benar-benar ada di kode**, termasuk
> bagian yang belum konsisten. Pendampingnya adalah [KAINEST_DESIGN.md](KAINEST_DESIGN.md)
> yang mengurus tampilan; berkas ini mengurus struktur dan aliran data.

---

## Ringkasan penilaian

Fondasinya **kuat dan tidak biasa untuk proyek seukuran ini** — Clean Architecture
diterapkan konsisten di 9 dari 11 fitur, error dimodelkan sebagai tipe `Either`
dengan hierarki `Failure`, dan ada satu composition root untuk seluruh dependensi.

Kebocoran lapisan yang ditemukan pada audit awal — enam berkas `.vue` yang
memanggil HTTP langsung — **sudah ditutup semua kecuali satu yang disengaja**
(`SharedSplitPage`, halaman publik tanpa autentikasi). Lihat riwayat di bawah.

| Aspek | Nilai | Catatan |
|---|---|---|
| Pemisahan lapisan | **Baik** | data / domain / presentation konsisten di 9 fitur |
| Model error | **Baik** | `Either` + hierarki `Failure` bertipe; exception tidak pernah bocor ke UI |
| Dependency injection | **Baik** | satu composition root di `core/di/di.js` |
| Klien HTTP | **Baik** | 8 dari 9 remote source memakai `apiClient`; 1 (WaBot) sengaja tidak, karena menunjuk server GOWA milik pengguna |
| Kepatuhan lapisan di UI | **Baik** | 5 dari 6 kebocoran ditutup; sisanya disengaja dan dijaga lint `no-http-in-component` |
| Konsistensi kontrak error | **Perlu perbaikan** | 6 store memakai `Either`, 2 store memakai `try/catch` |
| Interface repository | **Baik** | 9 dari 9 fitur berlapis mendeklarasikannya di domain |

---

## Stack

| Lapisan | Teknologi | Versi |
|---|---|---|
| Framework | Vue 3 (Composition API) | ^3.2 |
| Build | Vite | ^7.0 |
| State | Pinia | ^3.0 |
| Routing | Vue Router | ^4.2 |
| HTTP | Axios | ^1.10 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | ^4.0 |
| Primitif UI | reka-ui | ^2.10 |
| Varian komponen | class-variance-authority · clsx · tailwind-merge | — |
| Ikon | Material Symbols via `unplugin-icons` | — |
| Font | Geist + Geist Mono (`@fontsource-variable`) | — |
| Grafik | Chart.js + vue-chartjs | ^4.4 |
| Editor | Editor.js | ^2.31 |
| Notifikasi | vue3-toastify | ^0.2 |
| Realtime | socket.io-client | ^4.8 |
| Utilitas | @vueuse/core · moment · flatpickr · qrcode.vue | — |
| Backend | Hono + Prisma + Better Auth (repo terpisah) | — |

Autentikasi memakai **Better Auth**; token disimpan di `localStorage` atau
`sessionStorage` (tergantung "Remember me") dan disuntikkan oleh interceptor.

---

## Struktur direktori

```
src/
├── core/                     ← lintas fitur, tidak bergantung pada fitur mana pun
│   ├── di/di.js              ← composition root: merakit repository → use case
│   └── error/
│       ├── failure.js        ← hierarki Failure + helper Either (left/right/fold)
│       └── map_failure_to_message.js
│
├── lib/apiClient.js          ← instance Axios tunggal + interceptor
│
├── ui/                       ← design system (lihat KAINEST_DESIGN.md)
│   ├── icons.js              ← peta ikon Material Symbols
│   └── *.vue                 ← 13 primitif
│
├── composables/useTheme.js   ← tema aplikasi-wide
│
├── features/<fitur>/         ← irisan vertikal per domain bisnis
│   ├── data/
│   │   ├── source/           ← panggilan HTTP mentah
│   │   ├── mappers/          ← JSON API → Entity
│   │   └── repository/       ← menangkap error → mengembalikan Either
│   ├── domain/
│   │   ├── entities/         ← bentuk data milik aplikasi
│   │   ├── repository/       ← interface (dependency inversion)
│   │   └── use-cases/        ← satu berkas = satu aksi bisnis
│   └── presentation/
│       ├── stores/           ← Pinia: state + orkestrasi
│       ├── pages/
│       └── components/
│
├── partials/                 ← kerangka aplikasi (Sidebar, Header, widget dashboard)
├── components/               ← komponen bersama lintas fitur
├── layouts/ · pages/ · router.js
```

Tiga belas fitur: `admin`, `auth`, `budgeting`, `couple`, `dashboard`, `notes`,
`notifications`, `profile`, `security`, `settings`, `todos`, `valentine`, `wabot`.
`settings` dan `valentine` hanya punya lapisan `presentation` — `settings` merakit
fitur `profile` dan `security`, `valentine` adalah halaman easter egg mandiri.
Keduanya **wajar**, bukan pelanggaran.

---

## Aliran data — jalur yang benar

```
  Komponen / Halaman
        │  memanggil aksi store
        ▼
  Pinia Store              state reaktif + orkestrasi (loading, cache, sinkronisasi)
        │  memanggil instance dari di.js
        ▼
  Use Case                 satu aksi bisnis, tanpa state
        │
        ▼
  Repository               try/catch → left(Failure) | right(Entity)
        │                  exception BERHENTI di sini, tidak pernah naik ke UI
        ├──► Remote Source ──► apiClient ──► HTTP
        └──► Mapper            JSON API → Entity
```

Contoh nyata (`useBudgetStore.fetchDashboardSummary`):

```js
const result = await getDashboardSummaryUseCaseInstance.execute();
if (result.right) summaryData.value = result.right;
else errorSummary.value = result.left.message;
```

**Kenapa ini bagus:** komponen tidak pernah melihat `axios`, tidak pernah tahu
bentuk JSON API, dan tidak pernah menangani exception. Mengganti backend berarti
mengubah `data/`, bukan `presentation/`.

### Model error

`core/error/failure.js` mendefinisikan hierarki bertipe, bukan sekadar string:

| Tipe | Membawa | Dipakai untuk |
|---|---|---|
| `ServerFailure` | `code` semantik (mis. `TRANSACTION_CLOSED_PERIOD`) | error 4xx/5xx |
| `NetworkFailure` | — | tidak ada koneksi |
| `RateLimitFailure` | `retryAfterSeconds` | terlalu banyak percobaan |
| `IncorrectPasswordFailure` | — | login gagal |
| `GeneralFailure` | — | sisanya |

`left()` / `right()` juga menyediakan `fold(onLeft, onRight)`, jadi store bisa
menangani kedua cabang tanpa `if`.

### Klien HTTP

`src/lib/apiClient.js` — satu instance Axios dengan dua interceptor:

- **Request:** menyuntikkan `Authorization: Bearer <token>` dari `localStorage`
  atau `sessionStorage`.
- **Response:** dua status ditangani berbeda, dan bedanya penting:
  - **401 Unauthorized** → `authStore.logout()`. Token tidak valid, sesi memang harus diakhiri.
  - **403 Forbidden** → **tidak** logout. Pengguna sudah terautentikasi, hanya tidak
    diizinkan — misalnya fitur yang butuh pasangan tertaut, atau halaman khusus admin.
    Ditampilkan lewat modal global dengan pesan dari server.

  Store di-*import* secara dinamis di dalam handler untuk memutus circular dependency.

  > Sebelum 30 Agustus 2026 keduanya sama-sama memicu logout. Akibatnya pengguna yang
  > membuka fitur berpasangan tanpa punya pasangan **terlempar keluar dari aplikasi**
  > tanpa penjelasan. 403 bukan alasan mengakhiri sesi.

---

## Aliran data — jalur yang MEMOTONG

Tinggal satu berkas `.vue` yang memanggil HTTP sendiri, dan itu **disengaja**:

```
  Widget Dashboard ──► axios langsung ──► HTTP        ✗ tanpa interceptor
                       + localStorage.getItem('authToken')
```

| Berkas | Akibat |
|---|---|
| `features/budgeting/presentation/pages/SharedSplitPage.vue` | halaman publik, sebagian wajar |

**Tiga konsekuensi nyata:**

1. **Sesi kedaluwarsa tidak memicu logout.** Interceptor 401/403 tidak berjalan di
   jalur ini, jadi widget hanya gagal diam-diam sementara aplikasi mengira masih login.
2. **Logika token terduplikasi di 5 tempat.** Mengganti cara penyimpanan token
   berarti menyunting lima berkas dan berharap tidak ada yang terlewat.
3. **Bentuk JSON API bocor ke template.** Contoh di `DashboardFeedback.vue`:
   `fb.user?.profile?.avatarUrl || fb.user?.image` — template mengetahui struktur
   respons backend. Ubah backend, template ikut rusak.

**Dua dari enam berkas itu bahkan tidak butuh lapisan baru.** `DashboardWelcome`
memanggil `/budget/summary` dan `DashboardRecentActivity` memanggil
`/budget/transactions?limit=6` — keduanya **sudah tersedia** di
`BudgetRemoteSource` dan sudah punya aksi store (`fetchDashboardSummary`,
`fetchTransactions`). Jadi keduanya menduplikasi jalur yang sudah benar,
bukan mengisi kekosongan.

**Akar masalahnya bukan kemalasan, tapi struktur:** tidak ada fitur `dashboard`.
Widget-widget itu tinggal di `src/partials/`, di luar `src/features/`, sehingga
tidak punya lapisan `data`/`domain` untuk dipanggil. Perbaikannya adalah membuat
`features/dashboard/` dengan pola yang sama seperti fitur lain, bukan menambal
tiap widget.

`wabot/data/sources/WaBotRemoteSource.js` memakai **axios mentah**, tetapi itu
**benar dan bukan pelanggaran**. Ia membuat klien dinamis
(`axios.create({ baseURL: cleanUrl })`) yang menunjuk **server GOWA milik pengguna**
— host berbeda, autentikasi berbeda (`x-api-key`, bukan Bearer token Kainest).
Memaksakan `apiClient` di sini justru akan mengarahkan panggilan ke backend yang
salah. Yang pantas dipertimbangkan hanyalah memberinya interceptor sendiri, bukan
memakai milik Kainest.

---

## Ketidakkonsistenan lain

**Dua kontrak error hidup berdampingan.**

| Store | Pola |
|---|---|
| `authStore`, `useBudgetStore`, `useNoteStore`, `useCoupleStore`, `useProfileStore`, `useSecurityStore` | `Either` |
| `useWaBotStore` (9×), `useGowaStore` (6×) | `try/catch` mentah |

Artinya penanganan error di fitur WaBot tidak mendapat tipe `Failure`, `code`
semantik, maupun `retryAfterSeconds`.

**Sebagian fitur melompati use case.** `profile` dan `todos` memanggil repository
langsung dari store tanpa lapisan use case. Untuk fitur sesederhana itu ini bisa
dibenarkan — tapi keputusannya perlu disadari, bukan kebetulan.

**`core/di/di.js` adalah composition root manual sepanjang 129 baris.** Setiap use
case baru harus didaftarkan dengan tangan. Belum jadi masalah, tapi ini titik
gesekan yang akan tumbuh.

---

## Rekomendasi, berurut menurut dampak

1. **Sambungkan `DashboardWelcome` dan `DashboardRecentActivity` ke `useBudgetStore`
   yang sudah ada.** Nol berkas baru — justru menghapus kode duplikat. Menutup 2 dari
   6 kebocoran sekaligus mengembalikan auto-logout.
1b. **Buat `features/dashboard/`** untuk `system-updates` dan `feedbacks` yang memang
   belum punya lapisan data.
2. **Pindahkan `DropdownNotifications.vue` ke lapisan data.** Komponen ini muncul di
   setiap halaman aplikasi, jadi kebocorannya paling sering dieksekusi.
3. **Samakan kontrak error di `useWaBotStore` dan `useGowaStore`** ke `Either`.
4. **Tambahkan aturan lint `no-http-in-component`** — tolak impor `axios` di berkas
   `.vue`. Tanpa pagar, kebocoran ini akan tumbuh lagi seperti sebelumnya.
5. **Lengkapi interface repository** untuk `budgeting`, `admin`, `wabot`.

Tiga yang pertama bisa diselesaikan dalam satu sesi dan menutup seluruh kebocoran
auto-logout.

---

## Aturan kerja

1. **Komponen tidak boleh mengimpor `axios`.** HTTP hanya di `data/source/`, dan
   selalu lewat `apiClient`.
2. **Template tidak boleh menyentuh bentuk JSON API.** Mapper mengubahnya jadi
   Entity terlebih dahulu.
3. **Repository menangkap semua error** dan mengembalikan `Either`. Exception tidak
   boleh naik ke store maupun komponen.
4. **Fitur baru mengikuti irisan vertikal yang sama**: `data` → `domain` →
   `presentation`, dengan interface repository di `domain/repository/`.
5. **Use case didaftarkan di `core/di/di.js`**, bukan di-*instantiate* di store.

---

## Riwayat perbaikan

### 30 Agustus 2026 — Batch 1

**`DashboardWelcome` dan `DashboardRecentActivity` disambungkan ke `useBudgetStore`.**
Keduanya memanggil endpoint yang sudah tersedia lengkap di lapisan data, jadi ini
menghapus duplikasi, bukan menambah kode. Interceptor 401/403 kembali aktif untuk
dua widget tersebut.

Permintaan HTTP-nya **tidak berubah**:

| Widget | Sebelum | Sesudah |
|---|---|---|
| `DashboardWelcome` | `GET {base}/budget/summary` | `apiClient.get("/budget/summary")` |
| `DashboardRecentActivity` | `GET {base}/budget/transactions?limit=6` | `apiClient.get("/budget/transactions", { params:{ limit:6 } })` |

Tiga hal yang ditemukan saat mengerjakannya, dan tidak akan terlihat tanpa membuka
aplikasinya:

1. **`fetchTransactions()` yang sudah ada tidak boleh dipakai ulang.** Ia menyisipkan
   filter `type` ke query dan menulis ke `transactionsList` milik halaman Riwayat
   Transaksi. Karena itu dibuat aksi terpisah `fetchRecentActivity(limit)` dengan
   state sendiri (`recentTransactions`).
2. **`TransactionEntity` tidak membawa `createdAt`.** Mapper hanya memetakan `date`
   (tanggal transaksi, bisa di-backdate), sementara widget memakai `createdAt` untuk
   waktu relatif. Field itu ditambahkan ke entity dan mapper — aditif, konsumen lama
   tidak terpengaruh.
3. **`TransactionEntity` mengisi `note` dengan `"-"` saat kosong**, dan `"-"` bersifat
   *truthy*. Rantai `t.note || t.categoryName` karena itu tidak pernah sampai ke nama
   kategori, sehingga judul aktivitas berubah jadi "-". Widget kini memeriksanya
   secara eksplisit.

**Interface repository dilengkapi** untuk `budgeting` (21 method), `admin` (2), dan
`wabot` (4). Ketiga implementasi kini `extends` interface-nya.

**Aturan lint `no-http-in-component`** ditambahkan — menolak `import axios` di berkas
`.vue`. Empat pelanggaran yang tersisa terdaftar eksplisit sebagai pengecualian
beserta alasannya di `scripts/lint-design.mjs`, jadi kebocoran tidak bisa bertambah
diam-diam.

### 30 Agustus 2026 — Batch 2

**`features/dashboard/`** dibuat untuk `system-updates` dan `feedbacks`;
**`features/notifications/`** untuk notifikasi header. Keduanya mengikuti irisan
vertikal yang sama: source → mapper → repository (Either) → use case → store.
Tujuh use case baru terdaftar di `core/di/di.js`.

Permintaan HTTP-nya **tidak berubah** — endpoint, method, dan body persis sama:

| Endpoint | Body |
|---|---|
| `GET /system-updates` · `POST /system-updates/sync` | `{}` |
| `GET /feedbacks` · `POST /feedbacks` · `PATCH /feedbacks/:id/visibility` | `{ message, rating }` / `{}` |
| `GET /notifications` · `PATCH /notifications/:id/read` | `{}` |

Satu risiko yang diperhitungkan sebelum mengerjakan: `apiClient` menambahkan header
`Content-Type`, `Cache-Control`, `Pragma`, dan `Expires` yang sebelumnya tidak dikirim
ke ketiga endpoint ini. Kalau CORS backend membatasi `Access-Control-Allow-Headers`,
preflight-nya bisa gagal. **Diuji langsung di browser: tidak terjadi** — ketiganya
termuat normal.

`FeedbackEntity` meratakan `user.profile.displayName` dan `user.profile.avatarUrl`,
sehingga template tidak lagi menyentuh bentuk JSON backend.

Aturan lint `no-http-in-component` kini hanya menyisakan **satu** pengecualian:
`SharedSplitPage.vue`.

### 30 Agustus 2026 — Buku panduan & perbaikan 403

**Interceptor 403 berhenti menendang sesi.** Ini akar dari keluhan "selalu keluar
sendiri": `[401, 403].includes(status)` memperlakukan *forbidden* sama dengan
*unauthenticated*. Kini 403 memunculkan modal global dan sesi dipertahankan.

**Sistem panduan dilengkapi.** `src/config/pageGuides.js` naik dari 7 ke 13 kunci;
seluruh 13 halaman yang fiturnya sudah jadi kini punya tombol Buku Panduan.
Dua perbaikan pada yang sudah ada: panduan `wabot` ternyata sudah ditulis tetapi
tidak pernah dipasang, dan kunci `dashboard` menempel di halaman Kantong Keuangan
sehingga diganti nama jadi `budgeting`.

**Tiga rute stub diberi halaman jujur.** `/app/gallery`, `/app/calendar`, dan
`/app/vault` sebelumnya mengarah ke `Dashboard.vue`, sehingga mengklik menunya
menampilkan Dashboard lagi tanpa penjelasan. Kini memakai `ComingSoonPage.vue`.

**`no-missing-import` diperluas** ke `PageGuide` dan `pageGuides`, serta kini
mengabaikan komentar. Perluasan ini langsung menangkap tujuh berkas yang memakai
`<PageGuide>` tanpa meng-*import*-nya — build tetap hijau, tapi halamannya mati saat
dibuka.
