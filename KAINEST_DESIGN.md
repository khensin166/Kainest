# Kainest Design System

**Versi:** 4.4 · **Last Updated:** 2026-08-30

> Dokumen ini mendeskripsikan sistem yang **benar-benar ada di kode**.
> Kalau ada yang tertulis di sini tapi tidak tercermin di `src/`, itu bug pada
> dokumen, bukan pada kode.
>
> **Koreksi v3.0 → v4.0:** v3.0 menyatakan tema "Factory" tidak pernah
> diimplementasikan. Itu **keliru** — Factory ada di `theme-variables.css` dan
> aktif sebagai tema ketiga di `ThemeToggle`. Bagian Factory dikembalikan di sini.

---

## Tiga lapis

| Lapis | Lokasi | Isi |
|---|---|---|
| **1. Token** | `src/css/theme-variables.css` (warna, per tema) · `src/css/style.css` blok `@theme` (radius, font, tinggi kontrol, jembatan token) | Satu-satunya tempat nilai desain didefinisikan |
| **2. Primitif** | `src/ui/` | 13 komponen + peta ikon. Satu-satunya tempat *bentuk* diputuskan |
| **3. Domain** | `src/features/*/presentation/components/` | Dibangun **di atas** lapis 2, tidak menyentuh utility mentah |

Halaman demo: **`/dev/ui`** (hanya saat `npm run dev`).

---

## Tiga tema

Pergantian tema menambah kelas di elemen `<html>`. Sumbernya **satu**:
`src/composables/useTheme.js`, dipanggil di `App.vue` agar berlaku di seluruh
halaman — sebelumnya `useColorMode` hidup di dalam `ThemeToggle`, sehingga tema
tersimpan tidak diterapkan pada halaman yang tidak memuat komponen itu.
`ThemeToggle` adalah *dropdown* pemilih (bukan tombol siklus), memakai
`DropdownMenuRadioGroup` dari reka-ui.

| Kelas | Tema | Karakter |
|---|---|---|
| *(tanpa kelas)* | **Light** | Permukaan terang, brand ungu |
| `.dark` | **Dark** | Permukaan navy-abu, brand ungu |
| `.dark.theme-factory` | **Factory** | Kanvas nyaris hitam hangat, **brand monokrom** |
| `.dark.theme-spidey` | **Spidey “Web Strike”** | Hitam hangat, biru elektrik untuk aksi, merah Marvel **murni** untuk bar, aksen, dan grafik |

### Filosofi Factory

> *"Terminal war room at midnight."*

Kanvas `#101010` dengan panel `#1d1a18`, tipografi Geist, ruang negatif murah hati.
Aksi utama memakai permukaan **monokrom** (tombol putih `#fafafa`), bukan ungu —
warna kromatis dicadangkan untuk sinyal data, bukan dekorasi.

**Ini pengecualian yang disengaja:** `brand-primary` sengaja berbeda di Factory.
Yang **wajib** konsisten lintas tema adalah status, chart, dan warna AI.

Palet primitif Factory (`--color-obsidian-canvas`, `--color-carbon-lift`,
`--color-signal-orange`, dst.) hanya ada di tema ini — itu nilai referensi, bukan
token semantik, dan dikecualikan dari aturan paritas.

### Filosofi Spidey — "Web Strike"

**Hitam hangat, bukan medan biru.** Kanvas `#09090B`, panel `#17161A` dengan sedikit
kehangatan kemerahan. Ini iterasi ketiga, dan dua yang pertama gagal karena alasan
yang terukur:

| Iterasi | Kenapa gagal |
|---|---|
| v1 `#0A0E1A` navy nyaris hitam | Terlalu desaturasi — terbaca sebagai dashboard gelap generik, tanpa identitas |
| v2 `#16306F` medan biru jenuh | Angka melelahkan dibaca, dan merah Marvel hanya **2.76:1** di atasnya — harus diencerkan sampai berhenti terasa merah Marvel |

