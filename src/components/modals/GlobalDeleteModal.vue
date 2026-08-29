<script setup>
import { Spinner } from '@/ui';
import { IconWarning } from '@/ui/icons';
import { useModalStore } from '../../stores/modalStore';
import BaseModal from './BaseModal.vue';

const modalStore = useModalStore();
</script>

<template>
    <BaseModal :isOpen="modalStore.isDeleteOpen" @close="modalStore.closeDeleteModal" size="sm">
        <template #header>
            <div class="flex items-start gap-4">
                <div
                    class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-status-danger-bg">
                    <IconWarning class="h-6 w-6 text-status-danger" aria-hidden="true" />
                </div>
                <div>
                    <span>{{ modalStore.deleteTitle }}</span>
                </div>
            </div>
        </template>

        <template #body>
            <div>
                <p class="text-base text-text-secondary mb-4 leading-relaxed">
                    {{ modalStore.deleteMessage }}
                </p>
                <div
                    class="rounded-lg bg-status-danger-bg p-3 border border-status-danger/30 flex">
                    <div class="flex-shrink-0">
                        <IconWarning class="h-5 w-5 text-status-danger" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-semibold text-status-danger-text">
                            Perhatian: Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <button type="button"
                class="inline-flex w-full justify-center rounded-lg bg-status-danger px-4 py-2.5 text-sm font-bold text-white hover:bg-status-danger/90 focus:outline-none transition-colors duration-200 sm:ml-3 sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                @click="modalStore.confirmDeleteAction()" :disabled="modalStore.isDeleting">

                <span v-if="modalStore.isDeleting" class="flex items-center">
                    <Spinner class="-ml-1 mr-2 h-4 w-4 text-white" />
                    Memproses...
                </span>
                <span v-else>{{ modalStore.deleteConfirmLabel }}</span>
            </button>

            <button type="button"
                class="mt-2 sm:mt-0 inline-flex w-full justify-center rounded-lg border border-border-default px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors duration-200 sm:w-auto"
                @click="modalStore.closeDeleteModal()" :disabled="modalStore.isDeleting">
                Batal
            </button>
        </template>
    </BaseModal>
</template>
