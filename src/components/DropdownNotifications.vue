<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="relative w-8 h-8 flex items-center justify-center hover:bg-surface-hover rounded-full transition-colors"
      :class="{ 'bg-surface-hover': dropdownOpen }"
      aria-haspopup="true"
      @click.stop="toggle"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Notifikasi</span>
      <IconBell class="w-5 h-5 text-text-muted" />
      <!-- Unread Badge -->
      <span v-if="unreadCount > 0"
        class="absolute top-0 right-0 w-2 h-2 bg-status-danger rounded-full border-2 border-surface-card">
      </span>
    </button>

    <!-- Backdrop (mobile only) -->
    <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-show="dropdownOpen" class="fixed inset-0 z-20 bg-black/20 sm:hidden" @click.stop="close" />
    </transition>

    <!-- Dropdown panel -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-show="dropdownOpen" ref="dropdown"
        class="z-30 bg-surface-card border border-border-default py-2 rounded-lg shadow-xl overflow-hidden w-80 sm:absolute sm:top-full sm:right-0 sm:mt-2 sm:origin-top-right fixed left-1/2 -translate-x-1/2 top-16 sm:transform-none"
        @click.stop>

        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-2 border-b border-border-default">
          <h2 class="text-sm font-semibold text-text-primary">Notifikasi</h2>
          <div class="flex items-center gap-2">
            <span v-if="unreadCount > 0"
              class="text-xs font-medium text-brand-primary bg-brand-surface px-2 py-0.5 rounded-full">
              {{ unreadCount }} baru
            </span>
            <!-- Close button (mobile) -->
            <button @click.stop="close" class="sm:hidden w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-hover text-text-muted">
              <IconClose class="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-md bg-surface-hover animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-surface-hover rounded animate-pulse w-3/4"></div>
              <div class="h-2.5 bg-surface-hover rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="notifications.length === 0" class="py-8 text-center">
          <div class="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center mx-auto mb-2">
            <IconBellOff class="w-5 h-5 text-text-muted" />
          </div>
          <p class="text-sm text-text-muted">Tidak ada notifikasi</p>
        </div>

        <!-- Notification List -->
        <ul v-else class="max-h-72 overflow-y-auto divide-y divide-border-default">
          <li v-for="notif in notifications" :key="notif.id"
            class="flex items-start gap-3 px-4 py-3 hover:bg-surface-hover cursor-pointer transition-colors"
            :class="{ 'bg-brand-surface/50': !notif.isRead }"
            @click="markRead(notif)">
            <!-- Icon by type -->
            <div :class="['w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0', iconBg(notif.type)]">
              <component :is="iconByType(notif.type)" :class="['w-4 h-4', iconColor(notif.type)]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary truncate">{{ notif.title }}</p>
              <p class="text-xs text-text-muted line-clamp-2 mt-0.5">{{ notif.message }}</p>
              <p class="text-xs text-text-muted/50 mt-1">{{ formatRelative(notif.createdAt) }}</p>
            </div>
            <!-- Unread dot -->
            <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0 mt-1.5"></div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { IconAi, IconBell, IconBellOff, IconClose, IconInfo, IconWarning } from '@/ui/icons';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/features/notifications/presentation/stores/useNotificationStore';
import { storeToRefs } from 'pinia';
import { useHeaderDropdown } from '@/stores/headerDropdownStore';

const { activeDropdown, toggle: _toggle, close: _close } = useHeaderDropdown('notifications');

const trigger = ref(null);
const dropdown = ref(null);
const notificationStore = useNotificationStore();
const { notifications, unreadCount, isLoading: loading } = storeToRefs(notificationStore);

// Computed open state from shared store
const dropdownOpen = computed(() => activeDropdown.value === 'notifications');

const toggle = () => _toggle();
const close = () => _close();

const formatRelative = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return 'Baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
};

const iconByType = (type) => {
  if (type === 'ALERT') return IconWarning;
  if (type === 'AI_INSIGHT') return IconAi;
  return IconInfo;
};

const iconBg = (type) => {
  if (type === 'ALERT') return 'bg-status-danger-bg';
  if (type === 'AI_INSIGHT') return 'bg-ai-soft';
  return 'bg-status-info-bg';
};

const iconColor = (type) => {
  if (type === 'ALERT') return 'text-status-danger';
  if (type === 'AI_INSIGHT') return 'text-ai';
  return 'text-status-info';
};

const markRead = (notif) => notificationStore.markAsRead(notif);

// Close on outside click
const clickHandler = ({ target }) => {
  if (!dropdownOpen.value) return;
  if (!dropdown.value?.contains(target) && !trigger.value?.contains(target)) {
    close();
  }
};

const keyHandler = ({ keyCode }) => {
  if (dropdownOpen.value && keyCode === 27) close();
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
  document.addEventListener('keydown', keyHandler);
  notificationStore.fetchNotifications();
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});
</script>