<template>
  <div class="bg-surface-card rounded-2xl border border-border-default shadow-none overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-border-default">
        <div class="flex items-center gap-2">
          <ClockIcon class="w-4 h-4 text-brand-primary" />
          <h2 class="text-sm font-semibold text-text-primary">Aktivitas Terbaru</h2>
        </div>
        <router-link v-if="hasBudgeting" to="/app/transactions"
          class="text-xs text-brand-primary hover:underline font-medium">
          Lihat Semua
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-5 space-y-4">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-surface-hover animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-surface-hover rounded animate-pulse w-3/4"></div>
            <div class="h-2.5 bg-surface-hover rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="activities.length === 0" class="flex flex-col items-center justify-center py-10 px-5 text-center">
        <div class="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center mb-3">
          <InboxIcon class="w-6 h-6 text-brand-muted" />
        </div>
        <p class="text-sm font-medium text-text-primary">Belum ada aktivitas</p>
        <p class="text-xs text-text-muted mt-1">Mulai catat transaksi pertama kamu!</p>
      </div>

      <!-- Activity List -->
      <ul v-else class="divide-y divide-border-default">
        <li v-for="activity in activities" :key="activity.id"
          class="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-hover transition-colors">
          <div :class="['w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', activity.iconBg]">
            <component :is="activity.icon" :class="['w-4 h-4', activity.iconColor]" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{{ activity.title }}</p>
            <p class="text-xs text-text-muted">{{ activity.time }}</p>
          </div>
          <span v-if="activity.amount" :class="['text-sm font-semibold flex-shrink-0', activity.amountColor]">
            {{ activity.amount }}
          </span>
        </li>
      </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { ClockIcon, InboxIcon, ArrowDownIcon, ArrowUpIcon, BoltIcon, LinkIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { formatRupiah } from '@/utils/Utils';

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


const activities = computed(() =>
  rawTransactions.value.map(t => ({
    id: t.id,
    title: t.note || t.category?.name || 'Transaksi',
    time: formatRelative(t.createdAt),
    amount: (t.type === 'INCOME' ? '+ ' : '- ') + formatRupiah(t.amount),
    amountColor: t.type === 'EXPENSE' ? 'text-status-danger' : 'text-status-success',
    icon: t.type === 'EXPENSE' ? ArrowDownIcon : ArrowUpIcon,
    iconBg: t.type === 'EXPENSE' ? 'bg-status-danger/10' : 'bg-status-success/10',
    iconColor: t.type === 'EXPENSE' ? 'text-status-danger' : 'text-status-success',
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
