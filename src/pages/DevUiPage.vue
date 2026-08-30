<script setup>
import { IconChart, IconDocument, IconMoney, IconSearch } from '@/ui/icons';
import { ref } from 'vue'
import {
  Button, Badge, Card, Input, Select, Switch, Tabs, Modal,
  Skeleton, PageShell, EmptyState, StatCard,
} from '@/ui'

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'link']
const SIZES = ['sm', 'md', 'lg']
const TONES = ['neutral', 'brand', 'success', 'danger', 'warning', 'info']

const text = ref('')
const picked = ref('bulan')
const toggled = ref(true)
const tab = ref('a')
const modalOpen = ref(false)
</script>

<template>
  <PageShell title="Kainest UI" subtitle="Semua primitif × semua varian. Inkonsistensi harus ketahuan di halaman ini, bukan di produksi.">
    <div class="space-y-8">

      <Card>
        <template #header><h2 class="text-sm font-semibold text-text-primary">Button</h2></template>
        <div class="space-y-4">
          <div v-for="size in SIZES" :key="size" class="flex flex-wrap items-center gap-3">
            <span class="text-xs font-mono text-text-muted w-8">{{ size }}</span>
            <Button v-for="v in VARIANTS" :key="v" :variant="v" :size="size">{{ v }}</Button>
          </div>
          <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-border-default">
            <span class="text-xs font-mono text-text-muted w-8">state</span>
            <Button disabled>disabled</Button>
            <Button loading>loading</Button>
            <Button variant="secondary" as="a" href="#">as=a</Button>
          </div>
        </div>
      </Card>

      <Card>
        <template #header><h2 class="text-sm font-semibold text-text-primary">Badge</h2></template>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="t in TONES" :key="t" :tone="t">{{ t }}</Badge>
        </div>
      </Card>

      <Card>
        <template #header><h2 class="text-sm font-semibold text-text-primary">Form</h2></template>
        <div class="grid gap-4 sm:grid-cols-2 max-w-2xl">
          <Input v-model="text" placeholder="Input biasa" />
          <Input v-model="text" placeholder="Dengan prefix">
            <template #prefix><IconSearch class="w-4 h-4" /></template>
          </Input>
          <Input v-model="text" placeholder="Invalid" invalid />
          <Select
            v-model="picked"
            :options="[{ value: 'bulan', label: 'Bulan ini' }, { value: 'tahun', label: 'Tahun ini' }, { value: 'semua', label: 'Semua waktu' }]"
          />
          <label class="flex items-center gap-3 text-sm text-text-secondary">
            <Switch v-model="toggled" /> Switch (reka-ui)
          </label>
        </div>
      </Card>

      <Card>
        <template #header><h2 class="text-sm font-semibold text-text-primary">Tabs</h2></template>
        <Tabs v-model="tab" :items="[{ value: 'a', label: 'Ringkasan' }, { value: 'b', label: 'Rincian' }]">
          <template #a><p class="text-sm text-text-muted">Konten tab Ringkasan.</p></template>
          <template #b><p class="text-sm text-text-muted">Konten tab Rincian.</p></template>
        </Tabs>
      </Card>

      <Card>
        <template #header><h2 class="text-sm font-semibold text-text-primary">StatCard</h2></template>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Pengeluaran" value="Rp 4.250.000" :icon="IconChart" :delta="12" delta-invert />
          <StatCard label="Gaji Utama" value="Rp 6.100.000" :icon="IconMoney" :delta="0" />
          <StatCard label="Sisa" value="Rp 1.850.000" :icon="IconMoney" :delta="-8" />
          <StatCard label="Memuat" loading :icon="IconChart" />
        </div>
      </Card>

      <div class="grid gap-6 lg:grid-cols-2">
        <Card :padded="false">
          <template #header><h2 class="text-sm font-semibold text-text-primary">EmptyState</h2></template>
          <EmptyState :icon="IconDocument" title="Belum ada transaksi" description="Catatan pertamamu akan muncul di sini.">
            <Button size="sm">Catat transaksi</Button>
          </EmptyState>
        </Card>

        <Card>
          <template #header><h2 class="text-sm font-semibold text-text-primary">Skeleton &amp; Modal</h2></template>
          <div class="space-y-2 mb-4">
            <Skeleton class="h-4 w-1/3" />
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-2/3" />
          </div>
          <Button variant="secondary" @click="modalOpen = true">Buka Modal</Button>
          <Modal v-model:open="modalOpen" title="Contoh Modal" description="Fokus terkunci, Esc menutup, scroll body terkunci — semua dari reka-ui.">
            <p class="text-sm text-text-secondary">Isi modal.</p>
            <template #footer>
              <Button variant="ghost" @click="modalOpen = false">Batal</Button>
              <Button @click="modalOpen = false">Simpan</Button>
            </template>
          </Modal>
        </Card>
      </div>

    </div>
  </PageShell>
</template>
