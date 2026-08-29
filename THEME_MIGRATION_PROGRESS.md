# Kainest Theme Migration Progress
**Tujuan:** Migrasi *hardcode* warna Tailwind (mis. `bg-gray-800`, `text-indigo-600`) menjadi alias semantik CSS variable (mis. `bg-surface-card`, `text-brand-primary`) agar kompatibel dengan tema Factory.

**Cara kerja:** Centang setiap fitur/folder setelah selesai direfaktor.

---

## Aturan Migrasi Per Fitur

Sebelum mengerjakan sebuah folder fitur, lakukan hal berikut:
1. Cari semua penggunaan warna Tailwind absolut (`bg-gray-*`, `bg-indigo-*`, `dark:bg-*`, `text-violet-*`) di seluruh file `.vue` dalam folder tersebut.
2. Ganti dengan alias CSS Variable yang sesuai dari `theme-variables.css` (mis. `bg-surface-card`, `text-brand-primary`, `border-border-default`).
3. Pastikan tidak ada *hardcode* warna hex langsung di `<style>` atau `:style="..."`.
4. Verifikasi tampilan di tiga tema: Light, Dark, dan Factory.

---

## Status Migrasi

### 🧩 Komponen Global (`src/components/`)
- [x] `forms/CurrencyInput.vue` — input uang tanpa prefix Rp, format titik ribuan realtime
- [x] `forms/DropdownSelect.vue` — warna semantik selesai
- [x] `forms/Datepicker.vue` — warna semantik selesai
- [x] `modals/` — BaseModal dan turunannya warna semantik selesai
- [x] `layout/` — Sidebar, Navbar, dll. warna semantik selesai

---

### 📦 Fitur (`src/features/`)

| # | Fitur | Folder | Status | Catatan |
|---|---|---|---|---|
| 1 | 💰 Budgeting | `features/budgeting/` | ✅ Done | Semua komponen & pages selesai direfaktor ke alias semantik |
| 2 | 🔐 Auth | `features/auth/` | ✅ Done | Selesai (Login, Register, Forgot, dll) |
| 3 | 👤 Profile | `features/profile/` | ✅ Done | Selesai |
| 4 | ⚙️ Settings | `features/settings/` | ✅ Done | Selesai (Edit Profile, Change Password, Settings Page) |
| 5 | 🔒 Security | `features/security/` | ✅ Done | Tidak ada komponen |
| 6 | 💑 Couple | `features/couple/` | ✅ Done | Selesai (ConnectCoupleForm) |
| 7 | 📝 Notes | `features/notes/` | ✅ Done | Selesai |
| 8 | ✅ Todos | `features/todos/` | ✅ Done | Selesai |
| 9 | 🤖 WaBot | `features/wabot/` | ✅ Done | Selesai |
| 10 | 👑 Admin | `features/admin/` | ✅ Done | Selesai |
| 11 | 💘 Valentine | `features/valentine/` | ✅ Done | Selesai |

---

### 🎨 CSS Global (`src/css/`)
- [x] `theme-variables.css` — Blok `:root.theme-factory` sudah ditambahkan
- [x] `style.css` — Override global Factory (shadow/glass/gradient) sudah ditambahkan
- [x] Font Geist — Pasang via Google Fonts di `index.html`

---

## Legend Status
- ⬜ **Todo** — Belum dikerjakan
- 🔄 **In Progress** — Sedang dikerjakan
- ✅ **Done** — Selesai dan sudah diverifikasi

---

## Catatan Rilis

### v1.0 — 2026-08-29
- Arsitektur tema Factory didokumentasikan di `KAINEST_DESIGN.md`.
- `CurrencyInput.vue` dibuat sebagai komponen terpusat input mata uang Rupiah (tanpa prefix Rp, format titik ribuan langsung muncul saat mengetik).
- `PocketManagementModal.vue` — Input nominal sudah menggunakan `<CurrencyInput />`.
- `theme-variables.css` — Blok `:root.theme-factory` ditambahkan (67 token warna baru).
- `style.css` — Override global `.theme-factory` ditambahkan (shadow, backdrop-filter, gradient dinonaktifkan).
- `BudgetHeroCard.vue` ✅ — Semua hardcode warna Tailwind diganti alias semantik.
- `BudgetCategoryCard.vue` ✅ — statusTheme computed dan template direfaktor ke alias semantik.

### v1.1 — 2026-08-29
- `TransactionForm.vue` ✅ — Input amount (number+Rp) diganti `<CurrencyInput>`, semua warna semantik.
- `BudgetSetupModal.vue` ✅ — Input gaji diganti `<CurrencyInput>`, hapus duplikasi logika format Rupiah, semua warna semantik.
- `TransactionItem.vue` ✅ — amountColorClass, card wrapper, tombol edit/hapus, semua semantik.
- `BudgetDashboardPage.vue` ✅ — Judul, tombol CTA, chart wrapper, error banner, spinner, semua semantik.
