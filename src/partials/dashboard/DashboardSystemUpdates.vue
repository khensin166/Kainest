<template>
  <div class="col-span-12 xl:col-span-8">
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <MegaphoneIcon class="w-4 h-4 text-violet-500" />
        <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">System Updates</h2>
        <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">Kainest Changelog</span>
      </div>

      <!-- Updates List -->
      <ul class="divide-y divide-gray-50 dark:divide-gray-700/50">
        <li v-for="update in updates" :key="update.version"
          class="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
          <div class="mt-0.5 w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
            <component :is="update.icon" class="w-4 h-4 text-violet-500" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">{{ update.version }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ update.date }}</span>
            </div>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ update.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ update.description }}</p>
          </div>
          <span :class="['text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0', update.badgeClass]">
            {{ update.badge }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { MegaphoneIcon, SparklesIcon, BugAntIcon, ShieldCheckIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline';

const updates = [
  {
    version: 'v1.3.0',
    date: '4 Jun 2026',
    title: 'Universal Onboarding Bot WhatsApp',
    description: 'Bot sekarang menyambut otomatis ketika diundang ke grup. Alur !link di personal chat diperketat untuk keamanan.',
    icon: RocketLaunchIcon,
    badge: 'Baru',
    badgeClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  },
  {
    version: 'v1.2.5',
    date: '3 Jun 2026',
    title: 'Stiker Kicaw via WhatsApp Bot',
    description: 'Bot mengirimkan stiker GIF kicaw setelah memproses transaksi AI berhasil.',
    icon: SparklesIcon,
    badge: 'Fitur',
    badgeClass: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  },
  {
    version: 'v1.2.0',
    date: '1 Jun 2026',
    title: 'Sistem Feedback & Notifikasi',
    description: 'Pengguna kini bisa memberikan ulasan. Notifikasi ditampilkan di header secara real-time.',
    icon: ShieldCheckIcon,
    badge: 'Fitur',
    badgeClass: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  },
  {
    version: 'v1.1.0',
    date: '27 Mei 2026',
    title: 'Halaman Lupa Password',
    description: 'Halaman Lupa Password dan Reset Password didesain ulang dengan gaya split-screen modern.',
    icon: BugAntIcon,
    badge: 'Perbaikan',
    badgeClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
];
</script>
