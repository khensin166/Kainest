<!-- WaBackupPage.vue -->
<template>
    <div class="p-6 max-w-7xl mx-auto space-y-8">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Backup Chat Manager</h1>
                <p class="text-sm text-gray-500 mt-1">Kelola daftar Chat/Grup yang auto-backup ke database Kainest.</p>
            </div>

            <div class="flex items-center gap-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="waStore.apiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    <span class="w-2 h-2 rounded-full mr-2"
                        :class="waStore.apiKey ? 'bg-green-600' : 'bg-red-600'"></span>
                    {{ waStore.apiKey ? 'Terhubung' : 'Terputus dari Bot API' }}
                </span>
            </div>
        </div>

        <!-- Peringatan jika belum set Base URL / API Key -->
        <div v-if="!waStore.apiKey || !waStore.baseUrl" class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-amber-700">
                        Anda harus mengatur Base URL dan API Key Server Bot terlebih dahulu di menu <strong>Konfigurasi
                            API</strong>.
                    </p>
                </div>
            </div>
        </div>

        <div v-if="waStore.apiKey" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- FORM TAMBAH BACKUP -->
            <div class="lg:col-span-1">
                <div
                    class="sticky top-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Tambah Target Backup</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Pilih dari Daftar Grup
                            </label>
                            <select v-model="formBackup.selectedGroup" @change="onSelectGroup"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm">
                                <option value="" disabled>-- Pilih Grup --</option>
                                <option v-for="group in waStore.groups" :key="group.id" :value="group.id">{{ group.name
                                }}</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">Atau ketik ID secara manual di bawah:</p>
                        </div>

                        <hr class="border-gray-200 dark:border-gray-700 my-2" />

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Chat /
                                Grup</label>
                            <input v-model="formBackup.chatId" type="text"
                                placeholder="e.g. 12345@g.us atau 6281...@s.whatsapp.net"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-mono" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama
                                Deskriptif</label>
                            <input v-model="formBackup.chatName" type="text" placeholder="e.g. Grup Keluarga"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session
                                Bot</label>
                            <select v-model="formBackup.sessionId"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm">
                                <option value="backup_1">Backup Bot 1 (backup_1)</option>
                                <option value="primary">Primary Bot (primary)</option>
                            </select>
                        </div>

                        <button @click="handleAddTarget"
                            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah ke Whitelist
                        </button>
                    </div>
                </div>
            </div>

            <!-- DAFTAR TARGET -->
            <div class="lg:col-span-2 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Daftar Backup Targets</h3>
                    <button @click="fetchData" :disabled="waStore.isLoading"
                        class="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2">
                        <svg v-if="waStore.isLoading" class="animate-spin h-3 w-3" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ waStore.isLoading ? 'Memuat...' : 'Refresh Data' }}
                    </button>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div class="overflow-x-auto min-h-[400px]">
                        <table class="w-full text-left text-sm table-pin-rows">
                            <thead
                                class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                                <tr>
                                    <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Deskripsi</th>
                                    <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Chat ID (Target)
                                    </th>
                                    <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white">Sesi Listener</th>
                                    <th class="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-if="waStore.backupTargets.length === 0 && !waStore.isLoading"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                        Belum ada whitelist log percakapan. Mulai tambahkan target dari sisi kiri.
                                    </td>
                                </tr>
                                <tr v-for="target in waStore.backupTargets" :key="target.id"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ target.name
                                        || '-' }}</td>
                                    <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ target.chat_id }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="px-2 py-1 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                            {{ target.session_id }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button @click="handleRemoveTarget(target.id, target.name)"
                                            class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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

const formBackup = reactive({
    selectedGroup: '',
    chatId: '',
    chatName: '',
    sessionId: 'backup_1'
});

const fetchData = async () => {
    await waStore.fetchBackupTargets();
    await waStore.fetchGroups(); // Panggil fetchGroups juga jika belum ada
};

const onSelectGroup = () => {
    if (formBackup.selectedGroup) {
        formBackup.chatId = formBackup.selectedGroup;
        // Auto-fill chatName based on selected group
        const selected = waStore.groups.find(g => g.id === formBackup.selectedGroup);
        if (selected) {
            formBackup.chatName = selected.name;
        }
    }
};

const handleAddTarget = async () => {
    if (!formBackup.chatId || !formBackup.sessionId) {
        alert("Chat ID dan Session ID harus diisi.");
        return;
    }

    const success = await waStore.addBackupTarget(formBackup.sessionId, formBackup.chatId, formBackup.chatName);
    if (success) {
        alert("Berhasil menambahkan target backup!");
        // Reset form
        formBackup.chatId = '';
        formBackup.chatName = '';
        formBackup.selectedGroup = '';
    }
};

const handleRemoveTarget = async (id, name) => {
    if (confirm(`Yakin ingin menghapus ${name || id} dari daftar backup?`)) {
        const success = await waStore.removeBackupTarget(id);
        if (success) {
            // bisa tambahkan toast misal berhasil
        }
    }
};

watch(
    [() => waStore.apiKey, () => waStore.baseUrl],
    ([newKey, newUrl]) => {
        if (newKey && newUrl) {
            fetchData();
        }
    },
    { immediate: true }
);

onMounted(async () => {
    await waStore.loadConfig();
});
</script>
