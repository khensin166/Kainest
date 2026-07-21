<template>
  <div class="flex flex-col min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-1">
          WhatsApp Device Hub
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Kelola koneksi multi-device GOWA secara real-time.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Status Server -->
        <div class="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">GOWA Server Online</span>
        </div>
        <!-- Tambah Device -->
        <button @click="promptAddDevice" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl shadow-md transition-colors text-sm font-medium flex items-center gap-2">
          <i class="fa-solid fa-plus"></i> Tambah Device
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="gowaStore.isLoading && gowaStore.devices.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
      <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-primary"></i>
      <p>Memuat perangkat...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="gowaStore.devices.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <i class="fa-solid fa-mobile-screen text-5xl mb-4 text-gray-300 dark:text-gray-600"></i>
      <p class="text-lg font-medium mb-1">Belum Ada Device</p>
      <p class="text-sm mb-6">Tambahkan device baru untuk menghubungkan WhatsApp Bot.</p>
      <button @click="promptAddDevice" class="text-primary hover:text-primary-dark font-medium underline">
        Tambah Device Sekarang
      </button>
    </div>

    <!-- Device Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div v-for="device in gowaStore.devices" :key="device.id" class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
        
        <!-- Decoration Blur -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" :class="getDeviceColors(device.id, device.status).bg">
              <i class="fa-brands fa-whatsapp" :class="getDeviceColors(device.id, device.status).text"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-800 dark:text-white text-lg leading-tight">{{ device.id }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-0.5">ID Device</p>
            </div>
          </div>
          
          <div class="flex flex-col items-end gap-2">
            <span class="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 border" :class="getStatusBadgeClass(device.status)">
              <span v-if="device.status === 'CONNECTED'" class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              <i v-else-if="device.status === 'CONNECTING'" class="fa-solid fa-circle-notch fa-spin"></i>
              {{ getStatusLabel(device.status) }}
            </span>
            <button @click="confirmDeleteDevice(device.id)" class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-colors text-xs" title="Hapus Device">
              <i class="fa-solid fa-trash-can"></i> Hapus
            </button>
          </div>
        </div>

        <div class="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
          
          <!-- Content Left -->
          <div class="flex-1 space-y-2 text-center md:text-left">
            <template v-if="device.status === 'CONNECTED'">
              <h4 class="font-bold text-green-600 dark:text-green-400">Bot Aktif & Siap Digunakan</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Koneksi WebSocket stabil. Bot akan merespons pesan otomatis berdasarkan fitur aktif.
              </p>
              <button @click="confirmLogoutDevice(device.id)" class="mt-4 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm w-full md:w-auto">
                Keluar Perangkat (Logout)
              </button>
            </template>
            <template v-else-if="device.status === 'UNPAIRED'">
              <h4 class="font-bold text-amber-600 dark:text-amber-400">Scan QR Code</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Buka WhatsApp di HP Anda > Perangkat Tertaut > Tautkan Perangkat.
              </p>
              <p class="text-xs text-gray-500 mt-2">
                <i class="fa-solid fa-circle-info mr-1"></i> QR Code akan refresh otomatis.
              </p>
            </template>
            <template v-else>
              <h4 class="font-bold text-blue-600 dark:text-blue-400">Menghubungkan...</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Mencoba terhubung ke server GOWA melalui WebSocket.
              </p>
            </template>
          </div>

          <!-- Content Right (QR/Status Icon) -->
          <div class="flex-shrink-0 flex items-center justify-center p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" style="width: 160px; height: 160px;">
            <template v-if="device.status === 'CONNECTED'">
              <div class="text-green-500 text-6xl">
                <i class="fa-solid fa-circle-check"></i>
              </div>
            </template>
            <template v-else-if="device.status === 'UNPAIRED'">
              <img v-if="gowaStore.qrCodes[device.id]" :src="gowaStore.qrCodes[device.id]" alt="QR Code" class="w-full h-full object-contain rounded-lg" />
              <div v-else class="flex flex-col items-center justify-center text-gray-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <span class="text-xs">Memuat QR...</span>
              </div>
            </template>
            <template v-else>
              <div class="text-gray-300 dark:text-gray-600 text-5xl animate-pulse">
                <i class="fa-brands fa-whatsapp"></i>
              </div>
            </template>
          </div>

        </div>
      </div>
    </div>

    <!-- Konfirmasi Modal (reusable) -->
    <GlobalDeleteModal />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useGowaStore } from '../stores/useGowaStore';
import { useModalStore } from '@/stores/modalStore';
import GlobalDeleteModal from '@/components/modals/GlobalDeleteModal.vue';

const gowaStore = useGowaStore();
const modalStore = useModalStore();

onMounted(async () => {
  await gowaStore.fetchDevices();
  gowaStore.initWebSockets();
});

onUnmounted(() => {
  gowaStore.cleanupSockets();
});

// -- Helpers --
const getStatusLabel = (status) => {
  switch (status) {
    case 'CONNECTED': return 'Online';
    case 'UNPAIRED': return 'Scan QR';
    case 'CONNECTING': return 'Connecting...';
    case 'DISCONNECTED': return 'Offline';
    default: return status;
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'CONNECTED': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    case 'UNPAIRED': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    case 'DISCONNECTED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  }
};

const getDeviceColors = (id, status) => {
  if (status === 'CONNECTED') {
    return { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-400' };
  }
  // Warnai berdasarkan awalan nama agar gampang dibedakan (staging vs prod)
  if (id.toLowerCase().includes('prod')) {
    return { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400' };
  } else if (id.toLowerCase().includes('stag')) {
    return { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400' };
  }
  return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' };
};

// -- Actions --
const promptAddDevice = () => {
  const deviceId = window.prompt("Masukkan ID Device (contoh: staging, production):");
  if (deviceId && deviceId.trim() !== '') {
    gowaStore.createDevice(deviceId.trim().toLowerCase());
  }
};

const confirmDeleteDevice = (id) => {
  modalStore.openDeleteModal({
    title: `Hapus Device ${id}?`,
    message: `Menghapus device akan memutus koneksi WhatsApp selamanya. Anda yakin?`,
    onConfirm: () => gowaStore.deleteDevice(id)
  });
};

const confirmLogoutDevice = (id) => {
  modalStore.openDeleteModal({
    title: `Logout Device ${id}?`,
    message: `WhatsApp bot pada perangkat ini akan dikeluarkan. Anda harus scan ulang untuk terhubung. Lanjutkan?`,
    onConfirm: () => gowaStore.logoutDevice(id)
  });
};
</script>
