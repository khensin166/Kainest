import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gabung class Tailwind dengan resolusi konflik (px-4 + px-6 -> px-6, bukan keduanya). */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
