<template>
  <div class="min-h-screen bg-surface-page py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
    
    <div class="w-full max-w-3xl space-y-6">
      
      <!-- HEADER -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-text-primary tracking-tight tracking-tight flex items-center justify-center gap-2">
          <IconAi class="w-5 h-5 text-ai shrink-0" aria-hidden="true" />
          Kainest Split Bill
        </h1>
        <p class="text-text-muted">Rincian patungan kamu sudah dihitung adil oleh AI.</p>
      </div>

      <!-- LOADING STATE -->
      <div v-if="isLoading" class="bg-surface-card rounded-lg p-8 text-center animate-pulse border border-border-default">
        <div class="w-16 h-16 bg-surface-subtle rounded-full mx-auto mb-4"></div>
        <div class="h-6 bg-surface-subtle rounded w-1/3 mx-auto mb-4"></div>
        <div class="h-4 bg-surface-subtle rounded w-1/2 mx-auto"></div>
      </div>
      
      <!-- ERROR STATE -->
      <div v-else-if="error" class="bg-surface-card rounded-lg p-8 text-center border border-status-danger">
        <IconCancel class="w-16 h-16 text-status-danger mx-auto mb-4" />
        <h2 class="text-xl font-bold text-text-primary mb-2">Ups, Gagal Memuat</h2>
        <p class="text-text-muted">{{ error }}</p>
      </div>

      <!-- SUCCESS STATE -->
      <div v-else class="space-y-6">
        
        <!-- CARD INFO -->
        <div class="bg-surface-card rounded-lg border border-border-default overflow-hidden">
          <div class="bg-brand-primary px-6 py-8 text-center relative overflow-hidden">
            <!-- Dekorasi -->
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            
            <h2 class="text-2xl font-bold text-text-inverse relative z-10">{{ sessionData.merchant || 'Tempat Makan' }}</h2>
            <p class="text-white/80 mt-1 relative z-10">Total Tagihan: <span class="font-bold text-white">Rp {{ formatNumber(sessionData.totalAmount) }}</span></p>
          </div>
          
          <div class="p-6 md:p-8">
            <h3 class="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
              <IconUsers class="w-5 h-5 text-text-muted" />
              Tagihan Per Orang
            </h3>
            
            <div class="space-y-4">
              <div v-for="(person, idx) in sessionData.splitData" :key="idx" 
                   class="bg-surface-subtle rounded-md p-5 border border-border-default hover:border-brand-primary transition-colors">
                
                <div class="flex justify-between items-start mb-3">
                  <h4 class="font-bold text-lg text-text-primary">{{ person.member_name }}</h4>
                  <div class="text-right">
                    <p class="text-xs text-text-muted mb-1">Harus Dibayar</p>
                    <p class="font-bold text-brand-primary text-lg">Rp {{ formatNumber(person.total_to_pay) }}</p>
                  </div>
                </div>
                
                <div class="pt-3 border-t border-border-default">
                  <p class="text-xs font-semibold text-text-faint mb-2">Menu yang dikonsumsi:</p>
                  <ul class="text-sm text-text-secondary list-disc list-inside space-y-1">
                    <li v-for="(item, i) in person.items" :key="i">{{ item }}</li>
                  </ul>
                  
                  <div class="mt-3 flex gap-4 text-xs text-text-muted">
                    <span v-if="person.proportional_tax > 0">Pajak: Rp {{ formatNumber(person.proportional_tax) }}</span>
                    <span v-if="person.proportional_service > 0">Service: Rp {{ formatNumber(person.proportional_service) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="primary" @click="copyToClipboard" class="flex-1">
                <IconPaste class="w-5 h-5" />
                Salin Teks ke WA
              </Button>
              
              <Button variant="secondary" v-if="authStore.user?.id === sessionData.userId" @click="showBlastModal = true" class="flex-1">
                <IconForum class="w-5 h-5" />
                Blast Otomatis via Bot
              </Button>
            </div>
            
            <p class="text-center text-xs text-text-faint mt-6">Dibuat oleh <strong>{{ sessionData.user?.name || 'Temanmu' }}</strong> pada {{ formatDate(sessionData.createdAt) }}</p>
          </div>
        </div>

        <!-- KAINEST PROMO BANNER -->
        <div class="bg-brand-primary rounded-lg p-6 text-text-inverse flex flex-col sm:flex-row items-center justify-between gap-6 border border-brand-primary/30">
          <div class="space-y-2 text-center sm:text-left">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-xs font-semibold text-white">
              <IconAi class="w-4 h-4 text-brand-soft" /> Powered by Kainest AI
            </div>
            <h3 class="text-xl font-bold">Mau Split Bill Otomatis & Atur Keuangan Praktis?</h3>
            <p class="text-sm text-white/80 max-w-xl">
              Jangan pusing hitung patungan manual! Gunakan <strong>Aplikasi Kainest</strong> untuk scan struk otomatis, alokasi pajak adil, & kelola dompet keuanganmu dengan AI cerdas.
            </p>
          </div>
          <a href="https://kainest.kenantomfie.com" target="_blank" rel="noopener noreferrer" 
             class="px-6 py-3 bg-white text-brand-primary hover:bg-brand-soft font-bold rounded-md shadow-sm transition-all whitespace-nowrap flex items-center gap-2 text-sm">
            Coba Kainest Sekarang
            <IconExternal class="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
    
    <!-- MODAL BLAST WA -->
    <div v-if="showBlastModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-surface-card rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-border-default">
        <div class="p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold text-text-primary">Kirim Pesan Tagihan</h3>
            <button @click="showBlastModal = false" class="text-text-muted hover:text-text-primary">
              <IconClose class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Nomor WA Tujuan (Grup / Personal)</label>
              <input type="text" v-model="blastPhone" placeholder="Contoh: 62812345678" class="form-input w-full rounded-lg text-text-primary bg-surface-input border border-border-default focus:ring-brand-primary" />
              <p class="text-xs text-text-muted mt-1">Gunakan awalan 62. Pesan akan dikirim dari nomor Kainest-GOWA.</p>
            </div>
            
            <Button variant="primary" block @click="blastWhatsApp" :disabled="isBlasting || !blastPhone">
              <IconRefresh v-if="isBlasting" class="w-5 h-5 animate-spin" />
              <IconSend v-else class="w-5 h-5" />
              {{ isBlasting ? 'Mengirim...' : 'Kirim Sekarang' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { IconAi, IconCancel, IconClose, IconExternal, IconForum, IconPaste, IconRefresh, IconSend, IconUsers } from '@/ui/icons';
import { Button } from '@/ui';
import { notify } from "@/lib/notify";
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import apiClient from '@/lib/apiClient';

const route = useRoute();
const splitId = route.params.id;
const authStore = useAuthStore();

const isLoading = ref(true);
const error = ref(null);
const sessionData = ref({});

// Blast Modal State
const showBlastModal = ref(false);
const blastPhone = ref('');
const isBlasting = ref(false);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const DOMAIN_URL = 'https://kainest.kenantomfie.com';

onMounted(async () => {
  try {
    // Ini public endpoint, jadi panggil lgsg dengan axios tanpa interceptor auth
    const response = await axios.get(`${API_BASE}/split/share/${splitId}`);
    
    if (response.data && response.data.data) {
      sessionData.value = response.data.data;
    } else {
      error.value = "Data tidak valid dari server.";
    }
  } catch (err) {
    console.error("Gagal load data:", err);
    error.value = err.response?.data?.error || "Gagal menemukan tagihan. Mungkin sudah dihapus atau disetel privat.";
  } finally {
    isLoading.value = false;
  }
});

// Format ringkasan pesan dengan tambahan selling copy untuk Kainest App
const formattedSummaryText = computed(() => {
  const baseText = sessionData.value.summaryText || '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `${DOMAIN_URL}/share/split/${splitId}`;

  const promoFooter = [
    '',
    '----------------------------------',
    '⚡ *Mau Split Bill Otomatis & Kelola Keuangan Praktis?*',
    'Gunakan aplikasi *Kainest* untuk scan struk pake AI, bagi tagihan adil, dan atur dompet keuanganmu! 🚀',
    '',
    `🌐 *Website Kainest:* ${DOMAIN_URL}`,
    `🔗 *Akses Tagihan Ini Online:* ${currentUrl}`
  ].join('\n');

  return baseText ? (baseText + promoFooter) : promoFooter;
});

const copyToClipboard = () => {
  if (formattedSummaryText.value) {
    navigator.clipboard.writeText(formattedSummaryText.value);
    notify.success("Teks ringkasan tagihan & link Kainest berhasil disalin! Silakan paste di WhatsApp.");
  }
};

const blastWhatsApp = async () => {
  if (!blastPhone.value) return;
  
  isBlasting.value = true;
  try {
    // Gunakan apiClient agar credentials (cookies better-auth) otomatis disertakan
    await apiClient.post('/split/blast', {
      targetPhone: blastPhone.value,
      message: formattedSummaryText.value
    });
    
    notify.success("Berhasil! Pesan tagihan & link promo Kainest telah diblast via GOWA.");
    showBlastModal.value = false;
  } catch (err) {
    console.error("Gagal blast:", err);
    notify.error("Gagal mengirim WhatsApp. Pastikan Anda sudah login dan bot GOWA aktif.");
  } finally {
    isBlasting.value = false;
  }
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num || 0);
};

const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};
</script>

