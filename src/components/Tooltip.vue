<template>
  <div
    class="relative"
    @mouseenter="tooltipOpen = true"
    @mouseleave="tooltipOpen = false"
    @focusin="tooltipOpen = true"
    @focusout="tooltipOpen = false"    
  >
    <div
      class="inline-block"
      aria-haspopup="true"
      :aria-expanded="tooltipOpen"
    >
      <slot name="trigger">
        <button class="block" @click.prevent>
          <IconInfo class="fill-current text-text-muted" aria-hidden="true" />
        </button>
      </slot>
    </div>
    <div class="z-10 absolute" :class="positionOuterClasses(position)">
      <transition
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-out duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="tooltipOpen" class="rounded-lg border overflow-hidden"
          :class="[ colorClasses(bg), sizeClasses(size), positionInnerClasses(position) ]"          
        >
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { IconInfo } from '@/ui/icons'
import { ref } from 'vue'

export default {
  name: 'Tooltip',
  props: ['bg', 'size', 'position'],
  setup() {

    const tooltipOpen = ref(false)

    const positionOuterClasses = (position) => {
      switch (position) {
        case 'right':
          return 'left-full top-1/2 -translate-y-1/2';
        case 'left':
          return 'right-full top-1/2 -translate-y-1/2';
        case 'bottom':
          return 'top-full left-1/2 -translate-x-1/2';
        default:
          return 'bottom-full left-1/2 -translate-x-1/2';
      }
    }
    
    const sizeClasses = (size) => {
      switch (size) {
        case 'lg':
          return 'min-w-72 px-3 py-2';
        case 'md':
          return 'min-w-56 px-3 py-2';
        case 'sm':
          return 'min-w-44 px-3 py-2';
        default:
          return 'px-3 py-2';
      }
    }

    const colorClasses = (bg) => {
      switch (bg) {
        case 'light':
          return 'bg-surface-card text-text-primary border-border-default'
        case 'dark':
          return 'bg-surface-subtle text-text-primary border-border-default'
        default:
          return 'text-text-primary bg-surface-card border-border-default'
      }
    }      

    const positionInnerClasses = (position) => {
      switch (position) {
        case 'right':
          return 'ml-2';
        case 'left':
          return 'mr-2';
        case 'bottom':
          return 'mt-2';
        default:
          return 'mb-2';
      }
    }    

    return {
      tooltipOpen,
      positionOuterClasses,
      sizeClasses,
      colorClasses,
      positionInnerClasses,
    }
  }
}
</script>