<template>
  <!-- Halaman loading sementara saat memproses token dari social login -->
  <div class="min-h-[100dvh] flex items-center justify-center bg-surface-page relative">
    
    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <div class="flex flex-col items-center gap-5 p-12 bg-surface-card border border-border-default rounded-lg text-center max-w-[360px] w-[90%] z-10">
      <div class="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      <h2 class="text-2xl font-semibold text-text-primary m-0">Memproses Login...</h2>
      <p class="text-sm text-text-muted m-0">Sedang memverifikasi sesi Anda, harap tunggu.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // Ambil token dari URL hash (#token=...)
    // Hash tidak pernah dikirim ke server, hanya tersedia di JavaScript.
    const hash = window.location.hash; // contoh: "#token=abc123"
    const params = new URLSearchParams(hash.slice(1)); // hapus karakter '#' di awal
    const token = params.get('token');

    if (token) {
      // Simpan token ke localStorage agar interceptor apiClient bisa mengirimnya
      // sebagai "Authorization: Bearer <token>" di setiap request berikutnya.
      localStorage.setItem('authToken', token);

      // Reset status auth agar initializeAuth() melakukan pengecekan ulang
      // dengan token baru yang sudah ada di localStorage.
      authStore.isAuthReady = false;
      await authStore.initializeAuth();

      if (authStore.isAuthenticated) {
        router.replace('/app/dashboard');
      } else {
        console.warn('[AuthCallback] Token tidak valid, redirect ke login.');
        router.replace('/login?error=auth_failed');
      }
    } else {
      // Tidak ada token di URL hash — kemungkinan user mengakses halaman ini langsung
      console.warn('[AuthCallback] Tidak ada token di URL, redirect ke login.');
      router.replace('/login');
    }
  } catch (error) {
    console.error('[AuthCallback] Error saat memproses callback:', error);
    router.replace('/login?error=server_error');
  }
});
</script>
