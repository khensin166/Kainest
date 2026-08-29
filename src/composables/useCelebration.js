/**
 * Momen kejutan Spidey.
 *
 * Semua aturan "boleh muncul atau tidak" terkumpul di sini, supaya komponen
 * pemanggil cukup menulis satu baris dan tidak perlu tahu syaratnya:
 *
 *   celebrate('spidey-theme')
 *
 * Tiga syarat, semuanya diperiksa di sini:
 *   1. Tema aktif harus `spidey` — ini kejutan khas tema itu.
 *   2. `prefers-reduced-motion: reduce` → tidak dirender sama sekali.
 *   3. Momen bertanda `once` hanya sekali seumur akun (ditandai di localStorage).
 *
 * Sengaja TIDAK dipakai untuk kondisi gagal atau overbudget: momen buruk di
 * aplikasi keuangan butuh empati, bukan lelucon.
 */
import { ref, computed } from 'vue'
import { useTheme } from './useTheme'

// Di-import biasa: Vite memisahkan berkas >4KB jadi aset ter-hash, sehingga
// hanya URL-nya yang masuk bundle. Byte-nya baru diunduh saat <img> dirender.
import gifDescend from '@/images/spiderman-tom-holland.gif'
import gifSwing from '@/images/spider-man-no-way-home-marvel-studios.gif'

const MOMENTS = {
  // Turun terbalik sambil memegang jaring — digantung di tepi ATAS layar,
  // dekat tombol tema, supaya jaringnya seolah terikat di luar layar.
  'spidey-theme': {
    src: gifDescend,
    width: 210,
    anchor: 'top-0 right-24 sm:right-28',
    // 2400 ms diam + 600 ms transisi memudar = tepat 3 detik di layar.
    duration: 2400,
  },
  // Berayun melintas — dipakai untuk momen "selesai".
  'first-pocket': {
    src: gifSwing,
    width: 150,
    anchor: 'bottom-6 right-6',
    duration: 3000,
    once: true,
  },
  'split-bill': {
    src: gifSwing,
    width: 130,
    anchor: 'bottom-6 right-6',
    duration: 2600,
  },
}

const STORAGE_PREFIX = 'kainest:celebrated:'

const activeKey = ref(null)
let timerId = null

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useCelebration() {
  const mode = useTheme()

  function dismiss() {
    clearTimeout(timerId)
    activeKey.value = null
  }

  function celebrate(key) {
    const moment = MOMENTS[key]
    if (!moment) return
    if (mode.value !== 'spidey') return       // kejutan khas tema Spidey
    if (prefersReducedMotion()) return         // hormati preferensi pengguna

    if (moment.once) {
      const flag = STORAGE_PREFIX + key
      if (localStorage.getItem(flag)) return
      localStorage.setItem(flag, '1')
    }

    clearTimeout(timerId)
    activeKey.value = key
    timerId = setTimeout(dismiss, moment.duration)
  }

  const active = computed(() => activeKey.value !== null)
  const current = computed(() => MOMENTS[activeKey.value] ?? {})

  return { celebrate, dismiss, active, current }
}
