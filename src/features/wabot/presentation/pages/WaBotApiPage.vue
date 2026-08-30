<!-- WaBotApiPage.vue — Blast Message Center -->
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto space-y-6">

    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight">Blast Message Center</h1>
          <PageGuide :steps="pageGuides.wabotApi" />
        </div>
        <p class="text-sm text-text-muted mt-1">
          Kirim pengumuman atau pembaruan sistem ke semua grup yang terdaftar.
        </p>
      </div>
      <Button variant="secondary" :loading="isLoading" @click="fetchGroups">
        <IconRefresh v-if="!isLoading" class="h-4 w-4" aria-hidden="true" />
        {{ isLoading ? 'Memuat...' : 'Refresh Grup' }}
      </Button>
    </header>

    <!-- Hasil blast -->
    <Card v-if="blastResult" :padded="false">
      <div class="flex items-start gap-3 p-4">
        <component
          :is="blastResult.failed > 0 ? IconWarning : IconCheckCircle"
          class="w-5 h-5 shrink-0 mt-0.5"
          :class="blastResult.failed > 0 ? 'text-status-warning' : 'text-status-success'"
          aria-hidden="true"
        />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-text-primary">Blast Selesai!</p>
          <p class="text-sm text-text-muted mt-0.5">
            Berhasil: <strong class="text-status-success-text">{{ blastResult.success }} grup</strong>
            &nbsp;|&nbsp;
            Gagal: <strong class="text-status-danger-text">{{ blastResult.failed }} grup</strong>
          </p>
          <p v-if="blastResult.failedGroups?.length" class="text-xs text-text-muted mt-1 break-words">
            Gagal: {{ blastResult.failedGroups.join(', ') }}
          </p>
        </div>
        <button
          class="shrink-0 text-text-muted hover:text-text-primary transition-colors cursor-pointer
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
          aria-label="Tutup"
          @click="blastResult = null"
        >
          <IconClose class="w-5 h-5" />
        </button>
      </div>
    </Card>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- ── Kiri: daftar grup ── -->
      <div class="xl:col-span-2">
        <Card :padded="false">
          <!-- Ringkasan sekaligus filter: angkanya bisa diklik, bukan sekadar hiasan -->
          <div class="grid grid-cols-3 divide-x divide-border-default border-b border-border-default">
            <button
              v-for="f in FILTERS"
              :key="f.value"
              type="button"
              class="px-4 py-3 text-center transition-colors cursor-pointer
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
              :class="filterMode === f.value ? 'bg-surface-hover' : 'hover:bg-surface-hover/60'"
              :aria-pressed="filterMode === f.value"
              @click="filterMode = f.value"
            >
              <p class="text-xl font-bold tabular-nums" :class="filterMode === f.value ? 'text-text-primary' : 'text-text-secondary'">
                {{ f.count }}
              </p>
              <p class="text-xs mt-0.5" :class="filterMode === f.value ? 'text-text-secondary' : 'text-text-muted'">
                {{ f.label }}
              </p>
            </button>
          </div>

          <!-- Pencarian -->
          <div class="p-4 border-b border-border-default">
            <Input v-model="searchQuery" placeholder="Cari grup atau user...">
              <template #prefix><IconSearch class="h-4 w-4" aria-hidden="true" /></template>
            </Input>
          </div>

          <!-- Toolbar pilih -->
          <div class="flex items-center justify-between gap-3 px-4 py-2.5 bg-surface-subtle border-b border-border-default">
            <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                class="w-4 h-4 rounded-sm border-border-default text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
                :checked="isAllSelected"
                :indeterminate="isSomeSelected && !isAllSelected"
                @change="toggleSelectAll"
              />
              <span>{{ selectedGroupIds.length > 0 ? `${selectedGroupIds.length} grup dipilih` : 'Pilih Semua' }}</span>
            </label>
            <button
              v-if="selectedGroupIds.length > 0"
              class="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              @click="selectedGroupIds = []"
            >
              Batalkan Pilihan
            </button>
          </div>

          <!-- Tabel -->
          <div class="overflow-x-auto max-h-96 overflow-y-auto">
            <table class="w-full text-sm text-left">
              <thead class="sticky top-0 bg-surface-card border-b border-border-default z-10">
                <tr>
                  <th class="px-4 py-2.5 w-10"></th>
                  <th class="px-4 py-2.5 font-medium text-text-muted">ID Grup</th>
                  <th class="px-4 py-2.5 font-medium text-text-muted">Ditautkan Oleh</th>
                  <th class="px-4 py-2.5 font-medium text-text-muted">Tgl. Terdaftar</th>
                  <th class="px-4 py-2.5 font-medium text-text-muted text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-default">
                <tr v-if="isLoading">
                  <td colspan="5" class="text-center py-12 text-text-muted">
                    <Spinner class="h-5 w-5 mx-auto mb-2 text-brand-primary" />
                    Memuat data grup...
                  </td>
                </tr>
                <tr v-else-if="filteredGroups.length === 0">
                  <td colspan="5" class="py-12">
                    <EmptyState
                      :icon="IconSearch"
                      title="Tidak ada grup yang cocok dengan pencarian."
                    />
                  </td>
                </tr>
                <tr
                  v-for="group in filteredGroups"
                  v-else
                  :key="group.id"
                  class="hover:bg-surface-hover transition-colors cursor-pointer"
                  @click="toggleSelect(group.groupId)"
                >
                  <td class="px-4 py-3">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded-sm border-border-default text-brand-primary focus:ring-brand-primary focus:ring-offset-0 cursor-pointer"
                      :checked="selectedGroupIds.includes(group.groupId)"
                      @click.stop="toggleSelect(group.groupId)"
                    />
                  </td>
                  <td class="px-4 py-3 font-mono text-xs text-text-muted max-w-40 truncate" :title="group.groupId">
                    {{ group.groupId }}
                  </td>
                  <td class="px-4 py-3 font-medium text-text-primary">
                    {{ group.linkedBy ? (group.linkedBy.name || group.linkedBy.email) : '—' }}
                  </td>
                  <td class="px-4 py-3 text-text-muted text-xs tabular-nums">
                    {{ formatDate(group.createdAt) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <Badge :tone="group.needsRelink ? 'warning' : 'success'">
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        :class="group.needsRelink ? 'bg-status-warning' : 'bg-status-success'"
                      />
                      {{ group.needsRelink ? 'Perlu Relink' : 'Aktif' }}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <!-- ── Kanan: susun pesan ── -->
      <div class="xl:col-span-1">
        <Card :padded="false" class="sticky top-6">
          <template #header>
            <IconAnnounce class="w-4 h-4 text-brand-primary" aria-hidden="true" />
            <div class="min-w-0">
              <h2 class="text-sm font-semibold text-text-primary">Kirim Blast Message</h2>
              <p class="text-xs text-text-muted">Pesan akan dikirim ke grup yang dipilih</p>
            </div>
          </template>

          <div class="p-5 space-y-5">
            <div class="flex items-center justify-between gap-3 text-sm">
              <span class="text-text-muted">Grup dipilih</span>
              <Badge :tone="selectedGroupIds.length > 0 ? 'brand' : 'neutral'">
                {{ selectedGroupIds.length }} grup
              </Badge>
            </div>

            <div>
              <p class="text-xs font-medium text-text-muted mb-2">Template Cepat</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="t in TEMPLATE_CHIPS"
                  :key="t.key"
                  type="button"
                  class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-sm cursor-pointer
                         border border-border-default text-text-secondary transition-colors
                         hover:bg-surface-hover hover:text-text-primary hover:border-border-strong
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  @click="applyTemplate(t.key)"
                >
                  <component :is="t.icon" class="w-3.5 h-3.5" aria-hidden="true" />
                  {{ t.label }}
                </button>
              </div>
            </div>

            <div>
              <label for="blast-message" class="block text-sm font-medium text-text-primary mb-1.5">
                Isi Pesan <span class="text-status-danger-text">*</span>
              </label>
              <textarea
                id="blast-message"
                v-model="blastMessage"
                rows="8"
                placeholder="Tulis pesan blast di sini...&#10;&#10;Mendukung format WhatsApp:&#10;*tebal* _miring_ ~coret~"
                class="w-full px-3 py-2.5 rounded-md border border-border-default bg-surface-input
                       text-text-primary text-sm placeholder:text-text-muted resize-none transition-colors
                       focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
              <p class="text-xs text-text-muted mt-1 text-right tabular-nums">{{ blastMessage.length }} karakter</p>
            </div>

            <Button
              block
              :loading="isSending"
              :disabled="selectedGroupIds.length === 0 || !blastMessage.trim()"
              @click.stop.prevent="confirmBlast"
            >
              {{ isSending ? 'Mengirim...' : `Blast ke ${selectedGroupIds.length} Grup` }}
            </Button>

            <p class="text-xs text-text-muted text-center leading-relaxed">
              Pengiriman akan dilakukan secara bertahap dengan jeda 1.5 detik antar grup untuk menjaga keamanan akun.
            </p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { ref, computed, onMounted, nextTick } from 'vue';
import { Button, Card, Badge, Input, Spinner, EmptyState } from '@/ui';
import {
  IconAnnounce, IconBolt, IconCheckCircle, IconClose, IconLink,
  IconRefresh, IconSearch, IconSettings, IconWarning,
} from '@/ui/icons';
import { useModalStore } from '@/stores/modalStore';
import api from '@/lib/apiClient';

const modalStore = useModalStore();

// ─── State ───────────────────────────────────────────────
const activeGroups = ref([]);
const isLoading = ref(false);
const isSending = ref(false);
const blastMessage = ref('');
const blastResult = ref(null);
const searchQuery = ref('');
const filterMode = ref('all');
const selectedGroupIds = ref([]); // Array untuk reaktivitas Vue 3 yang stabil

// ─── Computed ─────────────────────────────────────────────
const filteredGroups = computed(() => {
  let list = activeGroups.value;

  if (filterMode.value === 'linked') list = list.filter((g) => !g.needsRelink);
  else if (filterMode.value === 'pending') list = list.filter((g) => g.needsRelink);

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (g) =>
        g.groupId.toLowerCase().includes(q) ||
        g.linkedBy?.name?.toLowerCase().includes(q) ||
        g.linkedBy?.email?.toLowerCase().includes(q)
    );
  }
  return list;
});

