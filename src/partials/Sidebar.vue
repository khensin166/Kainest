<template>
  <div class="min-w-fit">
    <div class="fixed inset-0 bg-black/40 z-40 lg:hidden lg:z-auto transition-opacity duration-200"
      :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'" aria-hidden="true"></div>

    <div id="sidebar" ref="sidebar"
      class="flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-surface-card p-4 transition-all duration-200 ease-in-out"
      :class="[ variant === 'v2' ? 'border-r border-border-default' : 'rounded-r-lg', sidebarOpen ? 'translate-x-0' : '-translate-x-64', ]">
      <div v-if="!authStore.user" class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-text-primary"></div>
      </div>

      <div v-else>
        <div class="flex justify-between mb-10 pr-3 sm:px-2">
          <button ref="trigger"
            class="lg:hidden text-text-secondary hover:text-text-primary p-2 rounded-lg hover:bg-surface-hover transition-colors"
            @click.stop="$emit('close-sidebar')" aria-controls="sidebar" :aria-expanded="sidebarOpen">
            <span class="sr-only">Close sidebar</span>
            <IconChevronLeft class="w-5 h-5" />
          </button>

          <router-link class="block" to="/app/dashboard">
            <img src="/images/logo.png" alt="Logo" class="w-8 h-8 object-contain" />
          </router-link>
        </div>

        <div class="space-y-4">
          <template v-for="(group, index) in filteredMenu" :key="index">
            <ul v-if="group.type === 'link'">
              <router-link :to="group.path" custom v-slot="{ href, navigate, isExactActive }">
                <li>
                  <a :href="href" @click="navigate"
                    class="flex items-center text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg px-3 py-2.5 transition-all duration-200 group"
                    :class="isExactActive ? 'bg-surface-hover text-text-primary border-l-2 border-text-primary' : ''">
                    <component :is="group.iconComponent" class="shrink-0 w-5 h-5 transition-colors" :class="isExactActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'" />
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 truncate">{{
                        group.name }}</span>
                  </a>
                </li>
              </router-link>
            </ul>

            <div v-if="group.type === 'group'">
              <h3 class="text-xs text-text-muted font-semibold pl-3 mb-2">
                <span class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                  aria-hidden="true">•••</span>
                <span class="lg:hidden lg:sidebar-expanded:block 2xl:block">{{
                  group.title
                }}</span>
              </h3>
              <ul class="space-y-1">
                <template v-for="item in group.items" :key="item.path">
                  <li>
                    <a v-if="item.path === '/logout'" href="#" @click.prevent="handleLogout"
                      class="flex items-center text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg px-3 py-2.5 transition-all duration-200 group">
                      <component :is="item.iconComponent"
                        class="shrink-0 w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 truncate">{{
                          item.name }}</span>
                    </a>

                    <router-link v-else :to="item.path" custom v-slot="{ href, navigate, isExactActive }">
                      <a :href="href" @click="navigate"
                        class="flex items-center text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg px-3 py-2.5 transition-all duration-200 group"
                        :class="isExactActive ? 'bg-surface-hover text-text-primary border-l-2 border-text-primary' : ''">
                        <component :is="item.iconComponent" class="shrink-0 w-5 h-5 transition-colors" :class="isExactActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'" />
                        <span
                          class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 truncate">{{
                            item.name }}</span>
                      </a>
                    </router-link>
                  </li>
                </template>
              </ul>
            </div>
          </template>
        </div>

        <div class="pt-3 hidden lg:flex 2xl:hidden justify-end mt-auto">
          <button @click.prevent="sidebarExpanded = !sidebarExpanded"
            class="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors">
            <span class="sr-only">Expand / collapse sidebar</span>
            <IconChevronRight class="w-5 h-5 transition-transform" :class="{ 'rotate-180': sidebarExpanded }" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IconAi, IconArchive, IconCalendar, IconChart, IconChat, IconChevronLeft, IconChevronRight, IconDocument, IconEdit, IconHome, IconImage, IconMoney, IconReceipt, IconSettings, IconUsers, IconSavings } from '@/ui/icons';
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useAuthStore } from "../features/auth/presentation/stores/authStore";
import SidebarLinkGroup from "./SidebarLinkGroup.vue";

// Impor Ikon

