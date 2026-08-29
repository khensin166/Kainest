<!-- ComingSoonPage.vue — placeholder jujur untuk menu yang fiturnya belum ada.
     Sebelumnya ketiga rute ini mengarah ke Dashboard.vue, sehingga mengklik
     menunya menampilkan Dashboard lagi tanpa penjelasan apa pun dan pengguna
     mengira aplikasinya rusak. -->
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { EmptyState, Button } from '@/ui';
import { IconClock } from '@/ui/icons';

const route = useRoute();

const JUDUL = {
  gallery: 'Galeri Kenangan',
  calendar: 'Kalender Cinta',
  vault: 'Vault Rahasia',
};

const judul = computed(() => JUDUL[route.path.split('/').pop()] || 'Fitur Ini');
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <h1 class="text-2xl font-bold text-text-primary tracking-tight mb-6">{{ judul }}</h1>

    <div class="bg-surface-card rounded-lg border border-border-default">
      <EmptyState
        :icon="IconClock"
        title="Segera Hadir"
        :description="`${judul} masih dalam pengembangan dan belum bisa digunakan. Menu ini sengaja tetap ditampilkan agar kamu tahu fitur ini sedang disiapkan.`"
      >
        <Button as="router-link" to="/app/dashboard" variant="secondary">
          Kembali ke Dashboard
        </Button>
      </EmptyState>
    </div>
  </div>
</template>
