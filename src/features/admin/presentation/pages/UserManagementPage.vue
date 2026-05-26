<template>
  <div class="user-management max-w-4xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Manajemen Pengguna</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Kelola role dan hak akses pengguna</p>
      </div>
      <button 
        @click="fetchUsers" 
        class="p-1.5 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Refresh Data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p>{{ error }}</p>
    </div>

    <!-- User Cards -->
    <div v-else class="space-y-3">
      <div v-if="users.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
        Belum ada user yang terdaftar.
      </div>

      <div 
        v-for="user in users" 
        :key="user.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all"
        :class="{ 'ring-2 ring-indigo-500/30 border-indigo-300 dark:border-indigo-600': user._changed }"
      >
        <!-- Top Row: User Info + Role + Save -->
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <img 
            class="h-8 w-8 rounded-full object-cover flex-shrink-0" 
            :src="user.profile?.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || user.email) + '&size=32&background=6366f1&color=fff'" 
            alt="" 
          />
          
          <!-- Name & Email -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ user.profile?.displayName || user.name || "No Name" }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ user.email }}
            </div>
          </div>

          <!-- Role Select -->
          <select 
            v-model="user.role"
            @change="markAsChanged(user)"
            class="text-xs border border-gray-200 dark:border-gray-600 rounded-md px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <!-- Save Button -->
          <button 
            v-if="user._changed"
            @click="saveChanges(user)"
            :disabled="user._saving"
            class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 transition-colors flex-shrink-0"
          >
            <svg v-if="user._saving" class="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Simpan
          </button>
          <span v-else class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>

        <!-- Bottom Row: Permissions -->
        <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div class="flex flex-wrap gap-x-4 gap-y-1.5">
            <label 
              v-for="mod in availableModules" 
              :key="mod.id" 
              class="inline-flex items-center gap-1.5 cursor-pointer group"
            >
              <input 
                type="checkbox" 
                :value="mod.id" 
                v-model="user.permissions"
                @change="markAsChanged(user)"
                class="h-3.5 w-3.5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-1 dark:bg-gray-700 cursor-pointer"
              >
              <span class="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors select-none">{{ mod.label }}</span>
            </label>
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

const modalStore = useModalStore();

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);

const availableModules = [
  { id: 'todos', label: 'To-do' },
  { id: 'notes', label: 'Notes' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'budgeting', label: 'Budgeting' },
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
