<template>
  <div class="col-span-12 xl:col-span-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <ClockIcon class="w-4 h-4 text-violet-500" />
          <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Aktivitas Terbaru</h2>
        </div>
        <router-link v-if="hasBudgeting" to="/app/transactions"
          class="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
          Lihat Semua
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-5 space-y-4">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="activities.length === 0" class="flex flex-col items-center justify-center py-10 px-5 text-center">
        <div class="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-3">
          <InboxIcon class="w-6 h-6 text-violet-400" />
        </div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Belum ada aktivitas</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Mulai catat transaksi pertama kamu!</p>
      </div>

      <!-- Activity List -->
      <ul v-else class="divide-y divide-gray-50 dark:divide-gray-700/50">
        <li v-for="activity in activities" :key="activity.id"
          class="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
          <div :class="['w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', activity.iconBg]">
            <component :is="activity.icon" :class="['w-4 h-4', activity.iconColor]" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ activity.title }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500">{{ activity.time }}</p>
          </div>
          <span v-if="activity.amount" :class="['text-sm font-semibold flex-shrink-0', activity.amountColor]">
            {{ activity.amount }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { ClockIcon, InboxIcon, ArrowDownIcon, ArrowUpIcon, BoltIcon, LinkIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';

const authStore = useAuthStore();
const loading = ref(true);
const rawTransactions = ref([]);

const hasBudgeting = computed(() =>
  authStore.user?.role === 'admin' || authStore.user?.permissions?.includes('budgeting')
);

const formatRelative = (dateStr) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
};

const formatRupiah = (num) => {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

const activities = computed(() =>
  rawTransactions.value.map(t => ({
    id: t.id,
    title: t.note || t.category?.name || 'Transaksi',
    time: formatRelative(t.createdAt),
    amount: formatRupiah(t.amount),
    amountColor: t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500',
    icon: t.type === 'EXPENSE' ? ArrowDownIcon : ArrowUpIcon,
    iconBg: t.type === 'EXPENSE' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20',
    iconColor: t.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500',
  }))
);

onMounted(async () => {
  if (!hasBudgeting.value) {
    loading.value = false;
    return;
  }
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const res = await axios.get(`${baseUrl}/budget/transactions?limit=6`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    rawTransactions.value = res.data?.data || [];
  } catch (e) {
    console.warn('[RecentActivity] Gagal fetch:', e.message);
  } finally {
    loading.value = false;
  }
});
</script>
