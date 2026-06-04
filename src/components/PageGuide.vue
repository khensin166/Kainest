<template>
  <div class="inline-block">
    <!-- Trigger Button -->
    <button 
      @click="isOpen = true"
      class="p-1.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      title="Buku Panduan"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
    </button>

    <!-- Modal -->
    <BaseModal 
      :isOpen="isOpen" 
      size="md" 
      @close="handleClose"
      hideFooter
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Panduan Halaman
          </h3>
        </div>
      </template>

      <template #body>
        <!-- Perhatikan min-h-[350px] dan h-auto agar konten panjang tidak terpotong -->
        <div class="relative overflow-hidden w-full min-h-[350px] h-auto flex flex-col justify-between mt-2">
          
          <!-- Slide Content -->
          <transition name="slide-fade" mode="out-in">
            <div :key="currentStep" class="flex flex-col items-center text-center px-4 pt-4 pb-6">
              <!-- Icon/Emoji Besar -->
              <div class="w-24 h-24 shrink-0 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-5xl mb-6 shadow-inner animate-bounce-slow">
                {{ steps[currentStep].emoji }}
              </div>
              
              <!-- Judul -->
              <h4 class="text-xl font-extrabold text-gray-900 dark:text-white mb-3">
                {{ steps[currentStep].title }}
              </h4>
              
              <!-- Deskripsi dengan v-html agar bisa support tag HTML seperti <strong> jika diperlukan -->
              <div 
                class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed space-y-2 text-left w-full px-2"
                v-html="steps[currentStep].desc"
              ></div>
            </div>
          </transition>

          <!-- Navigation & Pagination -->
          <div class="flex flex-col items-center mt-auto w-full space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700/60">
            <!-- Dots -->
            <div class="flex space-x-2 flex-wrap justify-center gap-y-2">
              <button 
                v-for="(step, index) in steps" 
                :key="index"
                @click="setStep(index)"
                :class="[
                  'h-2 rounded-full transition-all duration-300',
                  currentStep === index ? 'w-6 bg-violet-600' : 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-violet-400'
                ]"
                :aria-label="'Go to step ' + (index + 1)"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex w-full justify-between items-center px-2 pb-2">
              <button 
                @click="prevStep" 
                class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                :class="{ 'opacity-0 pointer-events-none': currentStep === 0 }"
              >
                Kembali
              </button>
              
              <button 
                @click="nextStep"
                class="px-6 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {{ currentStep === steps.length - 1 ? 'Selesai' : 'Selanjutnya' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/modals/BaseModal.vue';

const props = defineProps({
  steps: {
    type: Array,
    required: true,
    validator: (val) => val.every(step => step.emoji && step.title && step.desc)
  }
});

const isOpen = ref(false);
const currentStep = ref(0);

const handleClose = () => {
  isOpen.value = false;
  setTimeout(() => {
    currentStep.value = 0;
  }, 300);
};

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++;
  } else {
    handleClose();
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const setStep = (index) => {
  currentStep.value = index;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
