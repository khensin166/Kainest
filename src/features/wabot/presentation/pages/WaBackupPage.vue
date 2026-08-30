<!-- WaBackupPage.vue -->
<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto space-y-8">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-3">
                    <h1 class="text-2xl font-bold text-text-primary tracking-tight">Backup Chat Manager</h1>
                    <PageGuide :steps="pageGuides.wabotBackup" />
                </div>
                <p class="text-sm text-text-muted mt-1">Kelola daftar Chat/Grup yang auto-backup ke database Kainest.</p>
            </div>

            <div class="flex items-center gap-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="waStore.apiKey ? 'bg-status-success-bg text-status-success' : 'bg-status-danger-bg text-status-danger'">
                    <span class="w-2 h-2 rounded-full mr-2"
                        :class="waStore.apiKey ? 'bg-status-success' : 'bg-status-danger'"></span>
                    {{ waStore.apiKey ? 'Terhubung' : 'Terputus dari Bot API' }}
                </span>
            </div>
        </div>

        <!-- Peringatan jika belum set Base URL / API Key -->
        <div v-if="!waStore.apiKey || !waStore.baseUrl" class="bg-status-warning-bg border-l-4 border-status-warning p-4 rounded-md">
            <div class="flex">
                <div class="flex-shrink-0">
                    <IconWarning class="h-5 w-5 text-status-warning-text" aria-hidden="true" />
                </div>
                <div class="ml-3">
                    <p class="text-sm text-status-warning-text">
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
                    class="sticky top-6 bg-surface-card rounded-md border border-border-default p-6">
                    <h3 class="text-lg font-bold text-text-primary mb-4">Tambah Target Backup</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-text-primary mb-1">
                                Pilih dari Daftar Grup
                            </label>
                            <select v-model="formBackup.selectedGroup" @change="onSelectGroup"
                                class="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-surface-input text-text-primary text-sm">
                                <option value="" disabled>-- Pilih Grup --</option>
                                <option v-for="group in waStore.groups" :key="group.id" :value="group.id">{{ group.name
                                }}</option>
                            </select>
                            <p class="text-xs text-text-muted mt-1">Atau ketik ID secara manual di bawah:</p>
                        </div>

                        <hr class="border-border-default my-2" />

                        <div>
                            <label class="block text-sm font-medium text-text-primary mb-1">ID Chat /
                                Grup</label>
                            <input v-model="formBackup.chatId" type="text"
                                placeholder="e.g. 12345@g.us atau 6281...@s.whatsapp.net"
                                class="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-surface-input text-text-primary text-sm font-mono" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-text-primary mb-1">Nama
                                Deskriptif</label>
                            <input v-model="formBackup.chatName" type="text" placeholder="e.g. Grup Keluarga"
                                class="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-surface-input text-text-primary text-sm" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-text-primary mb-1">Session
                                Bot</label>
                            <select v-model="formBackup.sessionId"
                                class="w-full px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-surface-input text-text-primary text-sm">
                                <option value="backup_1">Backup Bot 1 (backup_1)</option>
                                <option value="primary">Primary Bot (primary)</option>
                            </select>
                        </div>

                        <button @click="handleAddTarget"
                            class="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-text-inverse rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 border-none">
                            <IconAdd class="h-4 w-4" aria-hidden="true" />
                            Tambah ke Whitelist
                        </button>
                    </div>
                </div>
            </div>

            <!-- DAFTAR TARGET -->
            <div class="lg:col-span-2 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold text-text-primary">Daftar Backup Targets</h3>
                    <button @click="fetchData" :disabled="waStore.isLoading"
                        class="px-3 py-1.5 text-sm bg-surface-subtle border border-border-default rounded-lg hover:bg-surface-hover text-text-primary transition-colors flex items-center gap-2">
                        <Spinner class="h-3 w-3" />
                        {{ waStore.isLoading ? 'Memuat...' : 'Refresh Data' }}
                    </button>
                </div>

                <div
                    class="bg-surface-card rounded-md border border-border-default overflow-hidden">
                    <div class="overflow-x-auto min-h-[400px]">
                        <table class="w-full text-left text-sm table-pin-rows">
                            <thead
                                class="bg-surface-subtle border-b border-border-default sticky top-0 z-10">
                                <tr>
                                    <th class="px-6 py-4 font-semibold text-text-primary">Deskripsi</th>
                                    <th class="px-6 py-4 font-semibold text-text-primary">Chat ID (Target)
                                    </th>
                                    <th class="px-6 py-4 font-semibold text-text-primary">Sesi Listener</th>
                                    <th class="px-6 py-4 font-semibold text-text-primary text-right">Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border-default">
                                <tr v-if="waStore.backupTargets.length === 0 && !waStore.isLoading"
                                    class="hover:bg-surface-hover">
                                    <td colspan="4" class="p-0">
                                        <BaseEmptyState 
                                            :icon="IconForum"
                                            title="Belum ada Target Backup"
                                            message="Belum ada whitelist log percakapan. Mulai tambahkan target dari sisi kiri."
                                            heightClass="py-12"
                                        />
                                    </td>
                                </tr>
                                <tr v-for="target in waStore.backupTargets" :key="target.id"
                                    class="hover:bg-surface-hover transition-colors">
                                    <td class="px-6 py-4 font-medium text-text-primary">{{ target.name
                                        || '-' }}</td>
                                    <td class="px-6 py-4 font-mono text-xs text-text-muted">{{ target.chat_id }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="px-2 py-1 rounded text-xs font-semibold bg-surface-subtle text-text-primary">
                                            {{ target.session_id }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button @click="handleRemoveTarget(target.id, target.name)"
                                            class="text-status-danger font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-status-danger-bg transition-colors">
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
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { Spinner } from '@/ui';
import { IconAdd, IconForum, IconWarning } from '@/ui/icons';
import { notify } from "@/lib/notify";
import { ref, onMounted, reactive, watch } from 'vue';
import { useWaBotStore } from '../stores/useWaBotStore';
import BaseEmptyState from '@/components/BaseEmptyState.vue';

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
        notify.warning("Chat ID dan Session ID harus diisi.");
        return;
    }

    const success = await waStore.addBackupTarget(formBackup.sessionId, formBackup.chatId, formBackup.chatName);
    if (success) {
        notify.success("Berhasil menambahkan target backup!");
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
