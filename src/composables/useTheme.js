/**
 * Sumber tunggal tema Kainest.
 *
 * Dulu `useColorMode` hanya dipanggil di dalam ThemeToggle, sehingga tema
 * tersimpan TIDAK diterapkan pada halaman yang tidak memuat komponen itu
 * (mis. /dev/ui, halaman berbagi publik). Sekarang dipanggil sekali di level
 * modul dan dipakai App.vue agar berlaku di seluruh aplikasi.
 */
import { useColorMode } from '@vueuse/core'
import { IconSun, IconMoon, IconAi, IconWeb } from '@/ui/icons'

export const THEMES = [
  { value: 'light',   label: 'Terang',  icon: IconSun },
  { value: 'dark',    label: 'Gelap',   icon: IconMoon },
  { value: 'factory', label: 'Factory', icon: IconAi },
  { value: 'spidey',  label: 'Spidey',  icon: IconWeb },
]

/** Tema khusus ikut membawa `dark` agar seluruh varian `dark:` tetap berlaku. */
const mode = useColorMode({
  modes: {
    factory: 'dark theme-factory',
    spidey: 'dark theme-spidey',
  },
})

export function useTheme() {
  return mode
}
