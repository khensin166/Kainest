<!-- WaBotApiPage.vue — Blast Dashboard -->
<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span class="text-xl">📣</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Blast Message Center</h1>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 ml-13">
          Kirim pengumuman atau pembaruan sistem ke semua grup yang terdaftar.
        </p>
      </div>
      <button @click="fetchGroups" :disabled="isLoading"
        class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50">
        <svg :class="isLoading ? 'animate-spin' : ''" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {{ isLoading ? 'Memuat...' : 'Refresh Grup' }}
      </button>
    </div>

    <!-- Result Toast -->
    <div v-if="blastResult"
      class="flex items-start gap-4 p-4 rounded-xl border"
      :class="blastResult.failed > 0
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/40'
        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/40'">
      <span class="text-2xl">{{ blastResult.failed > 0 ? '⚠️' : '✅' }}</span>
      <div>
        <p class="font-semibold text-gray-900 dark:text-white">Blast Selesai!</p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
          Berhasil: <strong class="text-green-700 dark:text-green-400">{{ blastResult.success }} grup</strong> &nbsp;|&nbsp;
          Gagal: <strong class="text-red-600 dark:text-red-400">{{ blastResult.failed }} grup</strong>
        </p>
        <p v-if="blastResult.failedGroups?.length" class="text-xs text-gray-400 mt-1">
          Gagal: {{ blastResult.failedGroups.join(', ') }}
        </p>
      </div>
      <button @click="blastResult = null" class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- LEFT: Tabel Grup Aktif -->
      <div class="xl:col-span-2 space-y-4">

        <!-- Stats bar -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ activeGroups.length }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Grup</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ linkedGroups }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Terhubung</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-orange-500 dark:text-orange-400">{{ pendingGroups }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Perlu Relink</p>
          </div>
        </div>

        <!-- Filter & Select All -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm flex-1">
            <svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Cari grup atau user..."
              class="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none" />
          </div>
          <select v-model="filterMode"
            class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="all">Semua Grup</option>
            <option value="linked">Terhubung</option>
            <option value="pending">Perlu Relink</option>
          </select>
        </div>

        <!-- Tabel -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <!-- Toolbar Select -->
          <div class="flex items-center justify-between gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input type="checkbox" :checked="isAllSelected" :indeterminate="isSomeSelected && !isAllSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer" />
              <span>{{ selectedGroupIds.size > 0 ? `${selectedGroupIds.size} grup dipilih` : 'Pilih Semua' }}</span>
            </label>
            <button v-if="selectedGroupIds.size > 0" @click="selectedGroupIds.clear()"
              class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              Batalkan Pilihan
            </button>
          </div>

          <div class="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table class="w-full text-sm text-left">
              <thead class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-10">
                <tr>
                  <th class="px-5 py-3 w-10"></th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">ID Grup</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Ditautkan Oleh</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Tgl. Terdaftar</th>
                  <th class="px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <tr v-if="isLoading">
                  <td colspan="5" class="text-center py-12 text-gray-400">
                    <svg class="animate-spin h-6 w-6 mx-auto mb-2 text-violet-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Memuat data grup...
                  </td>
                </tr>
                <tr v-else-if="filteredGroups.length === 0">
                  <td colspan="5" class="text-center py-12 text-gray-400">
                    <span class="text-3xl block mb-2">🔍</span>
                    Tidak ada grup yang cocok dengan pencarian.
                  </td>
                </tr>
                <tr v-for="group in filteredGroups" :key="group.id"
                  class="hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors cursor-pointer"
                  @click="toggleSelect(group.groupId)">
                  <td class="px-5 py-3.5">
                    <input type="checkbox" :checked="selectedGroupIds.has(group.groupId)"
                      @click.stop="toggleSelect(group.groupId)"
                      class="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer" />
                  </td>
                  <td class="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400 max-w-[160px] truncate" :title="group.groupId">
                    {{ group.groupId }}
                  </td>
                  <td class="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                    {{ group.linkedBy ? (group.linkedBy.name || group.linkedBy.email) : '—' }}
                  </td>
                  <td class="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                    {{ formatDate(group.createdAt) }}
                  </td>
                  <td class="px-5 py-3.5 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      :class="group.needsRelink
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'">
                      <span class="w-1.5 h-1.5 rounded-full"
                        :class="group.needsRelink ? 'bg-orange-500' : 'bg-green-500'"></span>
                      {{ group.needsRelink ? 'Perlu Relink' : 'Aktif' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT: Form Blast -->
      <div class="xl:col-span-1">
        <div class="sticky top-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-violet-500 to-purple-600">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              📣 Kirim Blast Message
            </h2>
            <p class="text-xs text-violet-100 mt-0.5">Pesan akan dikirim ke grup yang dipilih</p>
          </div>

          <div class="p-5 space-y-4">
            <!-- Grup terpilih badge -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Grup dipilih</span>
              <span class="px-3 py-1 rounded-full font-bold text-xs"
                :class="selectedGroupIds.size > 0
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">
                {{ selectedGroupIds.size }} grup
              </span>
            </div>

            <!-- Template cepat -->
            <div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Template Cepat</p>
              <div class="flex flex-wrap gap-2">
                <button @click="applyTemplate('relink')"
                  class="text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700/40 rounded-lg hover:bg-orange-100 transition-colors">
                  🔗 Permintaan Relink
                </button>
                <button @click="applyTemplate('update')"
                  class="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/40 rounded-lg hover:bg-blue-100 transition-colors">
                  🚀 Pembaruan Fitur
                </button>
                <button @click="applyTemplate('maintenance')"
                  class="text-xs px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/40 rounded-lg hover:bg-red-100 transition-colors">
                  🔧 Maintenance
                </button>
              </div>
            </div>

            <!-- Textarea pesan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Isi Pesan <span class="text-red-500">*</span>
              </label>
              <textarea v-model="blastMessage" rows="8"
                placeholder="Tulis pesan blast di sini...&#10;&#10;Mendukung format WhatsApp:&#10;*tebal* _miring_ ~coret~"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none placeholder-gray-400 transition-shadow">
              </textarea>
              <p class="text-xs text-gray-400 mt-1 text-right">{{ blastMessage.length }} karakter</p>
            </div>

            <!-- Tombol blast -->
            <button @click="confirmBlast" :disabled="isSending || selectedGroupIds.size === 0 || !blastMessage.trim()"
              class="w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :class="isSending
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hover:shadow-violet-200 dark:hover:shadow-violet-900/40 hover:shadow-lg'">
              <svg v-if="isSending" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>{{ isSending ? 'Mengirim...' : `Blast ke ${selectedGroupIds.size} Grup` }}</span>
            </button>

            <p class="text-xs text-gray-400 dark:text-gray-500 text-center">
              Pengiriman akan dilakukan secara bertahap dengan jeda 1.5 detik antar grup untuk menjaga keamanan akun.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Konfirmasi Modal (reusable) -->
    <GlobalDeleteModal />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useModalStore } from '@/stores/modalStore';
import GlobalDeleteModal from '@/components/modals/GlobalDeleteModal.vue';
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
const selectedGroupIds = reactive(new Set());

// ─── Computed ─────────────────────────────────────────────
const filteredGroups = computed(() => {
  let list = activeGroups.value;

  if (filterMode.value === 'linked') list = list.filter(g => !g.needsRelink);
  else if (filterMode.value === 'pending') list = list.filter(g => g.needsRelink);

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(g =>
      g.groupId.toLowerCase().includes(q) ||
      g.linkedBy?.name?.toLowerCase().includes(q) ||
      g.linkedBy?.email?.toLowerCase().includes(q)
    );
  }
  return list;
});

