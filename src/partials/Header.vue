<template>
  <header
    class="sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-surface-card/90 before:-z-10 z-30"
    :class="[ variant === 'v2' || variant === 'v3' ? 'before:bg-surface-card after:absolute after:h-px after:inset-x-0 after:top-full after:bg-border-default after:-z-10' : 'max-lg:shadow-none lg:before:bg-surface-page/90', variant === 'v2' ? 'before:bg-surface-card' : '', variant === 'v3' ? 'before:bg-surface-page' : '', ]"
  >
    <div class="px-4 sm:px-6 lg:px-8">
      <div
        class="flex items-center justify-between h-16"
        :class="variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-border-default'"
      >

        <!-- Header: Left side -->
        <div class="flex">

          <!-- Hamburger button -->
          <button class="text-text-secondary hover:text-text-primary lg:hidden" @click.stop="$emit('toggle-sidebar')" aria-controls="sidebar" :aria-expanded="sidebarOpen">
            <span class="sr-only">Open sidebar</span>
            <IconMenu class="w-6 h-6 fill-current" aria-hidden="true" />
          </button>

        </div>

        <!-- Header: Right side -->
        <div class="flex items-center space-x-3">
          <div>
          </div>
          <Notifications align="right" />
          <Help align="right" />
          <ThemeToggle />
          <!-- Divider -->
          <hr class="w-px h-6 bg-border-default border-none" />
          <UserMenu align="right" />

        </div>

      </div>
    </div>
  </header>
</template>

<script>
import { IconMenu } from '@/ui/icons'
import { ref } from 'vue'
import DropdownNotifications from '../components/DropdownNotifications.vue'
import DropdownHelp from '../components/DropdownHelp.vue'
import DropdownProfile from '../features/profile/presentation/components/DropdownProfile.vue'
import ThemeToggle from '../components/ThemeToggle.vue'

export default {
  name: 'Header',
  props: [
    'sidebarOpen',
    'variant',
  ],
  components: {
    Notifications: DropdownNotifications,
    Help: DropdownHelp,
    UserMenu: DropdownProfile,
    ThemeToggle,
  }
}
</script>