<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Props agar dinamis
const props = defineProps({
  // Label tidak terlalu terpakai jika menggunakan slot, tapi dibiarkan sebagai fallback
  label: { type: String, default: 'Select' },
  options: { type: Array, required: true }, // Array objek: [{ label: '10', value: 10 }]
  modelValue: { type: [String, Number], default: null }, // Nilai yang terpilih (v-model)
  align: { type: String, default: 'right' }, // Posisi dropdown ('left' atau 'right')
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
    <button ref="trigger" class="btn px-3 flex items-center transition-colors duration-200" :class="[
      dropdownOpen
        ? 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700/50 dark:hover:bg-violet-900/40' // Style saat AKTIF (Terbuka)
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400' // Style DEFAULT (Tertutup)
    ]" aria-haspopup="true" @click.prevent="dropdownOpen = !dropdownOpen" :aria-expanded="dropdownOpen">

      <slot name="trigger" :value="modelValue">
        <span class="mr-2">{{ label }}: {{ modelValue }}</span>
        <svg class="fill-current shrink-0 transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }"
          width="12" height="8" viewBox="0 0 12 8">
          <path d="M1.4 0L6 4.6 10.6 0 12 1.4 6 7.4 0 1.4z" />
        </svg>
      </slot>

    </button>

    <transition enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-out duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-show="dropdownOpen" ref="dropdown"
        class="origin-top-right z-50 absolute top-full min-w-[9rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'right-0' : 'left-0'">
        <ul class="text-sm font-medium">
          <li v-for="option in options" :key="option.value">
            <button @click="selectOption(option.value)"
              class="flex items-center w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-150"
              :class="modelValue === option.value
                ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-gray-700'
                : 'text-gray-600 dark:text-gray-300'">

              <span class="grow text-left">{{ option.label }}</span>

              <span v-if="modelValue === option.value"
                class="shrink-0 ml-2 w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400">
              </span>

            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>