<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full"
      :class="{ 'bg-gray-200 dark:bg-gray-800': dropdownOpen }"
      aria-haspopup="true"
      @click.stop="toggle"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Info</span>
      <svg class="fill-current text-gray-500/80 dark:text-gray-400/80" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 7.5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
        <path fill-rule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm6-8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z" />
      </svg>
    </button>

    <!-- Backdrop (mobile only) -->
    <transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-show="dropdownOpen" class="fixed inset-0 z-20 bg-black/20 sm:hidden" @click.stop="close" />
    </transition>

    <!-- Dropdown panel -->
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="dropdownOpen" ref="dropdown"
        class="z-30 min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden
               sm:absolute sm:top-full sm:mt-1
               fixed left-1/2 -translate-x-1/2 top-16 sm:transform-none"
        :class="align === 'right' ? 'sm:right-0' : 'sm:left-0'">

        <div class="flex items-center justify-between px-3 pt-1.5 pb-2">
          <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Need help?</div>
          <!-- Close button (mobile) -->
          <button @click.stop="close" class="sm:hidden w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul @focusin="open" @focusout="close">
          <li>
            <router-link class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3" to="#0" @click="close">
              <svg class="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                <rect y="3" width="12" height="9" rx="1" />
                <path d="M2 0h8v2H2z" />
              </svg>
              <span>Documentation</span>
            </router-link>
          </li>
          <li>
            <router-link class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3" to="#0" @click="close">
              <svg class="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                <path d="M10.5 0h-9A1.5 1.5 0 000 1.5v9A1.5 1.5 0 001.5 12h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 0zM10 7L8.207 5.207l-3 3-1.414-1.414 3-3L5 2h5v5z" />
              </svg>
              <span>Support Site</span>
            </router-link>
          </li>
          <li>
            <router-link class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3" to="#0" @click="close">
              <svg class="w-3 h-3 fill-current text-violet-500 shrink-0 mr-2" viewBox="0 0 12 12">
                <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" />
              </svg>
              <span>Contact us</span>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useHeaderDropdown } from '@/stores/headerDropdownStore';

defineProps(['align']);

const { activeDropdown, toggle: _toggle, open: _open, close: _close } = useHeaderDropdown('help');

const trigger = ref(null);
const dropdown = ref(null);

const dropdownOpen = computed(() => activeDropdown.value === 'help');

const toggle = () => _toggle();
const open = () => _open();
const close = () => _close();

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
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});
</script>