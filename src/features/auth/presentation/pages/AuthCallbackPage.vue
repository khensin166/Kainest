<template>
  <!-- Halaman loading sementara saat memproses token dari social login -->
  <div class="auth-callback-page">
    <div class="callback-card">
      <div class="spinner"></div>
      <h2>Memproses Login...</h2>
      <p>Sedang memverifikasi sesi Anda, harap tunggu.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

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
      console.log('[AuthCallback] Token dari social login berhasil disimpan.');

      // Reset status auth agar initializeAuth() melakukan pengecekan ulang
      // dengan token baru yang sudah ada di localStorage.
      authStore.isAuthReady = false;
      await authStore.initializeAuth();

      if (authStore.isAuthenticated) {
        console.log('[AuthCallback] Autentikasi berhasil, redirect ke dashboard.');
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

<style scoped>
.auth-callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.callback-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 3rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  backdrop-filter: blur(16px);
  text-align: center;
  max-width: 360px;
  width: 90%;
}

.callback-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.callback-card p {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(139, 92, 246, 0.2);
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
