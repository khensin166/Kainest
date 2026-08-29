<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="w-8 h-8 flex items-center justify-center hover:bg-surface-hover rounded-full"
      aria-haspopup="true"
      @click.prevent="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <span class="sr-only">Need help?</span>
      <IconInfo class="w-4 h-4 fill-current text-text-muted" aria-hidden="true" />
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
        class="origin-top-right z-10 absolute top-full min-w-44 bg-surface-card border border-border-default py-1.5 rounded-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'right-0' : 'left-0'">

        <div class="flex items-center justify-between px-3 pt-1.5 pb-2">
          <div class="text-xs font-semibold text-text-muted">Need help?</div>
          <!-- Close button (mobile) -->
          <button @click.stop="close" class="sm:hidden w-5 h-5 flex items-center justify-center rounded-full hover:bg-surface-hover text-text-muted">
            <IconClose class="w-3 h-3" aria-hidden="true" />
          </button>
        </div>

        <ul @focusin="open" @focusout="close">
          <li>
            <router-link class="font-medium text-sm text-brand-primary hover:text-brand-primary-hover flex items-center py-1 px-3" to="#0" @click="close">
              <IconDocument class="w-3 h-3 fill-current text-brand-primary shrink-0 mr-2" aria-hidden="true" />
              <span>Documentation</span>
            </router-link>
          </li>
          <li>
            <router-link class="font-medium text-sm text-brand-primary hover:text-brand-primary-hover flex items-center py-1 px-3" to="#0" @click="close">
              <IconDocument class="w-3 h-3 fill-current text-brand-primary shrink-0 mr-2" aria-hidden="true" />
              <span>Support Site</span>
            </router-link>
          </li>
          <li>
            <router-link class="font-medium text-sm text-brand-primary hover:text-brand-primary-hover flex items-center py-1 px-3" to="#0" @click="close">
              <IconSend class="w-3 h-3 fill-current text-brand-primary shrink-0 mr-2" aria-hidden="true" />
              <span>Contact us</span>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { IconClose, IconDocument, IconInfo, IconSend } from '@/ui/icons';
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