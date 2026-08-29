<template>
  <div class="flex flex-col min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-text-primary mb-1">
          WhatsApp Device Hub
        </h1>
        <p class="text-text-muted text-sm">
          Kelola koneksi multi-device GOWA secara real-time.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Status Server -->
        <div class="flex items-center gap-2 bg-surface-card px-4 py-2 rounded-xl shadow-none border border-border-default">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success"></span>
          </span>
          <span class="text-sm font-medium text-text-primary">GOWA Server Online</span>
        </div>
        <!-- Tambah Device -->
        <button @click="promptAddDevice" class="bg-brand-primary hover:bg-brand-primary-hover text-text-inverse px-4 py-2 rounded-xl shadow-none border-none transition-colors text-sm font-medium flex items-center gap-2">
          <i class="fa-solid fa-plus"></i> Tambah Device
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="gowaStore.isLoading && gowaStore.devices.length === 0" class="flex flex-col items-center justify-center py-20 text-text-muted">
      <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-brand-primary"></i>
      <p>Memuat perangkat...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="gowaStore.devices.length === 0" class="flex flex-col items-center justify-center py-20 text-text-muted bg-surface-card rounded-3xl border border-border-default shadow-none">
      <i class="fa-solid fa-mobile-screen text-5xl mb-4 text-text-muted/50"></i>
      <p class="text-lg font-medium mb-1">Belum Ada Device</p>
      <p class="text-sm mb-6">Tambahkan device baru untuk menghubungkan WhatsApp Bot.</p>
      <button @click="promptAddDevice" class="text-brand-primary hover:text-brand-primary-hover font-medium underline">
        Tambah Device Sekarang
      </button>
    </div>

    <!-- Device Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div v-for="device in gowaStore.devices" :key="device.id" class="bg-surface-card rounded-3xl p-6 shadow-none border border-border-default flex flex-col hover:border-border-strong transition-shadow relative overflow-hidden">
        
        <!-- Decoration Blur -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" :class="getDeviceColors(device.id, device.status).bg">
              <i class="fa-brands fa-whatsapp" :class="getDeviceColors(device.id, device.status).text"></i>
            </div>
            <div>
              <h3 class="font-bold text-text-primary text-lg leading-tight">{{ device.id }}</h3>
              <p class="text-xs text-text-muted uppercase tracking-wider font-semibold mt-0.5">ID Device</p>
            </div>
          </div>
          
          <div class="flex flex-col items-end gap-2">
            <span class="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 border" :class="getStatusBadgeClass(device.status)">
              <span v-if="device.status === 'CONNECTED'" class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              <i v-else-if="device.status === 'CONNECTING'" class="fa-solid fa-circle-notch fa-spin"></i>
              {{ getStatusLabel(device.status) }}
            </span>
            <button @click="confirmDeleteDevice(device.id)" class="text-status-danger hover:bg-status-danger-bg p-1.5 rounded-lg transition-colors text-xs" title="Hapus Device">
              <i class="fa-solid fa-trash-can"></i> Hapus
            </button>
          </div>
        </div>

        <div class="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-subtle p-4 rounded-2xl border border-border-default">
          
          <!-- Content Left -->
          <div class="flex-1 space-y-2 text-center md:text-left">
            <template v-if="device.status === 'CONNECTED'">
              <h4 class="font-bold text-status-success">Bot Aktif & Siap Digunakan</h4>
              <p class="text-sm text-text-muted leading-relaxed">
                Koneksi WebSocket stabil. Bot akan merespons pesan otomatis berdasarkan fitur aktif.
              </p>
              <button @click="confirmLogoutDevice(device.id)" class="mt-4 px-4 py-2 bg-surface-card border border-border-default rounded-xl text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors shadow-none w-full md:w-auto">
                Keluar Perangkat (Logout)
              </button>
            </template>
            <template v-else-if="device.status === 'UNPAIRED'">
              <h4 class="font-bold text-status-warning">Scan QR Code</h4>
              <p class="text-sm text-text-muted leading-relaxed">
                Buka WhatsApp di HP Anda > Perangkat Tertaut > Tautkan Perangkat.
              </p>
              <p class="text-xs text-text-muted mt-2">
                <i class="fa-solid fa-circle-info mr-1"></i> QR Code akan refresh otomatis.
              </p>
            </template>
            <template v-else>
              <h4 class="font-bold text-status-info">Menghubungkan...</h4>
              <p class="text-sm text-text-muted leading-relaxed">
                Mencoba terhubung ke server GOWA melalui WebSocket.
              </p>
            </template>
          </div>

          <!-- Content Right (QR/Status Icon) -->
          <div class="flex-shrink-0 flex items-center justify-center p-2 bg-surface-card rounded-xl shadow-none border border-border-default" style="width: 160px; height: 160px;">
            <template v-if="device.status === 'CONNECTED'">
              <div class="text-status-success text-6xl">
                <i class="fa-solid fa-circle-check"></i>
              </div>
            </template>
            <template v-else-if="device.status === 'UNPAIRED'">
              <img v-if="gowaStore.qrCodes[device.id]" :src="gowaStore.qrCodes[device.id]" alt="QR Code" class="w-full h-full object-contain rounded-lg" />
              <div v-else class="flex flex-col items-center justify-center text-text-muted">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <span class="text-xs">Memuat QR...</span>
              </div>
            </template>
            <template v-else>
              <div class="text-text-muted/50 text-5xl animate-pulse">
                <i class="fa-brands fa-whatsapp"></i>
              </div>
            </template>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useGowaStore } from '../stores/useGowaStore';
import { useModalStore } from '@/stores/modalStore';
// GlobalDeleteModal sudah ter-mount global di App.vue, tidak perlu di-import di sini

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
    case 'CONNECTED': return 'bg-status-success-bg text-status-success border-status-success/30';
    case 'UNPAIRED': return 'bg-status-warning-bg text-status-warning border-status-warning/30';
    case 'DISCONNECTED': return 'bg-status-danger-bg text-status-danger border-status-danger/30';
    default: return 'bg-surface-subtle text-text-primary border-border-default';
  }
};

const getDeviceColors = (id, status) => {
  if (status === 'CONNECTED') {
    return { bg: 'bg-status-success-bg', text: 'text-status-success' };
  }
  // Warnai berdasarkan awalan nama agar gampang dibedakan (staging vs prod)
  if (id.toLowerCase().includes('prod')) {
    return { bg: 'bg-brand-primary/20', text: 'text-brand-primary' };
  } else if (id.toLowerCase().includes('stag')) {
    return { bg: 'bg-status-info-bg', text: 'text-status-info' };
  }
  return { bg: 'bg-surface-subtle', text: 'text-text-muted' };
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