const linkedGroups = computed(() => activeGroups.value.filter(g => !g.needsRelink).length);
const pendingGroups = computed(() => activeGroups.value.filter(g => g.needsRelink).length);
const isAllSelected = computed(() => filteredGroups.value.length > 0 && filteredGroups.value.every(g => selectedGroupIds.has(g.groupId)));
const isSomeSelected = computed(() => filteredGroups.value.some(g => selectedGroupIds.has(g.groupId)));

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
  if (selectedGroupIds.has(groupId)) selectedGroupIds.delete(groupId);
  else selectedGroupIds.add(groupId);
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    filteredGroups.value.forEach(g => selectedGroupIds.delete(g.groupId));
  } else {
    filteredGroups.value.forEach(g => selectedGroupIds.add(g.groupId));
  }
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

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

const confirmBlast = () => {
  if (selectedGroupIds.size === 0 || !blastMessage.value.trim()) return;

  modalStore.openDeleteModal({
    title: `Kirim Blast ke ${selectedGroupIds.size} Grup?`,
    message: `Pesan akan dikirim ke ${selectedGroupIds.size} grup yang Anda pilih secara bertahap. Pastikan isi pesan sudah benar sebelum melanjutkan.`,
    onConfirm: sendBlast,
  });
};

const sendBlast = async () => {
  isSending.value = true;
  blastResult.value = null;
  try {
    const { data } = await api.post('/wabot/blast', {
      message: blastMessage.value,
      groupIds: Array.from(selectedGroupIds),
    });
    blastResult.value = data.summary;
    if (data.summary.success > 0) {
      blastMessage.value = '';
      selectedGroupIds.clear();
    }
  } catch (e) {
    console.error('[Blast] Error:', e.message);
    blastResult.value = { success: 0, failed: selectedGroupIds.size, failedGroups: [] };
  } finally {
    isSending.value = false;
  }
};

onMounted(fetchGroups);
</script>