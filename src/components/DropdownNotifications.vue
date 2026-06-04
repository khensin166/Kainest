<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="relative w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      :class="{ 'bg-gray-100 dark:bg-gray-700': dropdownOpen }"
      aria-haspopup="true"
      @click.stop="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Notifikasi</span>
      <BellIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <!-- Unread Badge -->
      <span v-if="unreadCount > 0"
        class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800">
      </span>
    </button>

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
        class="origin-top-right z-10 absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 rounded-2xl shadow-xl overflow-hidden"
        @click.stop>

        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifikasi</h2>
          <span v-if="unreadCount > 0"
            class="text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">
            {{ unreadCount }} baru
          </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="notifications.length === 0" class="py-8 text-center">
          <div class="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
            <BellSlashIcon class="w-5 h-5 text-gray-400" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Tidak ada notifikasi</p>
        </div>

        <!-- Notification List -->
        <ul v-else class="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
          <li v-for="notif in notifications" :key="notif.id"
            class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer transition-colors"
            :class="{ 'bg-violet-50/50 dark:bg-violet-900/10': !notif.isRead }"
            @click="markRead(notif)">
            <!-- Icon by type -->
            <div :class="['w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', iconBg(notif.type)]">
              <component :is="iconByType(notif.type)" :class="['w-4 h-4', iconColor(notif.type)]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{{ notif.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{{ notif.message }}</p>
              <p class="text-xs text-gray-300 dark:text-gray-600 mt-1">{{ formatRelative(notif.createdAt) }}</p>
            </div>
            <!-- Unread dot -->
            <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5"></div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { BellIcon, BellSlashIcon, SparklesIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';

const dropdownOpen = ref(false);
const trigger = ref(null);
const dropdown = ref(null);
const notifications = ref([]);
const unreadCount = ref(0);
const loading = ref(true);

const apiHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
  if (type === 'ALERT') return ExclamationTriangleIcon;
  if (type === 'AI_INSIGHT') return SparklesIcon;
  return InformationCircleIcon;
};

const iconBg = (type) => {
  if (type === 'ALERT') return 'bg-red-50 dark:bg-red-900/20';
  if (type === 'AI_INSIGHT') return 'bg-violet-50 dark:bg-violet-900/20';
  return 'bg-blue-50 dark:bg-blue-900/20';
};

const iconColor = (type) => {
  if (type === 'ALERT') return 'text-red-500';
  if (type === 'AI_INSIGHT') return 'text-violet-500';
  return 'text-blue-500';
};

const fetchNotifications = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.get(`${baseUrl}/notifications`, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    notifications.value = res.data?.notifications || [];
    unreadCount.value = res.data?.unreadCount ?? 0;
  } catch (e) {
    console.warn('[DropdownNotifications] Gagal fetch:', e.message);
  } finally {
    loading.value = false;
  }
};

const markRead = async (notif) => {
  if (notif.isRead) return;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await axios.patch(`${baseUrl}/notifications/${notif.id}/read`, {}, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    notif.isRead = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  } catch (e) {
    console.warn('[DropdownNotifications] Gagal mark read:', e.message);
  }
};

// Close on outside click
const clickHandler = ({ target }) => {
  if (!dropdownOpen.value) return;
  if (!dropdown.value?.contains(target) && !trigger.value?.contains(target)) {
    dropdownOpen.value = false;
  }
};

const keyHandler = ({ keyCode }) => {
  if (dropdownOpen.value && keyCode === 27) dropdownOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
  document.addEventListener('keydown', keyHandler);
  fetchNotifications();
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});
</script>