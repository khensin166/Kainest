<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="!loading && emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <slot name="header">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-500"
                >
                  Judul Modal Default
                </DialogTitle>
              </slot>

              <div class="mt-4">
                <slot name="body">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Konten body modal default.
                  </p>
                </slot>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <slot name="footer">
                  <div
                    v-if="loading"
                    class="flex items-center justify-center w-full"
                  >
                    <svg
                      class="animate-spin h-5 w-5 text-[var(--color-violet-600)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <div v-else class="flex justify-end space-x-3">
                    <button
                      @click="emit('close')"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      @click="emit('confirm')"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-violet-500)] focus-visible:ring-offset-2"
                    >
                      Konfirmasi
                    </button>
                  </div>
                </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

defineProps({
  isOpen: { type: Boolean, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "confirm"]);
</script>
