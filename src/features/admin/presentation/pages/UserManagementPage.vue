<template>
  <div class="user-management p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Manajemen Pengguna</h1>
      <button 
        @click="fetchUsers" 
        class="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
        title="Refresh Data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p>{{ error }}</p>
    </div>

    <!-- Users Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            
            <!-- User Info -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img class="h-10 w-10 rounded-full object-cover" :src="user.profile?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (user.name || user.email)" alt="" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ user.profile?.displayName || user.name || "No Name" }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.email }}
                  </div>
                </div>
              </div>
            </td>
            
            <!-- Role -->
            <td class="px-6 py-4 whitespace-nowrap">
              <select 
                v-model="user.role"
                @change="markAsChanged(user)"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>

            <!-- Permissions -->
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-2">
                <label v-for="mod in availableModules" :key="mod.id" class="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    :value="mod.id" 
                    v-model="user.permissions"
                    @change="markAsChanged(user)"
                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ mod.label }}</span>
                </label>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                v-if="user._changed"
                @click="saveChanges(user)"
                :disabled="user._saving"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <svg v-if="user._saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Save
              </button>
              <span v-else class="text-gray-400 dark:text-gray-500 italic text-xs">Saved</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="users.length === 0" class="text-center py-8 text-gray-500">
        Belum ada user yang terdaftar.
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
  { id: 'todos', label: 'Todos' },
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
