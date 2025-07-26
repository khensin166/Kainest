<template>
  <div>
    <h2 class="text-xl text-gray-800 dark:text-gray-100 font-bold mb-6">Ubah Sandi</h2>
    <form @submit.prevent="handleChangePassword">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1" for="current_password">Sandi Sekarang</label>
          <input id="current_password" class="form-input w-full" type="password" v-model="passwords.currentPassword" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="new_password">Sandi Baru</label>
          <input id="new_password" class="form-input w-full" type="password" v-model="passwords.newPassword" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="confirmation_password">Konfirmasi Sandi Baru</label>
          <input id="confirmation_password" class="form-input w-full" type="password" v-model="passwords.confirmationPassword" required />
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button type="submit" :disabled="settingsStore.isLoading" class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] rounded-md disabled:bg-gray-400">
          {{ settingsStore.isLoading ? 'Memproses...' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();
const passwords = ref({
  currentPassword: '',
  newPassword: '',
  confirmationPassword: '',
});

const handleChangePassword = async () => {
  try {
    await settingsStore.updatePassword(passwords.value);
    // Jika berhasil, reset form
    passwords.value = { currentPassword: '', newPassword: '', confirmationPassword: '' };
  } catch (error) {
    // Error sudah ditangani oleh store yang memunculkan modal
    console.error("Change password failed:", error.message);
  }
};
</script>