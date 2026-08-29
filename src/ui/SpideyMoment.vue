<!-- SpideyMoment.vue — kejutan visual khas tema Spidey.
     Dirender sekali di App.vue; dipicu lewat useCelebration(), bukan dipasang
     manual di tiap halaman. Aturan kapan boleh muncul ada di composable itu. -->
<script setup>
import { useCelebration } from '@/composables/useCelebration'

const { active, current, dismiss } = useCelebration()
</script>

<template>
  <Transition name="spidey">
    <div
      v-if="active"
      class="fixed z-[100] pointer-events-none select-none"
      :class="current.anchor"
      aria-hidden="true"
    >
      <img
        :src="current.src"
        :width="current.width"
        alt=""
        class="block"
        @click="dismiss"
      />
    </div>
  </Transition>
</template>

<style scoped>
/* GIF-nya sudah membawa animasinya sendiri; di sini hanya muncul & pudar
   supaya tidak ada dua gerakan yang saling bertabrakan. */
.spidey-enter-active { transition: opacity 220ms ease-out; }
.spidey-leave-active { transition: opacity 600ms ease-in; }
.spidey-enter-from,
.spidey-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .spidey-enter-active,
  .spidey-leave-active { transition: none; }
}
</style>