**Merah Marvel `#E62429` dipakai MURNI**, tidak dicerahkan. Justru latar hitam yang
memberinya ruang: 3.99:1 — cukup untuk bar progres, aksen, dan garis grafik
(ambang grafis 3:1), sementara teks merah memakai `status-danger-text` `#FF6B6F` (6.50).

**Aksi memegang biru elektrik `#4DA3FF` dengan teks gelap** (7.58:1). Pilihan ini juga
terukur: di basis hitam, biru medium dengan teks putih hanya 3.82:1 — yang bekerja
justru biru *terang* dengan teks gelap, dan kebetulan itu pula yang paling menyala.

Merah tetap bukan warna tombol. Di aplikasi keuangan merah sudah berarti bahaya,
overbudget, dan pengeluaran; menjadikannya warna aksi membuat tombol "Simpan" dan
"Hapus" tampak sama — kesalahan yang sama seperti `chart-expense` ungu yang dibuang
di v4.0.

Audit kontras Web Strike: **14 pemeriksaan, 0 gagal.** Dua di ambang justru sesuai
perannya — `text-faint` 3.23 (dekoratif) dan merah murni 3.99 (bar & grafik).


---

## Warna: satu peran, satu keluarga

Nilai boleh menyesuaikan tema; **keluarga warnanya tidak boleh berpindah.**

| Peran | Keluarga | Dipakai untuk |
|---|---|---|
| `--color-status-success` | hijau | pemasukan, aman, berhasil |
| `--color-status-warning` | amber | mendekati batas |
| `--color-status-danger` | merah | overbudget, hapus, gagal |
| `--color-status-info` | biru | informasional netral |
| `--color-ai` | violet `#8b5cf6` | **semua** fitur AI, di ketiga tema |
| `--color-chart-income` | = `success` | grafik pemasukan |
| `--color-chart-expense` | = `danger` | grafik pengeluaran |

Dua perubahan penting di v4.0:

- **`chart-expense` berhenti memakai ungu.** Ungu di Kainest berarti *brand*;
  memakainya untuk "pengeluaran" membuat satu warna punya dua makna.
- **`--color-ai` hadir di ketiga tema.** Sebelumnya `--color-ai-violet` hanya ada
  di Factory dan tidak pernah dipakai, sementara fitur AI memakai warna brand biasa.

Warna status mewarnai **sinyal**, bukan permukaan. Kartu kantong tetap netral;
statusnya muncul lewat titik, bar progres, dan angka persentase. Enam kantong sehat
tidak boleh menjadi enam blok hijau.

Delta 0% tidak ditampilkan — "0% vs bulan lalu" bukan informasi.

**Dilarang** memakai palet statis Tailwind (`text-gray-500`, `bg-violet-500`, …) —
nilainya tidak ikut berganti saat tema berganti.

---

## Kontras — diukur, bukan dikira

Setiap tema baru wajib diaudit rasio kontrasnya sebelum dinyatakan selesai. Audit
Spidey menemukan empat masalah yang tidak terlihat dari melihat layar:

| Temuan | Sebelum | Sesudah |
|---|---|---|
| `text-inverse` di atas tombol brand | 4.23 gagal | `#FFFFFF` → **4.55** |
| `text-muted` di atas kartu | 4.16 gagal | `#8592AD` → **5.65** |
| `text-faint` di atas kartu | 2.35 gagal | `#667490` → **3.76** (dekoratif) |
| `brand-text` Factory | 1.05 — gelap di atas gelap | `#eeeeee` → semantik diperbaiki |

Audit ulang setelah revisi Spider-Verse: **14 pemeriksaan, 0 gagal** — 13 lolos AA
penuh, `text-faint` 3.47 (dekoratif, ambang 3:1).

**Dua token yang mirip tapi beda tugas:**

- `--color-brand-primary` / `--color-status-danger` = warna **PERMUKAAN**
  (isian tombol, bar progres). Dipakai sebagai teks, kontrasnya kurang.
- `--color-brand-text` / `--color-status-danger-text` = warna **TEKS**.
  Varian `link` pada `Button` memakai `brand-text`, bukan `brand-primary`.

