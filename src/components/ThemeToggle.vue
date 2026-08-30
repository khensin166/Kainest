<!-- ThemeToggle.vue — pemilih tema.
     Dulu tombol siklus; dengan empat tema itu berarti sampai 4 klik untuk
     kembali, dan pengguna tidak bisa melihat pilihan yang tersedia.
     API komponen TIDAK berubah — 7 halaman pemanggilnya tidak perlu disentuh. -->
<script setup>
import { computed } from 'vue';
import { useTheme, THEMES } from '@/composables/useTheme';
import { useCelebration } from '@/composables/useCelebration';
import {
  DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItemIndicator,
} from 'reka-ui';
import { IconSun, IconCheck } from '@/ui/icons';

const mode = useTheme();
const { celebrate } = useCelebration();

/** Dipicu hanya saat BERALIH ke Spidey — bukan saat halaman dimuat ulang. */
const onSelectTheme = (value) => {
  const berpindahKeSpidey = value === 'spidey' && mode.value !== 'spidey';
  mode.value = value;
  if (berpindahKeSpidey) celebrate('spidey-theme');
};

/** `auto` mengikuti preferensi sistem; jatuhkan ke light/dark untuk ikon trigger. */
const displayMode = computed(() => {
  if (mode.value === 'auto') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode.value;
});

const activeIcon = computed(
  () => THEMES.find((t) => t.value === displayMode.value)?.icon ?? IconSun
);
const activeLabel = computed(
  () => THEMES.find((t) => t.value === displayMode.value)?.label ?? 'Terang'
);
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer
             text-text-muted hover:bg-surface-hover hover:text-text-primary
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      :aria-label="`Tema: ${activeLabel}`"
    >
      <component :is="activeIcon" class="w-4 h-4" aria-hidden="true" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="6"
        align="end"
        class="z-50 min-w-44 p-1 rounded-md bg-surface-card border border-border-default"
      >
        <DropdownMenuRadioGroup :model-value="mode" @update:model-value="onSelectTheme">
          <DropdownMenuRadioItem
            v-for="t in THEMES"
            :key="t.value"
            :value="t.value"
            class="relative flex items-center gap-2.5 pl-2.5 pr-8 py-2 text-sm rounded-sm cursor-pointer select-none
                   text-text-secondary data-[highlighted]:bg-surface-hover data-[highlighted]:text-text-primary
                   data-[state=checked]:text-text-primary data-[state=checked]:font-semibold
                   focus-visible:outline-none"
          >
            <component :is="t.icon" class="w-4 h-4 shrink-0" aria-hidden="true" />
            {{ t.label }}
            <DropdownMenuItemIndicator class="absolute right-2.5">
              <IconCheck class="w-4 h-4 text-brand-primary" aria-hidden="true" />
            </DropdownMenuItemIndicator>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
