<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <h1
      class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6"
    >
      Koneksi WhatsApp Bot
    </h1>

    <div
      class="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <h2
        class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center"
      >
        {{ statusMessage }}
      </h2>

      <div class="flex flex-col lg:flex-row items-center justify-center gap-8">
        <!-- QR Code Section -->
        <div class="flex flex-col items-center">
          <div
            v-if="qrValue"
            class="p-4 bg-white rounded-lg border border-gray-300"
            :class="isConnected ? 'qr-fade-out' : 'animate-fade-in'"
          >
            <qrcode-vue :value="qrValue" :size="300" level="H" />
          </div>

          <p
            v-if="!qrValue && isConnected"
            class="text-green-500 font-medium mt-4 animate-fade-in"
          >
            ✅ Bot berhasil terhubung dan siap menerima perintah.
          </p>
          <p v-if="qrValue" class="text-gray-500 dark:text-gray-400 mt-4 text-center">
            Silakan scan QR code ini dengan aplikasi WhatsApp di HP Anda.
          </p>
        </div>

        <!-- Animated Bot Section -->
        <div class="relative flex items-center justify-center">
          <div class="bot-container">
            <!-- Status Badge -->
            <div 
              v-if="isConnected" 
              class="status-badge"
            >
              <span class="status-dot"></span>
              CONNECTED
            </div>

            <!-- Rotating Ring (only when connected) -->
            <div v-if="isConnected" class="rotating-ring"></div>

            <!-- Bot Body -->
            <div 
              class="bot-body"
              :class="{ 'bot-connected': isConnected, 'bot-celebrate': showCelebration }"
            >
              <!-- Bot Head -->
              <div class="bot-head">
                <!-- Eyes / Check Marks -->
                <div class="bot-eyes">
                  <div v-if="!isConnected" class="bot-eye left"></div>
                  <div v-if="!isConnected" class="bot-eye right"></div>
                  
                  <!-- Double Check Marks when connected -->
                  <div v-if="isConnected" class="check-marks">
                    <svg class="check-mark check-1" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <svg class="check-mark check-2" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <!-- Antenna -->
                <div class="bot-antenna">
                  <div 
                    class="antenna-ball"
                    :class="{ 'antenna-active': isConnected }"
                  ></div>
                </div>
              </div>
              
              <!-- Bot Screen -->
              <div class="bot-screen">
                <!-- WhatsApp Logo (when not connected) -->
                <svg 
                  v-if="!isConnected"
                  class="whatsapp-logo" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>

                <!-- Big Check Mark (when connected) -->
                <svg 
                  v-if="isConnected"
                  class="big-check" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  stroke-width="2"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                
                <!-- ONLINE Text -->
                <div v-if="isConnected" class="online-text">ONLINE</div>
              </div>

              <!-- Bot Arms -->
              <div class="bot-arms">
                <div class="bot-arm left"></div>
                <div class="bot-arm right"></div>
              </div>
            </div>

            <!-- Floating Particles -->
            <div 
              class="particle particle-1"
              :class="{ 'particle-gold': isConnected }"
            ></div>
            <div 
              class="particle particle-2"
              :class="{ 'particle-gold': isConnected }"
            ></div>
            <div 
              class="particle particle-3"
              :class="{ 'particle-gold': isConnected }"
            ></div>

            <!-- Success Burst Particles (only on connection) -->
            <div v-if="showCelebration" class="burst-container">
              <div class="burst-particle" v-for="i in 12" :key="i" :style="{ '--i': i }"></div>
            </div>
          </div>
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
  socket = io("https://whatsapp-bot-shifting-production.up.railway.app");
  // socket = io("http://localhost:3000");

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
