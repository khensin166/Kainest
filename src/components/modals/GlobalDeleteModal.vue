<script setup>
import { useModalStore } from '../../stores/modalStore';
import BaseModal from './BaseModal.vue';
import { DialogTitle } from '@headlessui/vue';

const modalStore = useModalStore();
</script>

<template>
    <BaseModal :isOpen="modalStore.isDeleteOpen" @close="modalStore.closeDeleteModal" size="sm">
        <template #header>
            <div class="flex items-start gap-4">
                <div
                    class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-500" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <DialogTitle>
                        {{ modalStore.deleteTitle }}
                    </DialogTitle>
                </div>
            </div>
        </template>

        <template #body>
            <div>
                <p class="text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {{ modalStore.deleteMessage }}
                </p>
                <div
                    class="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-100 dark:border-red-900/30 flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-semibold text-red-700 dark:text-red-300">
                            Perhatian: Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <button type="button"
                class="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors duration-200 sm:ml-3 sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                @click="modalStore.confirmDeleteAction" :disabled="modalStore.isDeleting">

                <span v-if="modalStore.isDeleting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Menghapus...
                </span>
                <span v-else>Ya, Hapus</span>
            </button>

            <button type="button"
                class="mt-2 sm:mt-0 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 sm:w-auto"
                @click="modalStore.closeDeleteModal" :disabled="modalStore.isDeleting">
                Batal
            </button>
        </template>
    </BaseModal>
</template>