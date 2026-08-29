<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl md:text-3xl text-text-primary font-bold">Manajemen Pengguna</h1>
          <PageGuide :steps="pageGuides.users" />
        </div>
        <p class="text-sm text-text-muted mt-1">Pusat kendali admin — atur hak akses, pantau, dan kelola aktivitas seluruh pengguna aplikasi.</p>
      </div>
      <button @click="fetchUsers"
        class="p-2 text-text-muted hover:text-brand-primary transition-colors rounded-md hover:bg-surface-hover"
        title="Refresh Data">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Main Container -->
    <div class="bg-surface-card shadow-none rounded-sm border border-border-default p-6">

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-brand-primary border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error"
        class="p-4 bg-status-danger-bg text-status-danger rounded-lg text-sm flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>{{ error }}</p>
      </div>

      <!-- User Cards -->
      <div v-else class="space-y-4">
        <BaseEmptyState v-if="users.length === 0" icon="👥" title="Tidak Ada Pengguna"
          message="Belum ada user yang terdaftar." heightClass="py-12" />

        <div v-for="user in users" :key="user.id"
          class="border border-border-default rounded-lg p-5 transition-all bg-surface-subtle"
          :class="{ 'ring-1 ring-brand-primary/50 border-brand-primary': user._changed }">
          <!-- Top Row: User Info + Role + Save -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <!-- Avatar & Name -->
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <img class="h-10 w-10 rounded-full object-cover flex-shrink-0 shadow-sm"
                :src="user.profile?.avatarUrl || user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || user.email) + '&size=40&background=6366f1&color=fff'"
                alt="" referrerpolicy="no-referrer" />
              <div class="min-w-0">
                <div class="text-sm font-semibold text-text-primary truncate">
                  {{ user.profile?.displayName || user.name || "No Name" }}
                </div>
                <div class="text-sm text-text-muted truncate">
                  {{ user.email }}
                </div>
              </div>
            </div>

            <!-- Actions (Role & Save) -->
            <div class="flex items-center gap-3 self-end sm:self-auto">
              <!-- Role Select -->
              <div class="relative">
                <select v-model="user.role" @change="markAsChanged(user)"
                  class="appearance-none text-sm font-medium border border-border-default rounded-md pl-3 pr-8 py-1.5 bg-surface-input text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary cursor-pointer hover:bg-surface-hover transition-colors">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <!-- Custom Chevron -->
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <!-- Save Button -->
              <button v-if="user._changed" @click="saveChanges(user)" :disabled="user._saving"
                class="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md text-text-inverse bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-colors shadow-none border-none">
                <svg v-if="user._saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-text-inverse"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Simpan
              </button>
            </div>
          </div>

          <!-- Bottom Row: Permissions -->
          <div class="mt-4 pt-4 border-t border-border-default">
            <p class="text-sm font-medium text-text-primary mb-2">Hak Akses Modul:</p>
            <div class="flex flex-wrap gap-x-6 gap-y-2">
              <label v-for="mod in availableModules" :key="mod.id"
                class="inline-flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" :value="mod.id" v-model="user.permissions" @change="markAsChanged(user)"
                  class="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary focus:ring-2 bg-surface-input cursor-pointer">
                <span
                  class="text-sm text-text-primary group-hover:text-brand-primary transition-colors select-none">
                  {{ mod.label }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUsersUseCase, updateUserAccessUseCase } from '@/core/di/di';
import { useModalStore } from '@/stores/modalStore';
import BaseEmptyState from '@/components/BaseEmptyState.vue';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';

const modalStore = useModalStore();

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);

const availableModules = [
  { id: 'todos', label: 'To-do' },
  { id: 'notes', label: 'Notes' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'budgeting', label: 'Kantong Keuangan' },
  { id: 'wabot', label: 'WaBot' },
];

const fetchUsers = async () => {
  isLoading.value = true;
  error.value = null;

  const result = await getUsersUseCase.execute();

  if (result.left) {
    error.value = result.left.message;
  } else {
    // Tambahkan field state internal
    users.value = result.right.map(u => ({
      ...u,
      role: u.role || 'user',
      permissions: u.permissions || [],
      _changed: false,
      _saving: false
    }));
  }
  isLoading.value = false;
};

const markAsChanged = (user) => {
  user._changed = true;
};

const saveChanges = async (user) => {
  user._saving = true;

  const result = await updateUserAccessUseCase.execute(user.id, {
    role: user.role,
    permissions: user.permissions
  });

  user._saving = false;

  if (result.left) {
    modalStore.openModal({
      newTitle: "Gagal Menyimpan",
      newMessage: result.left.message,
      newStatus: "error"
    });
  } else {
    user._changed = false;
    modalStore.openModal({
      newTitle: "Tersimpan",
      newMessage: `Akses untuk ${user.email} berhasil diperbarui.`,
      newStatus: "success"
    });
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
