<template>
  <div class="relative inline-flex">
    <button
      ref="trigger"
      class="inline-flex justify-center items-center group"
      aria-haspopup="true"
      @click.prevent="dropdownOpen = !dropdownOpen"
      :aria-expanded="dropdownOpen"
    >
      <img
        class="w-8 h-8 rounded-full"
        :src="userPhoto"
        width="32"
        height="32"
        alt="User"
      />
      <div class="flex items-center truncate">
        <span
          class="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white"
          >{{ authStore.user?.displayName }}</span
        >
        <svg
          class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
          viewBox="0 0 12 12"
        >
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
        </svg>
      </div>
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
        class="origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
        :class="align === 'right' ? 'right-0' : 'left-0'"
      >
        <div
          class="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60"
        >
          <div class="font-medium text-gray-800 dark:text-gray-100">
            {{ authStore.user?.displayName }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 italic">
            Pengguna
          </div>
        </div>
        <ul
          ref="dropdown"
          @focusin="dropdownOpen = true"
          @focusout="dropdownOpen = false"
        >
          <li>
            <a
              href="#"
              class="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
              @click.prevent="openLogoutModal"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </transition>

    <BaseModal
      :isOpen="isLogoutModalOpen"
      :loading="isLoading"
      @close="isLogoutModalOpen = false"
      @confirm="confirmLogout"
    >
      <template #header>
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Konfirmasi Logout
        </DialogTitle>
      </template>
      <template #body>
        <p class="text-sm mt-4 text-gray-600 dark:text-gray-300">
          Apakah Anda yakin ingin keluar dari sesi ini?
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router"; // 1. Impor useRouter
import { useAuthStore } from "@/features/auth/presentation/stores/authStore"; // Pastikan path benar
import BaseModal from "./modals/BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import UserAvatar from "../images/user-avatar-32.png";

defineProps({
  align: {
    type: String,
    default: "right",
  },
});

const dropdownOpen = ref(false);
const trigger = ref(null);
const dropdown = ref(null);
const authStore = useAuthStore();
const router = useRouter(); // 2. Inisialisasi router
const isLogoutModalOpen = ref(false);
const isLoading = ref(false);

const userPhoto = computed(() => {
  // Menggunakan avatarUrl dari UserEntity
  if (authStore.user?.avatarUrl) {
    return authStore.user.avatarUrl;
  }
  return UserAvatar;
});

const openLogoutModal = () => {
  dropdownOpen.value = false;
  isLogoutModalOpen.value = true;
};

// ✅ FUNGSI LOGOUT YANG SUDAH LENGKAP
const confirmLogout = async () => {
  isLoading.value = true;
  try {
    await authStore.logout();
    // 3. Arahkan pengguna ke halaman login setelah logout berhasil
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Modal error akan ditampilkan oleh authStore jika logout dari server gagal
  } finally {
    // 4. Pastikan loading berhenti dan modal tertutup apa pun yang terjadi
    isLoading.value = false;
    isLogoutModalOpen.value = false;
  }
};

// Event handlers untuk menutup dropdown saat klik di luar
const clickHandler = ({ target }) => {
  if (
    !dropdownOpen.value ||
    dropdown.value?.contains(target) ||
    trigger.value?.contains(target)
  )
    return;
  dropdownOpen.value = false;
};

const keyHandler = ({ keyCode }) => {
  if (!dropdownOpen.value || keyCode !== 27) return;
  dropdownOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", clickHandler);
  document.addEventListener("keydown", keyHandler);
});

onUnmounted(() => {
  document.removeEventListener("click", clickHandler);
  document.removeEventListener("keydown", keyHandler);
});
</script>
