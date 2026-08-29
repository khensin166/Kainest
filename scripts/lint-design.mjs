#!/usr/bin/env node
/**
 * Pagar design system Kainest.
 *
 * level "error" -> CI GAGAL. Dipakai untuk aturan yang sudah bersih;
 *                  tugasnya mencegah regresi masuk lagi.
 * level "warn"  -> CI LOLOS, tapi dilaporkan. Dipakai untuk utang yang
 *                  masih dimigrasi bertahap (strangler). Naikkan ke "error"
 *                  begitu angkanya menyentuh 0.
 */
import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
import { execSync } from 'node:child_process'

const RULES = [
  { id:'no-shadow-none',  level:'error', ext:['.vue'],
    re:/(?<![-:\w])shadow-none(?![-\w])/g,
    msg:'`shadow-none` adalah default — fosil find-and-replace. Hapus class-nya.' },

  { id:'no-console-log',  level:'error', ext:['.vue','.js'],
    re:/console\.log\s*\(/g,
    msg:'console.log tidak boleh masuk main. Pakai console.error/warn bila perlu.' },

  { id:'no-raw-hex',      level:'error', ext:['.vue'],
    re:/(?:class|:class)="[^"]*#[0-9a-fA-F]{3,8}\b/g,
    msg:'Hex mentah di template. Pakai token dari theme-variables.css.' },

  { id:'no-alert',        level:'error', ext:['.vue','.js'],
    re:/(?<![.\w])alert\s*\(/g,
    msg:'alert() native. App punya vue3-toastify + GlobalResponseModal.' },

  { id:'no-new-daisyui',  level:'error',  ext:['.vue'],
    re:/class="[^"]*\b(?:btn|btn-(?:sm|xs|lg|ghost|primary|secondary)|toggle|input-bordered|select-bordered)\b/g,
    msg:'Class daisyUI. daisyUI sudah dicabut. Jangan pakai lagi.' },

  { id:'no-static-palette',level:'error', ext:['.vue'],
    re:/\b(?:text|bg|border|from|to|via)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    msg:'Warna statis Tailwind tidak ikut dark mode. Pakai token semantik.' },

  { id:'no-arbitrary-text',level:'error', ext:['.vue'],
    re:/\btext-\[\d+(?:px|rem)\]/g,
    msg:'Ukuran font arbitrer. Pakai skala text-xs..text-2xl.' },

  { id:'no-offscale-radius',level:'error',ext:['.vue'],
    re:/\brounded-(?:2xl|3xl|\[[^\]]+\])/g,
    msg:'Radius di luar skala (sm/md/lg/full).' },

  { id:'no-shouty-label', level:'error', ext:['.vue'],
    re:/class="[^"]*\buppercase\b[^"]*\btracking-(?:wide|wider|widest)\b|class="[^"]*\btracking-(?:wide|wider|widest)\b[^"]*\buppercase\b/g,
    msg:'Label UPPERCASE + tracking lebar. Tic dashboard generik, bukan hierarki.' },

  { id:'no-extra-weight', level:'error', ext:['.vue'],
    re:/\bfont-(?:extrabold|black)\b/g,
    msg:'Berat font berlebihan. Hierarki lewat ukuran dan warna, bukan menebalkan.' },

  { id:'no-decor-gradient', level:'error', ext:['.vue'],
    re:/\bbg-gradient-to-[a-z]{1,2}\b/g,
    msg:'Gradien dekoratif. Kedalaman lewat kontras permukaan, bukan gradien.' },

  { id:'no-http-in-component', level:'error', ext:['.vue'],
    re:/from\s*['"]axios['"]/g,
    msg:'Komponen tidak boleh memanggil HTTP. Pindahkan ke data/source/ dan panggil lewat store.' },

  { id:'no-direct-icon-import', level:'error', ext:['.vue','.js'],
    re:/from\s*['"](?:@heroicons\/[^'"]*|lucide-vue-next|~icons\/[^'"]*)['"]/g,
    msg:'Ikon harus lewat peta terpusat: import { IconX } from \'@/ui/icons\'.' },

  { id:'no-emoji-attr', level:'error', ext:['.vue'],
    re:/\b(?:icon|emoji|symbol)="[^"]*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}][^"]*"/gu,
    msg:'Emoji dikirim lewat atribut komponen. Pakai komponen ikon.' },

  { id:'no-emoji-icon',   level:'error',  ext:['.vue'],
    re:/>\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️\s]+\s*</gu,
    msg:'Emoji BERDIRI SENDIRI sebagai ikon. Pakai komponen ikon dari @/ui/icons. (Emoji di dalam kalimat = bagian dari teks, tidak dilarang.)' },
]

