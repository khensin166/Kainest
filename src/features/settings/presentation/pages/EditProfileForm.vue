<template>
  <div>
    <h2 class="text-xl text-gray-800 dark:text-gray-100 font-bold mb-6">
      Edit Profil
    </h2>
    <div v-if="!user" class="text-center">Memuat data profil...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="flex items-center space-x-4 mb-6">
        <img
          class="w-20 h-20 rounded-full object-cover"
          :src="userPhoto"
          alt="User"
        />
        <div>
          <button
            type="button"
            class="px-3 py-2 text-sm font-medium text-violet-600 border border-violet-300 rounded-md"
          >
            Ubah Foto
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-1" for="name">Nama</label>
          <input
            id="name"
            class="form-input w-full disabled:bg-gray-100 dark:disabled:bg-gray-700"
            type="text"
            v-model="formData.name"
            disabled
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="username"
            >User Name</label
          >
          <input
            id="username"
            class="form-input w-full disabled:bg-gray-100 dark:disabled:bg-gray-700"
            type="text"
            v-model="formData.username"
            disabled
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="email"
            >Email</label
          >
          <input
            id="email"
            class="form-input w-full disabled:bg-gray-100 dark:disabled:bg-gray-700"
            type="email"
            v-model="formData.email"
            disabled
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="phone"
            >Nomor Telepon</label
          >
          <input
            id="phone"
            class="form-input w-full"
            type="text"
            v-model="formData.phone"
            placeholder="Belum diisi"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="dateOfBirth"
            >Tanggal Lahir</label
          >
          <input
            id="dateOfBirth"
            class="form-input w-full"
            type="date"
            v-model="formData.dateOfBirth"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="gender"
            >Jenis Kelamin</label
          >
          <select
            id="gender"
            class="form-select w-full"
            v-model="formData.gender"
          >
            <option value="">Pilih...</option>
            <option value="male">Pria</option>
            <option value="female">Wanita</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] rounded-md"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import UserAvatar from "@/images/user-avatar-32.png"; // Impor gambar default

const props = defineProps({
  user: Object,
});

const formData = ref({});
const modalStore = useModalStore();

// PERUBAHAN: Buat computed property untuk foto profil
const userPhoto = computed(() => {
  // Jika props.user.photo ada isinya
  if (props.user?.photo) {
    return props.user.photo;
  }
  // Jika tidak, gunakan gambar placeholder
  return UserAvatar;
});

// Salin data dari props ke state lokal saat props tersedia
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      const formattedUser = { ...newUser };
      if (formattedUser.dateOfBirth) {
        formattedUser.dateOfBirth = formattedUser.dateOfBirth.split("T")[0];
      }
      formData.value = formattedUser;
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = () => {
  console.log("Data to update:", formData.value);
  modalStore.openModal({
    newTitle: "Info",
    newMessage: "Fitur update profil belum diimplementasikan.",
    newStatus: "info",
  });
};
</script>
