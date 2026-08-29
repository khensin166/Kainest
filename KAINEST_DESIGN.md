# Kainest Design System
**Versi:** 2.0 · **Last Updated:** 2026-08-29

---

## Ringkasan Arsitektur Tema

Kainest mendukung **tiga varian tema**. Pergantian tema hanya cukup dilakukan dengan menambahkan/menghapus kelas CSS di elemen `<html>`:

| Kelas HTML | Tema | Deskripsi |
|---|---|---|
| *(tidak ada kelas)* | `Light` | Mode terang default |
| `.dark` | `Dark` | Mode gelap standar (Tailwind dark mode) |
| `.theme-factory` | `Factory` | **Terminal War Room** — dokumentasi di file ini |

> **Penting:** Tema `Factory` adalah **ekstensi**, bukan pengganti. Variabel CSS yang tidak di-override oleh `.theme-factory` akan secara otomatis *fallback* ke nilai dari tema `Dark`.

---

## Filosofi Desain: Factory

> *"Terminal war room at midnight. Factory is a stark black control surface where a single white card lands like a flashlit dispatch — the only object in the room is the work itself."*

Factory beroperasi sebagai terminal war room: kanvas hitam pekat, tipografi Geist weight-400 dengan negative tracking, dan ruang negatif yang murah hati agar dua aksen fungsional — **Signal Orange** dan **Metric Green** — bicara di atas kebisingan. Gerakan khas adalah *light card floating on near-black ground* (`#eeeeee` panels di atas `#101010` canvas), menciptakan kontras *figure/ground* yang tegas daripada elevasi lembut.

Hampir semua interaksi dijalankan oleh permukaan monokrom; warna kromatis **hanya** dicadangkan untuk status data *live* dan pulsa status, **bukan** dekorasi. Komponen duduk datar dengan radius minimal, border tipis 1px, dan nol ketergantungan shadow — desain mendapatkan kedalamannya melalui kontras dan irama spasi, bukan blur atau glow.

### Tiga Aturan Utama

1. **Kedalaman via Kontras, Bukan Bayangan**
   Tidak ada `box-shadow`, tidak ada `backdrop-blur`. Tumpukan elemen dibedakan murni dari warna — kanvas hitam pekat `#101010` vs. permukaan panel `#1d1a18`.

2. **Data over Decoration**
   Warna cerah (*vibrant*) **dilarang** sebagai dekorasi. Warna hanya digunakan sebagai "sinyal" fungsional:
   - 🟢 Hijau (`#a0ca92`) = pemasukan / positif / Metric Green
   - 🟠 Orange (`#ee6018`) = peringatan / negatif / Signal Orange
   - ⚪ Putih (`#fafafa`) = aksi utama / tombol CTA (monochrome)

3. **Presisi di Setiap Tepi**
   Border-radius moderat (`4px` tombol, `10px` kartu). Tidak ada sudut terlalu bulat (`rounded-full` di kartu dilarang). Elemen harus terasa seperti *widget instrument*, bukan gelembung mainan.

---

## Tipografi

| Peran | Font | Weight | Style |
|---|---|---|---|
| Body, Tombol, Heading | `Geist` | 400 (Normal) | Tegak |
| Label, Status, Metrik | `Geist Mono` | 400 | `uppercase`, `tracking-tight` |

### Cara Implementasi Font Geist
Tambahkan di `index.html` atau `main.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap');

.theme-factory {
  --font-sans: 'Geist', ui-sans-serif, system-ui;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
}
```

---

## Token Warna (CSS Variables)

### Palet Primitif (Referensi Warna)

| Nama | Hex | Token | Peran |
|---|---|---|---|
| Obsidian Canvas | `#101010` | `--color-obsidian-canvas` | Latar utama halaman, footer — kekosongan yang menjadi ukuran segalanya |
| Carbon Lift | `#1d1a18` | `--color-carbon-lift` | Permukaan gelap terangkat, nav wells, isian tombol — satu tingkat di atas canvas |
| Ash Stroke | `#3d3a39` | `--color-ash-stroke` | Border garis rambut, outline tombol ghost, garis pemisah |
| Graphite Mid | `#4d4947` | `--color-graphite-mid` | Isian mid-tone untuk badan chart, permukaan sekunder |
| Warm Granite | `#8a8380` | `--color-warm-granite` | Teks body muted, copy sekunder, label tidak aktif |
| Pale Stone | `#b8b3b0` | `--color-pale-stone` | Teks tersier, eyebrow section, copy pendukung redup |
| Bone | `#eeeeee` | `--color-bone` | Teks utama, permukaan kartu terang |
| Chalk | `#fafafa` | `--color-chalk` | Isian tombol emphasis tinggi, permukaan netral terangkat |
| Signal Orange | `#ee6018` | `--color-signal-orange` | Aksen dekoratif oranye untuk ikon, tanda, dan detail grafis kecil |
| Metric Green | `#a0ca92` | `--color-metric-green` | Aksen dekoratif hijau untuk ikon, tanda, dan detail grafis kecil |

### Token Semantik (Mapping ke Palet)