/**
 * Pengecualian SADAR. Bukan utang — keputusan desain yang sudah diambil.
 *   ValentinePage : halaman easter-egg, sengaja di luar design system.
 *   *.icon fallback: emoji di sini adalah DATA USER (kantong punya field "Ikon (Emoji)").
 */
const EXEMPT = [
  { rule: 'no-emoji-icon',    file: /ValentinePage\.vue$/,        why: 'easter egg, sengaja jenaka' },
  { rule: 'no-static-palette',file: /ValentinePage\.vue$/,        why: 'palet pink khas halaman ini' },
  { rule: 'no-arbitrary-text',file: /ValentinePage\.vue$/,        why: 'tipografi khas halaman easter egg' },
  // Satu-satunya pengecualian yang tersisa, dan itu disengaja.
  { rule: 'no-http-in-component', file: /SharedSplitPage\.vue$/, why: 'halaman publik tanpa auth — sengaja tidak lewat apiClient' },
  { rule: 'no-direct-icon-import', file: /src\/ui\/icons\.js$/, why: 'berkas peta ikon, memang sumbernya' },
  { rule: 'no-emoji-icon',    line: /\w+\.icon\s*\|\|/,          why: 'emoji pilihan user, bukan ikon UI' },
]
const exempt = (ruleId, file, line) =>
  EXEMPT.some(e => e.rule === ruleId && (e.file ? e.file.test(file) : true) && (e.line ? e.line.test(line) : true))

const files = execSync('git ls-files "src/**/*.vue" "src/**/*.js"', { encoding:'utf8' })
  .split('\n').filter(Boolean)

/**
 * Aturan khusus: token semantik yang dipakai di template tapi tidak pernah
 * dijembatani ke @theme. Class seperti itu TIDAK menghasilkan CSS apa pun —
 * elemennya diam-diam tanpa warna. `bg-brand-surface` sempat begini di 10 tempat.
 */
const themeSrc = readFileSync('src/css/style.css', 'utf8')
const themeStart = themeSrc.indexOf('@theme')
let depth = 0, themeEnd = themeStart
for (let i = themeSrc.indexOf('{', themeStart); i < themeSrc.length; i++) {
  if (themeSrc[i] === '{') depth++
  else if (themeSrc[i] === '}' && --depth === 0) { themeEnd = i; break }
}
const themeBlock = themeSrc.slice(themeStart, themeEnd)
const defined = new Set([...themeBlock.matchAll(/--color-([a-z0-9-]+):/g)].map(m => m[1]))
const TOKEN_PREFIX = /\b(?:bg|text|border|ring|divide|from|to|via|outline|fill|stroke|placeholder|accent|caret|shadow)-((?:brand|surface|border|text|status|chart|accent)-[a-z-]+)/g
const undefinedTokens = new Map()

const counts = {}
const samples = {}
let errors = 0, warns = 0

for (const f of files) {
  const ext = f.slice(f.lastIndexOf('.'))
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')
  if (ext === '.vue') {
    lines.forEach((line, i) => {
      for (const m of line.matchAll(TOKEN_PREFIX)) {
        const base = m[1].replace(/\/\d+$/, '')
        if (defined.has(base)) continue
        if (!undefinedTokens.has(base)) undefinedTokens.set(base, [])
        undefinedTokens.get(base).push(`${f}:${i + 1}`)
      }
    })
  }
  for (const r of RULES) {
    if (!r.ext.includes(ext)) continue
    lines.forEach((line, i) => {
      const t = line.trim()
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return  // baris komentar bukan pelanggaran
      const m = line.match(r.re)
      if (!m) return
      if (exempt(r.id, f, line)) return
      counts[r.id] = (counts[r.id] || 0) + m.length
      ;(samples[r.id] ??= []).push(`${f}:${i + 1}`)
      if (r.level === 'error') errors += m.length; else warns += m.length
    })
  }
}

const pad = (s, n) => String(s).padEnd(n)
console.log('\n  PAGAR DESIGN SYSTEM KAINEST\n')
for (const r of RULES) {
  const n = counts[r.id] || 0
  const tag = n === 0 ? ' OK ' : r.level === 'error' ? 'GAGAL' : 'utang'
  console.log(`  [${pad(tag,5)}] ${pad(r.id,20)} ${pad(n,5)}  ${r.msg}`)
  if (n > 0) {
    for (const s of (samples[r.id] || []).slice(0, 3)) console.log(`            ${s}`)
    const rest = (samples[r.id] || []).length - 3
    if (rest > 0) console.log(`            ...+${rest} lokasi lain`)
  }
}
/**
 * Identifier design-system yang DIPAKAI tapi tidak diimpor.
 *
 * Ini menangkap kelas bug yang lolos dari `vite build`: SFC compiler mengabaikan
 * teks di luar blok <script>, dan komponen Options API tidak punya anchor
 * `<script setup>`. Akibatnya import ikon bisa hilang atau salah tempat —
 * build tetap hijau, aplikasi mati saat dibuka (layar putih).
 * Terjadi pada Sidebar.vue, Tooltip.vue, Header.vue, dan GetStartedPage.vue.
 */