const linkedGroups = computed(() => activeGroups.value.filter((g) => !g.needsRelink).length);
const pendingGroups = computed(() => activeGroups.value.filter((g) => g.needsRelink).length);

/** Ringkasan dan filter digabung: angkanya sekaligus jadi kontrol. */
const FILTERS = computed(() => [
  { value: 'all', label: 'Total Grup', count: activeGroups.value.length },
  { value: 'linked', label: 'Terhubung', count: linkedGroups.value },
  { value: 'pending', label: 'Perlu Relink', count: pendingGroups.value },
]);

const isAllSelected = computed(
  () =>
    filteredGroups.value.length > 0 &&
    filteredGroups.value.every((g) => selectedGroupIds.value.includes(g.groupId))
);
const isSomeSelected = computed(() =>
  filteredGroups.value.some((g) => selectedGroupIds.value.includes(g.groupId))
);

// ─── Methods ──────────────────────────────────────────────
const fetchGroups = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/wabot/active-groups');
    activeGroups.value = data.data || [];
  } catch (e) {
    console.error('[Blast] Gagal memuat grup:', e.message);
  } finally {
    isLoading.value = false;
  }
};

const toggleSelect = (groupId) => {
  const idx = selectedGroupIds.value.indexOf(groupId);
  if (idx >= 0) selectedGroupIds.value.splice(idx, 1);
  else selectedGroupIds.value.push(groupId);
};