**Keterbatasan yang diketahui:** 51 lokasi masih memakai `text-status-danger`
(warna permukaan) sebagai warna teks — rasio ~3.9, lolos untuk ikon dan angka besar
(ambang 3:1) tetapi tidak untuk teks kecil. Ini **bukan** khas Spidey; tema Dark
pun ~4.0. Perbaikannya: ganti ke `text-status-danger-text` pada teks kecil,
dikerjakan per lokasi karena sebagian memang ikon.

---

## Ikon — Material Symbols, satu pintu

Set: **Material Symbols** (Google), di-compile jadi komponen SVG saat build oleh
`unplugin-icons`. Tree-shaken, tanpa request jaringan, tanpa runtime.

Semua ikon lewat **`src/ui/icons.js`** — 76 ekspor dengan nama yang menggambarkan
*makna di Kainest*, bukan nama ikon di pustakanya:

```js
import { IconWallet, IconAi, IconTrendDown } from '@/ui/icons'
```

Mengganti set ikon di kemudian hari cukup mengubah satu berkas itu.

Impor langsung dari `@heroicons/*`, `lucide-vue-next`, atau `~icons/*` **ditolak lint**
(kecuali `icons.js` sendiri, yang memang sumbernya).

**Emoji tidak boleh berdiri sendiri sebagai ikon** — rendering berbeda tiap OS, tidak
bisa diwarnai. Tapi emoji **di dalam kalimat adalah bagian dari teks** dan tidak
dilarang (`Halo, Kenan 👋`, `🤖 Analisis AI`).

Inline `<svg>` hanya boleh untuk hal yang bukan ikon: **logo merek** (Google, GitHub,
WhatsApp) dan definisi `<Spinner>`.

---

## Momen kejutan (khas tema Spidey)

Dua GIF Spider-Man dipakai sebagai kejutan, bukan dekorasi. Semua aturannya
terkumpul di `src/composables/useCelebration.js`, sehingga pemanggil cukup menulis
`celebrate('spidey-theme')` tanpa perlu tahu syaratnya.

| Momen | GIF | Ukuran | Posisi | Frekuensi |
|---|---|---|---|---|
| Beralih ke tema Spidey | turun terbalik memegang jaring | 1,4 MB | menggantung di **tepi atas**, dekat tombol tema | tiap kali beralih |
| Kantong pertama dibuat | berayun | 137 KB | kanan bawah | sekali seumur akun |
| Struk Split Bill selesai diurai | berayun | 137 KB | kanan bawah | tiap struk |

**Tiga syarat, diperiksa di satu tempat:**

1. **Tema aktif harus `spidey`.** Ini kejutan khas tema itu; tema lain tetap tenang.
2. **`prefers-reduced-motion: reduce` → tidak dirender sama sekali.**
3. Momen bertanda `once` ditandai di `localStorage`.

**Kenapa tepi atas untuk GIF yang turun.** Alasannya fisik, bukan selera: karakternya
turun sambil memegang jaring, jadi menempelkannya di tepi atas membuat jaring itu
seolah terikat di luar layar. Ditaruh di tengah atau bawah, jaringnya menggantung ke
ketiadaan. Dan karena posisinya tepat di bawah tombol yang baru diklik, gerakannya
terbaca sebagai **respons atas aksi**, bukan animasi yang muncul entah dari mana.

**Tidak pernah untuk kondisi gagal.** Overbudget, error, dan pembayaran tertunggak
tidak mendapat kejutan. Momen buruk di aplikasi keuangan butuh empati, bukan lelucon.

**Muat malas.** GIF di-`import` biasa dari `src/images/`; Vite memisahkannya jadi
aset ter-hash karena di atas 4 KB, sehingga **hanya URL-nya yang masuk bundle** —
1,4 MB baru diunduh saat `<img>` benar-benar dirender. Terverifikasi di hasil build:
kedua GIF ada sebagai berkas terpisah, dan chunk yang merujuknya hanya 205 KB.

---

## Radius — hanya 3 nilai + full

| Token | Nilai | Untuk |
|---|---|---|
| `rounded-sm` | 6px | badge, chip, tag |
| `rounded-md` | 10px | tombol, input, select |
| `rounded-lg` | 16px | kartu, modal, panel |
| `rounded-full` | — | avatar, pill, dot |

