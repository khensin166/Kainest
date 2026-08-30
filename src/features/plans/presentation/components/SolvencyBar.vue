<!-- SolvencyBar.vue — zona solvabilitas.
     Menjawab satu pertanyaan: "apakah uangku akan cukup untuk tagihan bulan ini?"
     Zona kuning sengaja tidak memicu notifikasi apa pun; ia hanya mengubah warna
     di sini. Hanya transisi ke merah yang pantas mengganggu pengguna. -->
<template>
  <div v-if="health" class="rounded-lg border p-4" :class="gaya.wadah">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <component :is="gaya.ikon" class="h-5 w-5 shrink-0" :class="gaya.teks" aria-hidden="true" />
        <div class="min-w-0">
          <p class="font-semibold" :class="gaya.teks">{{ gaya.judul }}</p>
          <p class="text-sm text-text-muted">{{ gaya.penjelasan }}</p>
        </div>
      </div>

      <div class="text-right shrink-0">
        <p class="text-xs text-text-muted">{{ health.isDanger ? 'Kurang' : 'Sisa aman' }}</p>
        <p class="text-lg font-bold tabular-nums" :class="gaya.teks">
          {{ formatRupiah(health.isDanger ? health.shortfall : health.sisaAman) }}
        </p>
      </div>
    </div>

    <dl class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 pt-3 border-t" :class="gaya.garis">
      <div v-for="rincian in rincianAngka" :key="rincian.label">
        <dt class="text-xs text-text-muted">{{ rincian.label }}</dt>
        <dd class="text-sm font-semibold text-text-primary tabular-nums">
          {{ formatRupiah(rincian.nilai) }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconCheck, IconWarning, IconClock } from '@/ui/icons';
import { formatRupiah } from '@/utils/Utils';

const props = defineProps({
  health: { type: Object, default: null },
});

const rincianAngka = computed(() => {
  if (!props.health) return [];
  return [
    { label: 'Sisa kantong', nilai: props.health.sisaKantong },
    { label: 'Belum dialokasikan', nilai: props.health.belumDialokasikan },
    { label: 'Tagihan belum lunas', nilai: props.health.tagihanBelumLunas },
    { label: 'Alokasi tabungan', nilai: props.health.alokasiTabungan },
  ];
});

const gaya = computed(() => {
  const zona = props.health?.zone;
  if (zona === 'DANGER') {
    return {
      wadah: 'bg-status-danger-bg border-status-danger/30',
      garis: 'border-status-danger/20',
      teks: 'text-status-danger-text',
      ikon: IconWarning,
      judul: 'Uangmu kurang untuk tagihan bulan ini',
      penjelasan: 'Tinjau tagihan yang belum dibayar atau kurangi alokasi tabungan.',
    };
  }
  if (zona === 'WARNING') {
    return {
      wadah: 'bg-status-warning-bg border-status-warning/30',
      garis: 'border-status-warning/20',
      teks: 'text-status-warning-text',
      ikon: IconClock,
      judul: 'Uang cukup, tapi tipis',
      penjelasan: 'Masih aman untuk komitmen bulan ini. Rem dulu pengeluaran lain.',
    };
  }
  return {
    wadah: 'bg-surface-card border-border-default',
    garis: 'border-border-muted',
    teks: 'text-status-success-text',
    ikon: IconCheck,
    judul: 'Komitmen bulan ini aman',
    penjelasan: 'Seluruh tagihan dan alokasi tabungan tertutup.',
  };
});
</script>
