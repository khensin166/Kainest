<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Bot Manager</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola koneksi dan grup WhatsApp Anda.</p>
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          :class="waStore.apiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <span class="w-2 h-2 rounded-full mr-2" :class="waStore.apiKey ? 'bg-green-600' : 'bg-red-600'"></span>
          {{ waStore.apiKey ? 'Terhubung' : 'Terputus' }}
        </span>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          ⚙️ Pengaturan Koneksi
        </h2>
        <button v-if="waStore.apiKey" @click="resetConfig" class="text-sm text-red-600 hover:text-red-800 font-medium">
          Reset API Key
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot API Base URL</label>
          <input v-model="configForm.baseUrl" type="text" placeholder="https://whatsapp-bot-kamu.up.railway.app"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all" />
          <p class="text-xs text-gray-500">Masukkan URL root server bot Anda (tanpa /api).</p>
        </div>

        <div v-if="!waStore.apiKey" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Secret</label>
          <div class="flex gap-2">
            <input v-model="configForm.adminSecret" type="password" placeholder="rahasia123"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            <button @click="handleConnect" :disabled="waStore.isLoading || !configForm.baseUrl"
              class="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <svg v-if="waStore.isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Generate Key
            </button>
          </div>
        </div>

        <div v-else class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key Aktif</label>
          <div class="flex items-center gap-2">
            <code
              class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
              {{ waStore.apiKey }}
            </code>
          </div>
        </div>
      </div>
    </div>

    <div v-if="waStore.apiKey" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <div class="lg:col-span-2 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Daftar Grup</h3>
          <button @click="waStore.fetchGroups" :disabled="waStore.isLoading"
            class="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2">
            <svg v-if="waStore.isLoading" class="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ waStore.isLoading ? 'Memuat...' : 'Refresh Data' }}
          </button>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto h-[500px]">
            <table class="w-full text-left text-sm table-pin-rows">
              <thead
                class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <tr>
                  <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Nama Grup</th>
                  <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">ID Grup</th>
                  <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-if="waStore.groups.length === 0 && !waStore.isLoading"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                    Belum ada data grup. Pastikan bot sudah join grup & klik Refresh.
                  </td>
                </tr>
                <tr v-for="group in waStore.groups" :key="group.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ group.name }}</td>
                  <td class="px-6 py-4">
                    <button @click="copyToClipboard(group.id)"
                      class="font-mono text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-copy"
                      title="Klik untuk menyalin">
                      {{ group.id }}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button @click="selectGroup(group.id)"
                      class="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium text-xs border border-violet-200 dark:border-violet-800 px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors">
                      Pilih
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div
          class="sticky top-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Kirim Pesan</h3>

          <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
            <button class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
              :class="!isGroupMode ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
              @click="isGroupMode = false">
              Personal
            </button>
            <button class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
              :class="isGroupMode ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
              @click="isGroupMode = true">
              Grup
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ isGroupMode ? 'ID Grup' : 'Nomor WhatsApp' }}
              </label>
              <input v-model="messageForm.target" type="text"
                :placeholder="isGroupMode ? 'Pilih dari tabel...' : '628123456789'"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-mono" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pesan</label>
              <textarea v-model="messageForm.message" rows="4" placeholder="Ketik pesan disini..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm resize-none"></textarea>
            </div>

            <button @click="handleSend" :disabled="waStore.isSending"
              class="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              <svg v-if="waStore.isSending" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ waStore.isSending ? 'Mengirim...' : 'Kirim Pesan' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { useWaBotStore } from '../stores/useWaBotStore';

const waStore = useWaBotStore();

// State Form Config
const configForm = reactive({
  baseUrl: '',
  adminSecret: '',
  appName: 'Kainest App'
});

// State Messaging
const isGroupMode = ref(false);
const messageForm = reactive({ target: '', message: '' });

// 1. Initial Load (Sync dengan DB)
onMounted(async () => {
  await waStore.loadConfig();

  // Isi form dengan data dari store jika ada
  if (waStore.baseUrl) configForm.baseUrl = waStore.baseUrl;
  if (waStore.adminSecret) configForm.adminSecret = waStore.adminSecret;

  // Jika sudah punya API Key, langsung ambil grup
  if (waStore.apiKey && waStore.baseUrl) {
    waStore.fetchGroups();
  }
});

// 2. Connect / Generate Key
const handleConnect = async () => {
  if (!configForm.baseUrl || !configForm.adminSecret) {
    alert("Mohon isi URL dan Secret!");
    return;
  }
  try {
    await waStore.connectBot(configForm.baseUrl, configForm.appName, configForm.adminSecret);
    alert("Berhasil terhubung! API Key tersimpan.");
  } catch (e) {
    alert('Gagal menghubungkan: ' + (e.response?.data?.message || e.message));
  }
};

// 3. Send Message
const handleSend = async () => {
  if (!messageForm.target || !messageForm.message) {
    alert("Target dan pesan harus diisi.");
    return;
  }
  try {
    await waStore.sendMessage(messageForm.target, messageForm.message, isGroupMode.value);
    alert('Pesan berhasil dikirim!');
    messageForm.message = '';
  } catch (e) {
    alert('Gagal mengirim pesan.');
  }
};

// 4. Reset
const resetConfig = () => {
  if (confirm("Yakin ingin reset API Key?")) {
    waStore.logout();
  }
};

// Helper: Select Group
const selectGroup = (id) => {
  isGroupMode.value = true;
  messageForm.target = id;
};

// Helper: Copy ID
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  // Bisa tambah toast jika ada library toast
};
</script>