export default {
  name: "Sidebar",
  props: ["sidebarOpen", "variant"],
  components: {
    SidebarLinkGroup,
    IconChevronLeft, IconChevronRight,
  },
  setup(props, { emit }) {
    const trigger = ref(null);
    const sidebar = ref(null);
    const authStore = useAuthStore();

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const sidebarExpanded = ref(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    const menuConfig = ref([
      {
        type: "link",
        name: "Dashboard",
        path: "/app/dashboard",
        iconComponent: IconHome,
      },
      {
        type: "group",
        title: "Pasangan",
        items: [
          {
            name: "Catatan Bersama",
            path: "/app/notes",
            iconComponent: IconEdit,
            requiredPermission: "notes",
          },
          {
            name: "To-do List Berdua",
            path: "/app/todos",
            iconComponent: IconDocument,
            requiredPermission: "todos",
          },
          {
            name: "Galeri Kenangan",
            path: "/app/gallery",
            iconComponent: IconImage,
            requiredPermission: "gallery",
          },
          {
            name: "Kalender Cinta",
            path: "/app/calendar",
            iconComponent: IconCalendar,
            requiredPermission: "calendar",
          },
          {
            name: "Vault Rahasia",
            path: "/app/vault",
            iconComponent: IconArchive,
            requiredPermission: "vault",
          },
        ],
      },
      {
        type: "group",
        title: "Keuangan",
        items: [
          {
            name: "Kantong Keuangan",
            path: "/app/budgeting",
            iconComponent: IconMoney,
            requiredPermission: "budgeting",
          },
          {
            name: "Rencana Keuangan",
            path: "/app/plans",
            iconComponent: IconSavings,
            requiredPermission: "budgeting",
          },
          {
            name: "Riwayat Transaksi",
            path: "/app/transactions",
            iconComponent: IconReceipt,
            requiredPermission: "budgeting",
          },
          {
            name: "Rekap Bulanan",
            path: "/app/history",
            iconComponent: IconChart,
            requiredPermission: "budgeting",
          },
          {
            name: "Split Bill AI",
            path: "/app/split",
            iconComponent: IconAi,
            requiredPermission: "budgeting",
          },
        ],
      },
      {
        type: "group",
        title: "Integrasi WhatsApp",
        items: [
          {
            name: "WhatsApp Bot",
            path: "/app/wabot",
            iconComponent: IconAi,
            requiredPermission: "wabot",
          },
          {
            name: "WhatsApp Api",
            path: "/app/wabot-api",
            iconComponent: IconChat,
            requiresAdmin: true,
          },
          {
            name: "Cadangkan WhatsApp",
            path: "/app/wabot-backup",
            iconComponent: IconArchive,
            requiredPermission: "wabot",
          },
        ],
      },
      {
        type: "group",
        title: "Akun",
        items: [
          {
            name: "Manajemen User",
            path: "/app/admin/users",
            iconComponent: IconUsers,
            requiresAdmin: true,
          },
          {
            name: "Pengaturan",
            path: "/app/settings",
            iconComponent: IconSettings,
          },
        ],
      },
    ]);

    const filteredMenu = computed(() => {
      // Eksplisit akses permissions agar Vue bisa melacak reaktivitas
      const permissions = authStore.user?.permissions || [];
      const role = authStore.user?.role;
      const isAdmin = role === 'admin';

      return menuConfig.value.map(group => {
        if (group.type === "group") {
          return {
            ...group,
            items: group.items.filter(item => {
              if (item.requiresAdmin && !isAdmin) return false;
              if (item.requiredPermission && !isAdmin && !permissions.includes(item.requiredPermission)) return false;
              return true;
            })
          }
        }
        return group;
      }).filter(group => group.type !== "group" || group.items.length > 0);
    });

    // Event handlers untuk sidebar mobile
    const clickHandler = ({ target }) => {
      if (!sidebar.value || !trigger.value) return;
      if (
        !props.sidebarOpen ||
        sidebar.value.contains(target) ||
        trigger.value.contains(target)
      )
        return;
      emit("close-sidebar");
    };
    const keyHandler = ({ keyCode }) => {
      if (!props.sidebarOpen || keyCode !== 27) return;
      emit("close-sidebar");
    };

    onMounted(() => {
      document.addEventListener("click", clickHandler);
      document.addEventListener("keydown", keyHandler);
    });
    onUnmounted(() => {
      document.removeEventListener("click", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    });

    watch(sidebarExpanded, () => {
      localStorage.setItem("sidebar-expanded", sidebarExpanded.value);
      if (sidebarExpanded.value) {
        document.querySelector("body").classList.add("sidebar-expanded");
      } else {
        document.querySelector("body").classList.remove("sidebar-expanded");
      }
    });

    return {
      trigger,
      sidebar,
      sidebarExpanded,
      authStore,
      filteredMenu,
    };
  },
};
</script>
