<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <h1
      class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6"
    >
      Koneksi WhatsApp Bot
    </h1>

    <div
      class="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center"
    >
      <h2
        class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
      >
        {{ statusMessage }}
      </h2>

      <div
        v-if="qrValue"
        class="p-4 bg-white rounded-lg border border-gray-300"
      >
        <qrcode-vue :value="qrValue" :size="300" level="H" />
      </div>

      <p
        v-if="!qrValue && statusMessage === 'WhatsApp Terhubung!'"
        class="text-green-500 font-medium mt-4"
      >
        ✅ Bot berhasil terhubung dan siap menerima perintah.
      </p>
      <p v-if="qrValue" class="text-gray-500 dark:text-gray-400 mt-4">
        Silakan scan QR code ini dengan aplikasi WhatsApp di HP Anda.
      </p>
    </div>
  </div>
</template>

<script setup>
// 5. Impor diganti untuk logika QR code
import { ref, onMounted, onBeforeUnmount } from "vue";
import io from "socket.io-client";
import QrcodeVue from "qrcode.vue";

// 6. Impor dan logika untuk authStore & tabs dihapus
// import { useAuthStore } from "../../../auth/presentation/stores/authStore";
// import EditProfileForm from "./EditProfileForm.vue";
// import ChangePasswordForm from "./ChangePasswordForm.vue";
// const authStore = useAuthStore();
// const activeTab = ref("profile");

// 7. Logika socket.io dari halaman kedua ditambahkan
const qrValue = ref(null);
const statusMessage = ref("Menghubungkan ke Bot...");
let socket = null; // Tidak perlu reaktif

onMounted(() => {
  // Hubungkan ke server bot Anda
  // Ganti URL ini jika web dan bot Anda di-deploy di domain berbeda
  socket = io("https://whatsapp-bot-shifting-production.up.railway.app");
  // socket = io("http://localhost:3000");

  // Mendengarkan event 'status' dari bot
  socket.on("status", (message) => {
    statusMessage.value = message;
    if (message === "WhatsApp Terhubung!") {
      qrValue.value = null; // Sembunyikan QR code
    }
  });

  // Mendengarkan event 'qr_code' dari bot
  socket.on("qr_code", (qrData) => {
    console.log("Data QR diterima dari bot!");
    qrValue.value = qrData;
    statusMessage.value = "Silakan Scan QR Code";
  });

  // Logika authStore.initializeAuth() dihapus
});

// 8. Tambahkan onBeforeUnmount untuk membersihkan koneksi socket
onBeforeUnmount(() => {
  // Putuskan koneksi socket saat halaman ditutup
  if (socket) {
    socket.disconnect();
  }
});
</script>