<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
      <MegaphoneIcon class="w-4 h-4 text-violet-500" />
      <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">System Updates</h2>
      
      <!-- Sync Button (Admin Only) -->
      <button v-if="isAdmin" @click="syncGithub" :disabled="syncing"
        class="ml-auto text-xs flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">
        <ArrowPathIcon :class="['w-3 h-3', { 'animate-spin': syncing }]" />
        {{ syncing ? 'Syncing...' : 'Sync GitHub' }}
      </button>
      <span v-else class="ml-auto text-xs text-gray-400 dark:text-gray-500">Kainest Changelog</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-5 space-y-4">
      <div v-for="i in 3" :key="i" class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
        <div class="flex-1 space-y-1.5">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
          <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="updates.length === 0" class="py-8 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">Belum ada update sistem.</p>
    </div>

    <!-- Updates List -->
    <ul v-else class="divide-y divide-gray-50 dark:divide-gray-700/50">
      <li v-for="update in updates" :key="update.id"
        class="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
        <div class="mt-0.5 w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
          <RocketLaunchIcon class="w-4 h-4 text-violet-500" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            <span class="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">{{ update.version }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(update.date) }}</span>
          </div>
          <a v-if="update.url" :href="update.url" target="_blank" class="text-sm font-medium text-gray-800 dark:text-gray-100 hover:text-violet-500 hover:underline inline-block">{{ update.title }}</a>
          <p v-else class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ update.title }}</p>
          <!-- Menggunakan whitespace-pre-line agar line breaks dari github ter-render -->
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line">{{ update.description }}</p>
        </div>
        <span v-if="update.badge" class="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          {{ update.badge }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { MegaphoneIcon, RocketLaunchIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';

const authStore = useAuthStore();
const updates = ref([]);
const loading = ref(true);
const syncing = ref(false);

const isAdmin = computed(() => authStore.user?.role === 'admin');

const apiHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const fetchUpdates = async () => {
  loading.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.get(`${baseUrl}/system-updates`, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    updates.value = res.data?.updates || [];
  } catch (e) {
    console.error('[SystemUpdates] Gagal fetch:', e.message);
  } finally {
    loading.value = false;
  }
};

const syncGithub = async () => {
  if (syncing.value) return;
  syncing.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.post(`${baseUrl}/system-updates/sync`, {}, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    const { newlyAdded, blasted } = res.data;
    alert(`Sync Berhasil! Menambahkan ${newlyAdded} update baru. Notifikasi diblast: ${blasted}`);
    await fetchUpdates();
  } catch (e) {
    alert('Gagal melakukan sync dari GitHub.');
    console.error('[SystemUpdates] Gagal sync:', e.message);
  } finally {
    syncing.value = false;
  }
};

onMounted(() => fetchUpdates());
</script>
