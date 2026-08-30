<template>
  <Card :padded="false">
    <template #header>
      <IconAnnounce class="w-4 h-4 text-brand-primary" aria-hidden="true" />
      <h2 class="text-sm font-semibold text-text-primary">System Updates</h2>
      <Button v-if="isAdmin" size="sm" variant="ghost" class="ml-auto" :loading="syncing" @click="syncGithub">
        <IconRefresh v-if="!syncing" class="w-3.5 h-3.5" aria-hidden="true" />
        {{ syncing ? 'Menyinkronkan...' : 'Sync GitHub' }}
      </Button>
      <span v-else class="ml-auto text-xs text-text-muted">Kainest Changelog</span>
    </template>

    <div v-if="loading" class="p-5 space-y-4">
      <div v-for="i in 3" :key="i" class="flex items-start gap-3">
        <Skeleton class="w-8 h-8 rounded-md shrink-0" />
        <div class="flex-1 space-y-1.5">
          <Skeleton class="h-3 w-1/4" />
          <Skeleton class="h-2.5 w-full" />
        </div>
      </div>
    </div>

    <EmptyState
      v-else-if="updates.length === 0"
      :icon="IconAnnounce"
      title="Belum ada update sistem."
    />

    <ul v-else class="divide-y divide-border-default max-h-96 overflow-y-auto">
      <li v-for="update in updates" :key="update.id"
        class="flex items-start gap-3 px-5 py-4 hover:bg-surface-hover transition-colors">
        <div class="mt-0.5 w-8 h-8 rounded-md bg-brand-surface flex items-center justify-center shrink-0">
          <IconRelease class="w-4 h-4 text-brand-primary" aria-hidden="true" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <Badge tone="brand">{{ update.version }}</Badge>
            <span class="text-xs text-text-muted">{{ formatDate(update.date) }}</span>
            <Badge v-if="update.badge" tone="success">{{ update.badge }}</Badge>
          </div>
          <a v-if="update.url" :href="update.url" target="_blank" rel="noopener"
            class="text-sm font-medium text-text-primary hover:text-brand-primary hover:underline">{{ update.title }}</a>
          <p v-else class="text-sm font-medium text-text-primary">{{ update.title }}</p>
          <p class="text-xs text-text-muted mt-1 whitespace-pre-line">{{ update.description }}</p>
        </div>
      </li>
    </ul>
  </Card>
</template>

<script setup>
import { IconAnnounce, IconRefresh, IconRelease } from '@/ui/icons';
import { notify } from "@/lib/notify";
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { useDashboardStore } from '@/features/dashboard/presentation/stores/useDashboardStore';
import { storeToRefs } from 'pinia';
import { Button, Card, Badge, Skeleton, EmptyState } from '@/ui';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
// Data mengalir lewat lapisan resmi: store -> use case -> repository -> apiClient.
const { updates, isLoadingUpdates: loading, isSyncing: syncing } = storeToRefs(dashboardStore);

const isAdmin = computed(() => authStore.user?.role === 'admin');

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const syncGithub = async () => {
  const res = await dashboardStore.syncSystemUpdates();
  if (res.ok) {
    notify.success(`Sinkronisasi berhasil: ${res.newlyAdded} update baru, ${res.blasted} notifikasi terkirim.`);
  } else if (res.message !== undefined) {
    notify.error('Gagal melakukan sync dari GitHub.');
  }
};

onMounted(() => dashboardStore.fetchSystemUpdates());
</script>