```css
:root.theme-factory {
  /* Brand — Monochrome (interaksi via permukaan monokrom) */
  --color-brand-primary:       #fafafa;   /* Chalk */
  --color-brand-primary-hover: #eeeeee;   /* Bone */
  --color-brand-text:          #101010;   /* Obsidian Canvas — teks di atas tombol putih */
  --color-brand-muted:         #b8b3b0;   /* Pale Stone */

  /* AI Violet — HANYA untuk fitur/ikon AI spesifik */
  --color-ai-violet:           #8b5cf6;
  --color-ai-violet-soft:      rgba(139, 92, 246, 0.10);

  /* Surface */
  --color-surface-page:        #101010;   /* Obsidian Canvas */
  --color-surface-card:        #1d1a18;   /* Carbon Lift */
  --color-surface-input:       #161412;
  --color-surface-hover:       #272320;

  /* Border */
  --color-border-default:      #3d3a39;   /* Ash Stroke */

  /* Text */
  --color-text-primary:        #eeeeee;   /* Bone */
  --color-text-secondary:      #b8b3b0;   /* Pale Stone */
  --color-text-muted:          #8a8380;   /* Warm Granite */
  --color-text-faint:          #4d4947;   /* Graphite Mid */

  /* Status */
  --color-status-success:      #a0ca92;   /* Metric Green */
  --color-status-warning:      #ee6018;   /* Signal Orange */
  --color-status-danger:       #ef4444;
  --color-status-info:         #60a5fa;
}
```

---

## Perilaku Global saat `.theme-factory` Aktif

Tambahkan di `src/css/style.css` atau sebuah file `theme-factory.css`:

```css
/* Matikan efek dekorasi global saat Factory aktif */
.theme-factory * {
  box-shadow: none !important;
  backdrop-filter: none !important;
}

/* Override komponen Tailwind bermasalah di Factory */
.theme-factory .shadow,
.theme-factory .shadow-sm,
.theme-factory .shadow-md,
.theme-factory .shadow-lg,
.theme-factory .shadow-xl {
  box-shadow: none !important;
}

/* Ganti efek ring (focus) jadi border tegas */
.theme-factory input:focus,
.theme-factory textarea:focus,
.theme-factory select:focus {
  outline: none;
  border-color: var(--color-brand-primary) !important;
  box-shadow: none !important;
}
```

---

## Panduan Komponen

### Tombol

```html
<!-- PRIMARY: Background Chalk, teks Obsidian (monochrome!) -->
<button class="bg-brand-primary hover:bg-brand-primary-hover text-brand-text">Simpan</button>

<!-- SECONDARY: Border 1px, transparan -->
<button class="bg-transparent border border-border-default text-text-primary hover:bg-surface-hover">Batal</button>
```

### Kartu / Panel

```html
<div class="bg-surface-card border border-border-default rounded-lg p-4">
  <!-- Konten kartu -->
</div>
```

### Label (Gaya Terminal)

```html
<label class="text-xs font-mono uppercase tracking-tight text-text-muted">
  Batas Pengeluaran
</label>
```

### Sidebar Navigation (Active State)

```html
<!-- Active: monochrome highlight dengan border kiri tegas -->
<a class="bg-surface-hover text-text-primary border-l-2 border-text-primary">
  <icon class="text-text-primary" />
  Menu Aktif
</a>

<!-- Inactive: default muted -->
<a class="text-text-secondary hover:text-text-primary hover:bg-surface-hover">
  <icon class="text-text-muted group-hover:text-text-primary" />
  Menu Lain
</a>
```

---

## Do's & Don'ts

| ✅ DO | ❌ DON'T |
|---|---|
| Gunakan `border` 1px tipis untuk membedakan elemen | Gunakan `shadow-md`, `shadow-lg`, atau `drop-shadow` |
| Gunakan warna secara semantik (Hijau=positif, Orange=warning) | Gunakan gradasi warna untuk tombol CTA |
| Beri ruang bernafas (`gap-8`, `py-12`) antar section | Padatkan elemen dengan spacing kecil |
| Font `Geist` untuk body, `Geist Mono` untuk label & angka | Campur font selain `Geist` dan `Geist Mono` |
| Gunakan variabel CSS dari `theme-variables.css` | Hardcode warna hex langsung di komponen |
| Batasi penggunaan ungu HANYA untuk indikator fitur AI | Gunakan ungu sebagai brand color universal |

---

## Panduan Visual Khusus

### 1. Halaman Otentikasi (Auth Pages)
Semua halaman otentikasi (Login, Register, Lupa Sandi, Reset Sandi, Get Started) menggunakan filosofi **"Tabrak Warna" (High-Contrast Split-Screen)**:
- **Panel Kiri (Branding):** Harus selalu dikunci (*hardcode*) dalam estetika gelap (`bg-slate-900`) dan teks `text-white` terlepas dari tema yang aktif. Panel ini wajib menyertakan efek *ambient blobs* dengan warna konstan (`bg-violet-500` dan `bg-fuchsia-400`) menggunakan `mix-blend-screen opacity-40 blur-3xl`. Pengecualian: Hindari *arbitrary values* Tailwind (`bg-[#...]`) pada *mix-blend* jika menyebabkan *rendering bug*; gunakan standar utility Tailwind (contoh: `violet-500`, `fuchsia-400`).
- **Panel Kanan (Form):** Responsif sepenuhnya terhadap *ThemeToggle*. Di mode *Light*, panel ini putih terang (`bg-surface-page`), menciptakan tabrakan visual ekstrem dengan panel kiri. Di mode *Dark* atau *Factory*, panel kanan menyatu mulus dalam estetika monokrom gelap.