const toggleSelectAll = () => {
  const idsTersaring = filteredGroups.value.map((g) => g.groupId);
  if (isAllSelected.value) {
    selectedGroupIds.value = selectedGroupIds.value.filter((id) => !idsTersaring.includes(id));
  } else {
    const tambahan = idsTersaring.filter((id) => !selectedGroupIds.value.includes(id));
    selectedGroupIds.value.push(...tambahan);
  }
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const TEMPLATE_CHIPS = [
  { key: 'relink', label: 'Permintaan Relink', icon: IconLink },
  { key: 'update', label: 'Pembaruan Fitur', icon: IconBolt },
  { key: 'maintenance', label: 'Maintenance', icon: IconSettings },
];

// Emoji di bawah ini adalah ISI PESAN WhatsApp yang dikirim ke pengguna,
// bukan ikon UI — sengaja dipertahankan apa adanya.
const TEMPLATES = {
  relink: `⚠️ *Pemberitahuan Khusus Kainest*

Halo! Kami baru saja melakukan pembaruan sistem yang membutuhkan pembaruan tautan grup.

*Langkah Relink:*
1. Buka Web Kainest dan login ke akun Anda.
2. Pergi ke *Pengaturan > Profil*.
3. Salin *Kode Tautan* (6 digit).
4. Ketik dan kirim di grup ini: \`!link KODE_KAMU\`

Terima kasih! 🐥`,
  update: `🚀 *Pembaruan Fitur Kainest*

Kami baru saja merilis fitur-fitur baru yang akan membantu Anda mencatat keuangan lebih mudah!

✅ Fitur baru telah aktif
🐛 Berbagai bug telah diperbaiki

Coba sekarang di web Kainest ✨`,
  maintenance: `🔧 *Pemberitahuan Maintenance*

Sistem Kainest akan menjalani maintenance dalam waktu dekat.

Selama proses berlangsung, bot mungkin tidak merespons sementara.

Terima kasih atas pengertian Anda 🙏`,
};

const applyTemplate = (key) => {
  blastMessage.value = TEMPLATES[key] || '';
};

const confirmBlast = async () => {
  // `.value` WAJIB di sini: di dalam <script setup> ref tidak di-unwrap otomatis
  // seperti di template. Tanpa itu, jumlahnya terbaca `undefined` dan dialog
  // konfirmasi sempat berbunyi "Kirim Blast ke undefined Grup?".
  const jumlah = selectedGroupIds.value.length;
  if (jumlah === 0 || !blastMessage.value.trim()) return;

  // Tunggu satu tick agar siklus event klik selesai sebelum backdrop modal muncul,
  // supaya dialog tidak menganggap klik sisa sebagai "klik di luar".
  await nextTick();

  modalStore.openDeleteModal({
    title: `Kirim Blast ke ${jumlah} Grup?`,
    message: `Pesan akan dikirim ke ${jumlah} grup yang Anda pilih secara bertahap. Pastikan isi pesan sudah benar sebelum melanjutkan.`,
    confirmLabel: 'Kirim Blast',
    onConfirm: sendBlast,
  });
};

const sendBlast = async () => {
  isSending.value = true;
  blastResult.value = null;
  try {
    const { data } = await api.post('/wabot/blast', {
      message: blastMessage.value,
      groupIds: [...selectedGroupIds.value],
    });
    blastResult.value = data.summary;
    if (data.summary.success > 0) {
      blastMessage.value = '';
      selectedGroupIds.value = [];
    }
  } catch (e) {
    console.error('[Blast] Error:', e.message);
    blastResult.value = { success: 0, failed: selectedGroupIds.value.length, failedGroups: [] };
  } finally {
    isSending.value = false;
  }
};

onMounted(fetchGroups);
</script>
