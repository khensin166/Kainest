<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
    
    <div class="w-full max-w-3xl space-y-6">
      
      <!-- HEADER -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <SparklesIcon class="w-8 h-8 text-violet-500" />
          Kainest Split Bill
        </h1>
        <p class="text-gray-500 dark:text-gray-400">Rincian patungan kamu sudah dihitung adil oleh AI.</p>
      </div>

      <!-- LOADING STATE -->
      <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center animate-pulse border border-gray-200 dark:border-gray-700">
        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
      
      <!-- ERROR STATE -->
      <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-red-200 dark:border-red-900/50">
        <XCircleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Ups, Gagal Memuat</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ error }}</p>
      </div>

      <!-- SUCCESS STATE -->
      <div v-else class="space-y-6">
        
        <!-- CARD INFO -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-violet-600 px-6 py-8 text-center relative overflow-hidden">
            <!-- Dekorasi -->
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            
            <h2 class="text-2xl font-bold text-white relative z-10">{{ sessionData.merchant || 'Tempat Makan' }}</h2>
            <p class="text-violet-200 mt-1 relative z-10">Total Tagihan: <span class="font-bold text-white">Rp {{ formatNumber(sessionData.totalAmount) }}</span></p>
          </div>
          
          <div class="p-6 md:p-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <UsersIcon class="w-5 h-5 text-gray-400" />
              Tagihan Per Orang
            </h3>
            
            <div class="space-y-4">
              <div v-for="(person, idx) in sessionData.splitData" :key="idx" 
                   class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors">
                
                <div class="flex justify-between items-start mb-3">
                  <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ person.member_name }}</h4>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 mb-1">Harus Dibayar</p>
                    <p class="font-bold text-violet-600 dark:text-violet-400 text-lg">Rp {{ formatNumber(person.total_to_pay) }}</p>
                  </div>
                </div>
                
                <div class="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu yang dikonsumsi:</p>
                  <ul class="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                    <li v-for="(item, i) in person.items" :key="i">{{ item }}</li>
                  </ul>
                  
                  <div class="mt-3 flex gap-4 text-xs text-gray-500">
                    <span v-if="person.proportional_tax > 0">Pajak: Rp {{ formatNumber(person.proportional_tax) }}</span>
                    <span v-if="person.proportional_service > 0">Service: Rp {{ formatNumber(person.proportional_service) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button @click="copyToClipboard" class="flex-1 btn bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 rounded-xl py-3 shadow-lg flex justify-center items-center gap-2 font-semibold">
                <ClipboardDocumentIcon class="w-5 h-5" />
                Salin Teks ke WA
              </button>
              
              <button @click="showBlastModal = true" class="flex-1 btn bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 shadow-lg shadow-green-500/30 flex justify-center items-center gap-2 font-semibold transition-all">
                <ChatBubbleLeftRightIcon class="w-5 h-5" />
                Blast Otomatis via Bot
              </button>
            </div>
            
            <p class="text-center text-xs text-gray-400 mt-6">Dibuat oleh <strong>{{ sessionData.user?.name || 'Temanmu' }}</strong> pada {{ formatDate(sessionData.createdAt) }}</p>
          </div>
        </div>

      </div>
    </div>
    
    <!-- MODAL BLAST WA -->
    <div v-if="showBlastModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Kirim Pesan Tagihan</h3>
            <button @click="showBlastModal = false" class="text-gray-400 hover:text-gray-500">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor WA Tujuan (Grup / Personal)</label>
              <input type="text" v-model="blastPhone" placeholder="Contoh: 62812345678" class="form-input w-full rounded-lg" />
              <p class="text-xs text-gray-500 mt-1">Gunakan awalan 62. Pesan akan dikirim dari nomor Kainest-GOWA.</p>
            </div>
            
            <button @click="blastWhatsApp" :disabled="isBlasting || !blastPhone" class="w-full btn bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-lg flex items-center justify-center gap-2">
              <ArrowPathIcon v-if="isBlasting" class="w-5 h-5 animate-spin" />
              <PaperAirplaneIcon v-else class="w-5 h-5" />
              {{ isBlasting ? 'Mengirim...' : 'Kirim Sekarang' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { 
  SparklesIcon, 
  UsersIcon, 
  ClipboardDocumentIcon,
  ChatBubbleLeftRightIcon,
  XCircleIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const splitId = route.params.id;

const isLoading = ref(true);
const error = ref(null);
const sessionData = ref({});

// Blast Modal State
const showBlastModal = ref(false);
const blastPhone = ref('');
const isBlasting = ref(false);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

onMounted(async () => {
  try {
    // Ini public endpoint, jadi panggil lgsg dengan axios tanpa interceptor auth
    const response = await axios.get(`${API_BASE}/api/split/share/${splitId}`);
    
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

const copyToClipboard = () => {
  if (sessionData.value.summaryText) {
    navigator.clipboard.writeText(sessionData.value.summaryText);
    alert("Teks berhasil disalin! Silakan paste di WhatsApp.");
  }
};

const blastWhatsApp = async () => {
  if (!blastPhone.value) return;
  
  isBlasting.value = true;
  try {
    // Ambil auth token dari localStorage karena ini action privileged
    const token = localStorage.getItem("auth_token");
    
    await axios.post(`${API_BASE}/api/split/blast`, {
      targetPhone: blastPhone.value,
      message: sessionData.value.summaryText
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    alert("Berhasil! Pesan tagihan telah diblast via GOWA.");
    showBlastModal.value = false;
  } catch (err) {
    console.error("Gagal blast:", err);
    alert("Gagal mengirim WhatsApp. Pastikan Anda sudah login dan bot GOWA aktif.");
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