const missingImports = []
for (const f of files.filter(x => x.endsWith('.vue'))) {
  const src = readFileSync(f, 'utf8')
  // Buang komentar sebelum memindai pemakaian identifier — nama modul yang
  // disebut di dalam komentar bukan pemakaian, dan sempat memicu positif palsu.
  const kode = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  const imported = new Set()
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from/g))
    for (const n of m[1].split(',')) { const t = n.trim(); if (t) imported.add(t.split(' as ').pop().trim()) }
  for (const m of src.matchAll(/import\s+([A-Za-z_$][\w$]*)\s+from/g)) imported.add(m[1])
  const used = new Set([...kode.matchAll(/\b(Icon[A-Z][A-Za-z]*|Spinner|PageGuide|pageGuides)\b/g)].map(m => m[1]))
  for (const u of used) {
    if (imported.has(u)) continue
    if (new RegExp(`(?:const|let|function)\\s+${u}\\b`).test(src)) continue
    missingImports.push(`${f}  ->  ${u}`)
  }
  // import di LUAR blok <script> tidak pernah dieksekusi
  const sPos = src.search(/<script[^>]*>/)
  if (sPos > 0) for (const m of src.matchAll(/^import .*$/gm))
    if (m.index < sPos) missingImports.push(`${f}  ->  import di luar blok <script>`)
}
console.log(`  [${missingImports.length === 0 ? ' OK  ' : 'GAGAL'}] ${pad('no-missing-import', 20)} ${pad(missingImports.length, 5)}  Identifier dipakai tapi tidak diimpor / import di luar <script> — build hijau, app mati.`)
for (const m of missingImports) console.log(`            ${m}`)
errors += missingImports.length

/**
 * Paritas tema: sebuah token semantik harus ada di KETIGA tema
 * (:root, :root.dark, :root.theme-factory). Token yang hanya ada di satu tema
 * membuat class-nya kosong di tema lain — persis yang terjadi pada
 * --color-brand-surface yang sempat absen di Factory.
 *
 * Dikecualikan: palet primitif Factory. Itu nilai referensi khas tema tersebut
 * (Obsidian Canvas, Carbon Lift, Signal Orange, ...), bukan token semantik.
 */
const FACTORY_PRIMITIVES = new Set([
  'obsidian-canvas','carbon-lift','ash-stroke','graphite-mid','warm-granite',
  'pale-stone','bone','chalk','signal-orange','metric-green',
])
const varsSrc = readFileSync('src/css/theme-variables.css', 'utf8')
const themeSets = {}
for (const chunk of varsSrc.split(/\n(?=:root)/)) {
  const name = chunk.match(/^:root[^\s{]*/)
  if (!name) continue
  themeSets[name[0]] = new Set([...chunk.matchAll(/--color-([a-z0-9-]+):/g)].map(m => m[1]))
}
const themeNames = Object.keys(themeSets)
const allTokens = new Set(themeNames.flatMap(n => [...themeSets[n]]))
const parityGaps = []
for (const tok of [...allTokens].sort()) {
  if (FACTORY_PRIMITIVES.has(tok)) continue
  const missing = themeNames.filter(n => !themeSets[n].has(tok))
  if (missing.length) parityGaps.push(`--color-${tok}  (hilang di: ${missing.join(', ')})`)
}
console.log(`  [${parityGaps.length === 0 ? ' OK  ' : 'GAGAL'}] ${pad('no-theme-parity-gap', 20)} ${pad(parityGaps.length, 5)}  Token semantik tidak ada di semua tema — class jadi kosong di tema itu.`)
for (const g of parityGaps) console.log(`            ${g}`)
errors += parityGaps.length

const nUndef = [...undefinedTokens.values()].reduce((a, b) => a + b.length, 0)
console.log(`  [${nUndef === 0 ? ' OK  ' : 'GAGAL'}] ${pad('no-undefined-token', 20)} ${pad(nUndef, 5)}  Token dipakai tapi tidak ada di @theme — class tidak menghasilkan CSS.`)
for (const [tok, locs] of undefinedTokens) {
  console.log(`            ${tok}  (${locs.length}x, mis. ${locs[0]})`)
}
errors += nUndef

console.log(`\n  ${errors} pelanggaran (memblokir) · ${warns} utang (dilaporkan)\n`)
process.exit(errors > 0 ? 1 : 0)
