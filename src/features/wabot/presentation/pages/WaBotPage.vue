<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 py-8">

    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl text-gray-800 dark:text-white font-bold mb-2">
        Koneksi WhatsApp Bot
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Kelola status koneksi bot Anda secara real-time
      </p>
    </div>

    <div
      class="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

      <div
        class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center mb-15">
        <span class="font-semibold text-gray-700 dark:text-gray-200">Status System</span>
        <div class="flex items-center gap-2">
          <span class="relative flex h-3 w-3">
            <span v-if="isConnected"
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3"
              :class="isConnected ? 'bg-green-500' : 'bg-amber-500'"></span>
          </span>
          <span class="text-sm font-medium"
            :class="isConnected ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
            {{ isConnected ? 'Online' : 'Menunggu Koneksi' }}
          </span>
        </div>
      </div>

      <div class="p-8 lg:p-12">
        <div v-if="!isConnected && qrValue" class="flex flex-col md:flex-row items-center justify-between gap-10">

          <div class="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Tautkan Perangkat
              </h2>
              <p class="text-gray-500 dark:text-gray-400">
                Scan QR Code di samping untuk menghubungkan bot dengan akun WhatsApp Anda.
              </p>
            </div>

            <div
              class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-300 text-left space-y-2">
              <p class="font-semibold mb-2">Caranya:</p>
              <ol class="list-decimal list-inside space-y-1">
                <li>Buka WhatsApp di HP Anda.</li>
                <li>Buka <strong>Menu</strong> (Android) atau <strong>Settings</strong> (iOS).</li>
                <li>Pilih <strong>Perangkat Tertaut</strong> (Linked Devices).</li>
                <li>Ketuk <strong>Tautkan Perangkat</strong> dan scan kode.</li>
              </ol>
            </div>

            <div class="text-amber-600 dark:text-amber-400 text-sm font-medium animate-pulse">
              {{ statusMessage }}
            </div>
          </div>

          <div class="flex-1 flex justify-center">
            <div class="relative p-4 bg-white rounded-xl shadow-sm border-2 border-gray-100 dark:border-gray-600">
              <qrcode-vue :value="qrValue" :size="260" level="H" class="rounded-lg" />
              <div
                class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-500 -mt-1 -ml-1 rounded-tl-lg">
              </div>
              <div
                class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-500 -mt-1 -mr-1 rounded-tr-lg">
              </div>
              <div
                class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-500 -mb-1 -ml-1 rounded-bl-lg">
              </div>
              <div
                class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-500 -mb-1 -mr-1 rounded-br-lg">
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center text-center py-8">

          <div class="relative flex items-center justify-center mb-8 scale-125">
            <div class="bot-container">
              <div v-if="isConnected" class="status-badge">
                <span class="status-dot"></span>
                CONNECTED
              </div>

              <div v-if="isConnected" class="rotating-ring"></div>

              <div class="bot-body" :class="{ 'bot-connected': isConnected, 'bot-celebrate': showCelebration }">
                <div class="bot-head">
                  <div class="bot-eyes">
                    <div v-if="!isConnected" class="bot-eye left"></div>
                    <div v-if="!isConnected" class="bot-eye right"></div>
                    <div v-if="isConnected" class="check-marks">
                      <svg class="check-mark check-1" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <svg class="check-mark check-2" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div class="bot-antenna">
                    <div class="antenna-ball" :class="{ 'antenna-active': isConnected }"></div>
                  </div>
                </div>

                <div class="bot-screen">
                  <svg v-if="!isConnected" class="whatsapp-logo" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <svg v-if="isConnected" class="big-check" viewBox="0 0 24 24" fill="none" stroke="white"
                    stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <div v-if="isConnected" class="online-text">ONLINE</div>
                </div>

                <div class="bot-arms">
                  <div class="bot-arm left"></div>
                  <div class="bot-arm right"></div>
                </div>
              </div>

              <div class="particle particle-1" :class="{ 'particle-gold': isConnected }"></div>
              <div class="particle particle-2" :class="{ 'particle-gold': isConnected }"></div>
              <div class="particle particle-3" :class="{ 'particle-gold': isConnected }"></div>

              <div v-if="showCelebration" class="burst-container">
                <div class="burst-particle" v-for="i in 12" :key="i" :style="{ '--i': i }"></div>
              </div>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            WhatsApp Terhubung!
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-md">
            Bot Anda sudah aktif. Pesan otomatis akan dikirim sesuai jadwal yang telah ditentukan.
          </p>
        </div>

        <div v-if="!qrValue && !isConnected" class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400 animate-pulse">{{ statusMessage }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import io from "socket.io-client";
import QrcodeVue from "qrcode.vue";

const qrValue = ref(null);
const statusMessage = ref("Menghubungkan ke Bot...");
const isConnected = ref(false);
const showCelebration = ref(false);
let socket = null;

onMounted(() => {
  socket = io("https://whatsapp-bot-shifting-production-1086.up.railway.app");

  socket.on("status", (message) => {
    statusMessage.value = message;
    if (message === "WhatsApp Terhubung!") {
      qrValue.value = null;

      // Trigger celebration animation
      if (!isConnected.value) {
        isConnected.value = true;
        showCelebration.value = true;

        // Hide celebration after animation completes
        setTimeout(() => {
          showCelebration.value = false;
        }, 1000);
      }
    }
  });

  socket.on("qr_code", (qrData) => {
    console.log("Data QR diterima dari bot!");
    qrValue.value = qrData;
    statusMessage.value = "Silakan Scan QR Code";
    isConnected.value = false;
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    statusMessage.value = "Gagal terhubung ke server bot.";
    isConnected.value = false;
    qrValue.value = null;
  });
});

onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect();
  }
});
</script>
