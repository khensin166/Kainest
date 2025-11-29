<!-- DropdownSelect.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Props agar dinamis
const props = defineProps({
  label: { type: String, default: 'Select' }, // Label tombol dropdown
  options: { type: Array, required: true }, // Array objek: [{ label: '10', value: 10 }]
  modelValue: { type: [String, Number], default: null }, // Nilai yang terpilih (v-model)
  align: { type: String, default: 'right' }, // Posisi dropdown
});

const emit = defineEmits(['update:modelValue']);

const dropdownOpen = ref(false);
const trigger = ref(null);
const dropdown = ref(null);

// Menutup dropdown saat klik di luar
const clickHandler = ({ target }) => {
  if (!dropdownOpen.value || dropdown.value.contains(target) || trigger.value.contains(target)) return;
  dropdownOpen.value = false;
};

// Menutup dropdown saat tekan ESC
const keyHandler = ({ keyCode }) => {
  if (!dropdownOpen.value || keyCode !== 27) return;
  dropdownOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
  document.addEventListener('keydown', keyHandler);
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});

// Handler saat opsi dipilih
const selectOption = (value) => {
  emit('update:modelValue', value);
  dropdownOpen.value = false;
};
</script>

<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="btn px-3 bg-white dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400 flex items-center"
      aria-haspopup="true"
      @click.prevent="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <span class="mr-2">{{ label }}: {{ modelValue }}</span>
      <svg class="fill-current shrink-0" width="12" height="8" viewBox="0 0 12 8">
        <path d="M1.4 0L6 4.6 10.6 0 12 1.4 6 7.4 0 1.4z" />
      </svg>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="dropdownOpen"
        ref="dropdown"
        class="origin-top-right z-10 absolute top-full min-w-[8rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'right-0' : 'left-0'"
      >
        <ul class="text-sm font-medium">
          <li v-for="option in options" :key="option.value">
            <button
              @click="selectOption(option.value)"
              class="flex items-center w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/20"
              :class="modelValue === option.value ? 'text-violet-500' : 'text-gray-600 dark:text-gray-300'"
            >
              <span class="grow text-left">{{ option.label }}</span>
              <svg v-if="modelValue === option.value" class="fill-current text-violet-500 shrink-0 ml-2" width="12" height="9" viewBox="0 0 12 9">
                <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>