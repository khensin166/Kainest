<script setup>
import { IconAi, IconArrowRight, IconBellAlert, IconChecklist, IconHeart, IconReceiptSplit } from '@/ui/icons';
import { useRouter } from 'vue-router';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { Button } from '@/ui';

const router = useRouter();
const handleStart = () => router.push('/login');

// Teks fitur ini SAMA PERSIS dengan versi awal aplikasi — jangan diubah.
const FEATURES = [
  { icon: IconHeart,        title: 'Couple Connect', desc: 'Track joint accounts' },
  { icon: IconAi,           title: 'AI Budgeting',   desc: 'Auto-categorize transactions' },
  { icon: IconChecklist,    title: 'Todo List',      desc: 'Check list on smart and fast' },
  { icon: IconReceiptSplit, title: 'Split Bill',     desc: 'Auto split bill from receipts' },
  { icon: IconBellAlert,    title: 'Reminder',       desc: 'Reminder activity' },
];
</script>

<template>
  <main class="min-h-[100dvh] bg-surface-page font-sans">
    <div class="absolute top-6 right-6 z-10"><ThemeToggle /></div>

    <div class="mx-auto max-w-6xl px-6 py-16 lg:py-24 grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center min-h-[100dvh]">

      <!-- Kolom kiri: pesan utama -->
      <div>
        <p class="text-xs font-mono text-text-muted mb-5">Kainest</p>
        <h1 class="text-2xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight">
          Kainest Application.<br />
          <span class="text-brand-muted">Solusi Terintegrasi Anda.</span>
        </h1>
        <p class="mt-5 text-base text-text-secondary leading-relaxed max-w-md">
          Dari pencatatan keuangan pintar hingga kolaborasi dengan pasangan, semua terpusat dan terintegrasi otomatis.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button size="lg" @click="handleStart">
            Mulai Sekarang
            <IconArrowRight class="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <!-- Kolom kanan: fitur. Tampil di semua ukuran layar, bukan desktop saja. -->
      <ul class="grid gap-px bg-border-default border border-border-default rounded-lg overflow-hidden">
        <li v-for="f in FEATURES" :key="f.title" class="flex items-start gap-4 bg-surface-card p-5">
          <div class="w-9 h-9 rounded-md bg-brand-surface flex items-center justify-center shrink-0">
            <component :is="f.icon" class="w-4.5 h-4.5 text-brand-primary" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-text-primary">{{ f.title }}</p>
            <p class="text-sm text-text-muted mt-0.5 leading-relaxed">{{ f.desc }}</p>
          </div>
        </li>
      </ul>
    </div>

    <footer class="pb-8 text-center text-xs font-mono text-text-faint">
      By Kenan Tomfie Bukit
    </footer>
  </main>
</template>
