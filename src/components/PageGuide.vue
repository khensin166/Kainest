<template>
  <div class="inline-block">
    <!-- Trigger Button -->
    <button 
      @click="isOpen = true"
      class="p-1.5 rounded-full bg-brand-light text-brand-primary hover:bg-brand-soft transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
      title="Buku Panduan"
    >
      <IconDocument class="w-5 h-5" aria-hidden="true" />
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
          <h3 class="text-lg font-bold text-text-primary">
            Panduan Halaman
          </h3>
        </div>
      </template>

      <template #body>
        <!-- Perhatikan min-h-[350px] dan h-auto agar konten panjang tidak terpotong -->
        <div class="relative overflow-hidden w-full min-h-[350px] h-auto flex flex-col justify-between mt-2">
          
          <!-- Slide Content (Swipeable Native CSS Carousel) -->
          <div 
            ref="sliderRef"
            class="flex overflow-x-auto snap-x snap-mandatory w-full no-scrollbar"
            @scroll="handleSliderScroll"
          >
            <div 
              v-for="(step, index) in steps" 
              :key="index" 
              class="w-full shrink-0 snap-center flex flex-col items-center text-center px-4 pt-4 pb-6"
            >
              <div class="w-24 h-24 shrink-0 rounded-full bg-brand-light flex items-center justify-center text-5xl mb-6 border border-brand-soft animate-bounce-slow">
                {{ step.emoji }}
              </div>
              
              <!-- Judul -->
              <h4 class="text-xl font-bold text-text-primary mb-3">
                {{ step.title }}
              </h4>
              
              <!-- Deskripsi dengan v-html agar bisa support tag HTML seperti <strong> jika diperlukan -->
              <div 
                class="text-sm text-text-muted leading-relaxed space-y-2 text-left w-full px-2"
                v-html="step.desc"
              ></div>
            </div>
          </div>

          <!-- Navigation & Pagination -->
          <div class="flex flex-col items-center mt-auto w-full space-y-4 pt-4 border-t border-border-default">
            <!-- Dots -->
            <div class="flex space-x-2 flex-wrap justify-center gap-y-2">
              <button 
                v-for="(step, index) in steps" 
                :key="index"
                @click="setStep(index)"
                :class="[ 'h-2 rounded-full transition-all duration-300', currentStep === index ? 'w-6 bg-brand-primary' : 'w-2 bg-surface-subtle hover:bg-brand-primary-hover border border-border-default' ]"
                :aria-label="'Go to step ' + (index + 1)"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex w-full justify-between items-center px-2 pb-2">
              <Button
                variant="ghost"
                :class="{ 'opacity-0 pointer-events-none': currentStep === 0 }"
                @click="prevStep"
              >
                Kembali
              </Button>

              <Button @click="nextStep">
                {{ currentStep === steps.length - 1 ? 'Selesai' : 'Selanjutnya' }}
              </Button>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { IconDocument } from '@/ui/icons';
import { ref } from 'vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import { Button } from '@/ui';

/**
 * PERINGATAN: `step.desc` dirender dengan `v-html` agar mendukung <strong>/<em>.
 * Karena itu isinya HANYA boleh berasal dari `src/config/pageGuides.js` yang
 * statis. Jangan pernah mengalirkan teks dari API atau input pengguna ke sini —
 * itu akan membuka celah XSS.
 */
const props = defineProps({
  steps: {
    type: Array,
    required: true,
    validator: (val) => val.every(step => step.emoji && step.title && step.desc)
  }
});

const isOpen = ref(false);
const currentStep = ref(0);
const sliderRef = ref(null);

const handleSliderScroll = () => {
  if (!sliderRef.value) return;
  const scrollLeft = sliderRef.value.scrollLeft;
  const width = sliderRef.value.clientWidth;
  if (width === 0) return;
  
  // Calculate current step based on scroll position (round to nearest step)
  const newStep = Math.round(scrollLeft / width);
  if (newStep !== currentStep.value) {
    currentStep.value = newStep;
  }
};

const handleClose = () => {
  isOpen.value = false;
  setTimeout(() => {
    currentStep.value = 0;
    if (sliderRef.value) {
      sliderRef.value.scrollTo({ left: 0 });
    }
  }, 300);
};

const scrollToStep = (index) => {
  if (!sliderRef.value) return;
  const width = sliderRef.value.clientWidth;
  sliderRef.value.scrollTo({
    left: index * width,
    behavior: 'smooth'
  });
};

const nextStep = () => {
  if (currentStep.value < props.steps.length - 1) {
    scrollToStep(currentStep.value + 1);
  } else {
    handleClose();
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    scrollToStep(currentStep.value - 1);
  }
};

const setStep = (index) => {
  scrollToStep(index);
};
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-bounce-slow { animation: none; }
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
