<template>
  <div class="min-w-fit">
    <div
      class="fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200"
      :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      aria-hidden="true"
    ></div>

    <div
      id="sidebar"
      ref="sidebar"
      class="flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out"
      :class="[
        variant === 'v2'
          ? 'border-r border-gray-200 dark:border-gray-700/60'
          : 'rounded-r-2xl shadow-xs',
        sidebarOpen ? 'translate-x-0' : '-translate-x-64',
      ]"
    >
      <div
        v-if="!authStore.user"
        class="flex justify-center items-center h-full"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500"
        ></div>
      </div>

      <div v-else>
        <div class="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref="trigger"
            class="lg:hidden text-gray-500 hover:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click.stop="$emit('close-sidebar')"
            aria-controls="sidebar"
            :aria-expanded="sidebarOpen"
          >
            <span class="sr-only">Close sidebar</span>
            <ChevronLeftIcon class="w-5 h-5" />
          </button>

          <router-link class="block" to="/">
            <img
              src="/images/logo.png"
              alt="Logo"
              class="w-8 h-8 object-contain"
            />
          </router-link>
        </div>

        <div class="space-y-4">
          <template v-for="(group, index) in filteredMenu" :key="index">
            <ul v-if="group.type === 'link'">
              <router-link
                :to="group.path"
                custom
                v-slot="{ href, navigate, isExactActive }"
              >
                <li>
                  <a
                    :href="href"
                    @click="navigate"
                    class="flex items-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-3 py-2.5 transition-all duration-200 group"
                    :class="
                      isExactActive
                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                        : ''
                    "
                  >
                    <component
                      :is="group.iconComponent"
                      class="shrink-0 w-5 h-5 transition-colors"
                      :class="
                        isExactActive
                          ? 'text-violet-600 dark:text-violet-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      "
                    />
                    <span
                      class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 truncate"
                      >{{ group.name }}</span
                    >
                  </a>
                </li>
              </router-link>
            </ul>

            <div v-if="group.type === 'group'">
              <h3
                class="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3 mb-2"
              >
                <span
                  class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                  aria-hidden="true"
                  >•••</span
                >
                <span class="lg:hidden lg:sidebar-expanded:block 2xl:block">{{
                  group.title
                }}</span>
              </h3>
              <ul class="space-y-1">
                <template v-for="item in group.items" :key="item.path">
                  <li>
                    <a
                      v-if="item.path === '/logout'"
                      href="#"
                      @click.prevent="handleLogout"
                      class="flex items-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-3 py-2.5 transition-all duration-200 group"
                    >
                      <component
                        :is="item.iconComponent"
                        class="shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                      />
                      <span
                        class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 truncate"
                        >{{ item.name }}</span
                      >
                    </a>

                    <router-link
                      v-else
                      :to="item.path"
                      custom
                      v-slot="{ href, navigate, isExactActive }"
                    >
                      <a
                        :href="href"
                        @click="navigate"
                        class="flex items-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-3 py-2.5 transition-all duration-200 group"
                        :class="
                          isExactActive
                            ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                            : ''
                        "
                      >
                        <component
                          :is="item.iconComponent"
                          class="shrink-0 w-5 h-5 transition-colors"
                          :class="
                            isExactActive
                              ? 'text-violet-600 dark:text-violet-400'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                          "
                        />
                        <span
                          class="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 truncate"
                          >{{ item.name }}</span
                        >
                      </a>
                    </router-link>
                  </li>
                </template>
              </ul>
            </div>
          </template>
        </div>

        <div class="pt-3 hidden lg:flex 2xl:hidden justify-end mt-auto">
          <button
            @click.prevent="sidebarExpanded = !sidebarExpanded"
            class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span class="sr-only">Expand / collapse sidebar</span>
            <ChevronRightIcon
              class="w-5 h-5 transition-transform sidebar-expanded:rotate-180"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useAuthStore } from "../features/auth/presentation/stores/authStore";
import SidebarLinkGroup from "./SidebarLinkGroup.vue";

// Impor Ikon
import {
  HomeIcon,
  TagIcon,
  ArchiveBoxIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  StarIcon,
  PhotoIcon,
  CalendarDaysIcon,
  TicketIcon,
  DocumentChartBarIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";

export default {
  name: "Sidebar",
  props: ["sidebarOpen", "variant"],
  components: {
    SidebarLinkGroup,
  },
  setup(props, { emit }) {
    const trigger = ref(null);
    const sidebar = ref(null);
    const authStore = useAuthStore();

    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    const sidebarExpanded = ref(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );

    // --- PERUBAHAN DIMULAI DI SINI ---

    // 1. Hapus computed property `userRole`
    // const userRole = computed(() => authStore.user?.role || "guest"); // 🗑️ DIHAPUS

    // 2. Hapus semua properti `roles` dari konfigurasi menu
    // 2. Konfigurasi menu yang sudah disesuaikan untuk aplikasi "Kenin"
    const menuConfig = ref([
      {
        type: "link",
        name: "Dashboard",
        path: "/dashboard",
        iconComponent: HomeIcon,
      },
      {
        type: "group",
        title: "Momen Kita", // Judul grup yang lebih sesuai
        items: [
          {
            name: "To-do List Berdua",
            path: "/todos", // Sesuaikan path ini dengan router Anda
            iconComponent: DocumentTextIcon, // Atau ikon lain yang cocok
          },
          {
            name: "Galeri Kenangan",
            path: "/gallery", // Sesuaikan path ini dengan router Anda
            iconComponent: PhotoIcon,
          },
          {
            name: "Kalender Cinta",
            path: "/calendar", // Sesuaikan path ini dengan router Anda
            iconComponent: CalendarDaysIcon,
          },
          {
            name: "Vault Rahasia",
            path: "/vault", // Sesuaikan path ini dengan router Anda
            iconComponent: ArchiveBoxIcon, // Menggunakan ikon yang sudah ada
          },
        ],
      },
      {
        type: "group",
        title: "Akun",
        items: [
          {
            name: "Pengaturan",
            path: "/settings",
            iconComponent: Cog6ToothIcon,
          },
          // {
          //   name: "Logout",
          //   path: "/logout", // Path fiktif untuk memicu fungsi logout
          //   iconComponent: ArrowLeftOnRectangleIcon,
          // },
        ],
      },
    ]);

    // 3. Sederhanakan `filteredMenu` untuk menampilkan semua menu
    const filteredMenu = computed(() => {
      // Langsung kembalikan semua menu tanpa filter
      return menuConfig.value;
    });

    // --- PERUBAHAN SELESAI ---

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
