<!-- GetStartedPage.vue -->
<template>
  <div
    class="min-h-screen bg-[var(--color-violet-500)] flex flex-col items-center justify-center px-4 overflow-hidden"
  >
    <div class="text-center max-w-xl w-full">
      <!-- Animasi Mengetik -->
      <h1
        ref="typingText"
        class="font-[var(--font-inter)] text-2xl md:text-4xl text-white italic mb-10 border-r-2 border-white overflow-hidden animate-typing"
      >
        Let’s Start To The New Memories
      </h1>

      <!-- Tombol yang muncul dari bawah -->
      <transition name="fade-up">
        <button
          v-if="showButton"
          @click="handleStart"
          class="focus:outline-none mt-4 btn-start"
        >
          <!-- Pastikan gambar ini ada di folder assets Anda -->
          <img
            src="@/images/started-button.png"
            alt="Start"
            class="w-48 md:w-56"
          />
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showButton = ref(false);

// Fungsi untuk pindah ke halaman login
const handleStart = () => {
  router.push("/login");
};

// Tampilkan tombol setelah animasi mengetik selesai (3 detik)
onMounted(() => {
  setTimeout(() => {
    showButton.value = true;
  }, 3000); // Durasi ini cocok dengan durasi animasi mengetik
});
</script>

<style scoped>
/* Keyframes untuk animasi mengetik */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Kelas untuk elemen teks yang diketik */
.animate-typing {
  animation: typing 3s steps(30, end) forwards;
  white-space: nowrap; /* Diperbaiki: agar teks tetap satu baris saat animasi */
  width: 0;
  display: inline-block;
  border-right-color: transparent; /* Sembunyikan kursor di akhir */
  animation-fill-mode: forwards;
}

/* Transisi untuk tombol yang muncul dari bawah */
.fade-up-enter-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Efek hover untuk tombol */
.btn-start {
  outline: none;
  transition: transform 0.3s ease-in-out;
  display: inline-block;
}

.btn-start:hover {
  transform: scale(1.1); /* Sedikit diperkecil agar tidak terlalu besar */
}
</style>