---

## Tipografi

| Peran | Font |
|---|---|
| Body, heading, tombol | **Geist Variable** (`--font-sans`) |
| Label mono, metrik, eyebrow | **Geist Mono Variable** (`--font-mono`) |

Self-hosted lewat `@fontsource-variable/geist`. Skala dikunci `text-xs … text-2xl`.
Angka finansial memakai `tabular-nums`.

---

## Primitif (`src/ui/`)

`Button` · `Badge` · `Card` · `Input` · `Select` · `Switch` · `Tabs` · `Modal`
`Skeleton` · `Spinner` · `PageShell` · `EmptyState` · `StatCard`

- Varian ditulis dengan **CVA**, digabung `cn()` = `clsx` + `tailwind-merge`.
- Perilaku & aksesibilitas dari **reka-ui** (Modal, Select, Switch, Tabs).
- **Tidak dipakai lagi:** daisyUI, HeadlessUI, Heroicons, lucide-vue-next.

---

## Pagar

```bash
npm run lint:design
```

**Tujuh belas aturan**, semuanya level `error`:

| Aturan | Menangkap |
|---|---|
| `no-missing-import` | Identifier `Icon*`/`Spinner` yang dipakai tapi tidak diimpor, dan `import` di luar blok `<script>`. **`vite build` tidak menangkap ini** — SFC compiler mengabaikan teks di luar blok, jadi build hijau tapi aplikasi mati (layar putih) |
| `no-theme-parity-gap` | Token semantik yang tidak ada di semua tema — class jadi kosong di tema itu |
| `no-undefined-token` | Class token yang tidak menghasilkan CSS apa pun |
| `no-direct-icon-import` | Impor ikon di luar `@/ui/icons` |
| `no-static-palette` | 21 palet Tailwind statis yang tidak ikut ganti tema |
| `no-shouty-label` | `uppercase` + `tracking-widest` |
| `no-extra-weight` | `font-black` / `font-extrabold` |
| `no-decor-gradient` | Gradien dekoratif |
| `no-offscale-radius` | Radius di luar skala |
| `no-arbitrary-text` | `text-[10px]` dan sejenisnya |
| `no-emoji-icon` · `no-emoji-attr` | Emoji berdiri sendiri sebagai ikon, atau lewat prop |
| `no-new-daisyui` | Sisa class daisyUI |
| `no-raw-hex` · `no-shadow-none` · `no-console-log` · `no-alert` | Higiene dasar |

Pengecualian ditulis eksplisit di `scripts/lint-design.mjs` beserta alasannya.
Sebuah pengecualian tanpa alasan adalah utang yang menyamar.

---

## Aturan kerja

1. **Teks UI dibekukan.** Pekerjaan desain mengubah warna, ikon, dan tata letak —
   **bukan kata-kata**. Termasuk kapitalisasi, tanda baca, dan emoji di dalam kalimat.
   Verifikasi dengan mem-*diff* string UI sebelum dan sesudah.
2. **Kode UI baru wajib memakai `src/ui/`.** Tidak ada utility mentah untuk tombol,
   kartu, input, atau modal. Ikon selalu dari `@/ui/icons`.
3. **Kode lama dimigrasi saat disentuh** (strangler).
4. **Setiap perubahan token diperiksa di ketiga tema**, bukan hanya yang sedang aktif.
5. **Verifikasi build setelah setiap perubahan struktural template.** Penghapusan blok
   berbasis regex pernah memutus `</div>` dan memecah build.
6. **Build hijau BUKAN bukti aplikasi hidup. Buka aplikasinya.**
   Komponen Options API tidak punya anchor `<script setup>`; skrip migrasi otomatis
   pernah menaruh `import` di luar blok `<script>` atau melewatkannya sama sekali.
   `vite build` tetap sukses, aplikasi mati saat dibuka. Minimal buka `/`, `/login`,
   `/dev/ui`, dan satu halaman di balik autentikasi sebelum menyatakan selesai.
