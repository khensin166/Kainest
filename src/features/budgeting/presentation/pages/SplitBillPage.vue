<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-6">
      <div class="mb-4 sm:mb-0">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <IconAi class="w-5 h-5 text-ai shrink-0" aria-hidden="true" />
            Split Bill AI
          </h1>
          <PageGuide :steps="pageGuides.split" />
        </div>
        <p class="text-sm text-text-muted mt-1">Otomatis deteksi struk, bagi tagihan lebih adil tanpa pusing.</p>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="bg-surface-card rounded-lg border border-border-default overflow-hidden">
      
      <!-- STEPPER -->
      <div class="flex border-b border-border-default">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex-1 py-4 px-4 text-center text-sm font-semibold transition-colors duration-200"
          :class="currentStep >= index ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-faint border-b-2 border-transparent'"
        >
          {{ index + 1 }}. {{ step }}
        </div>
      </div>

      <div class="p-6 md:p-8">
        
        <!-- STEP 1: UPLOAD -->
        <div v-if="currentStep === 0" class="space-y-6">
          <div class="border-2 border-dashed border-border-default rounded-lg p-12 text-center hover:bg-surface-hover transition-colors cursor-pointer"
               @click="triggerFileInput"
               @dragover.prevent
               @drop.prevent="handleDrop">
            
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
            
            <IconUpload class="w-16 h-16 mx-auto text-text-faint mb-4" />
            
            <h3 class="text-lg font-medium text-text-primary">Upload Foto Struk</h3>
            <p class="text-sm text-text-muted mt-1">Klik untuk memilih atau drag & drop file (JPG, PNG)</p>
            
            <div v-if="selectedFile" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-soft text-brand-text rounded-lg text-sm">
              <IconCheckCircle class="w-5 h-5" />
              {{ selectedFile.name }}
            </div>
          </div>
          
          <div class="flex justify-end">
            <Button variant="primary" @click="scanReceipt" :disabled="!selectedFile || isScanning">
              <IconRefresh v-if="isScanning" class="w-5 h-5 animate-spin" />
              <IconAi v-else class="w-5 h-5" />
              {{ isScanning ? 'Membaca Struk...' : 'Mulai Scan AI' }}
            </Button>
          </div>
        </div>

        <!-- STEP 2: REVIEW & MEMBERS -->
        <div v-if="currentStep === 1" class="space-y-8 animate-fade-in-up">
          
          <!-- Rincian Nota -->
          <div class="bg-surface-subtle rounded-md p-5 border border-border-default">
            <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <IconReceipt class="w-5 h-5 text-text-muted" />
              Rincian Tagihan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Nama Tempat</label>
                <input type="text" v-model="receiptData.merchant" class="form-input w-full rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Subtotal (Rp)</label>
                <input type="number" v-model="receiptData.subtotal" class="form-input w-full rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Pajak (Rp)</label>
                <input type="number" v-model="receiptData.tax" class="form-input w-full rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Total Keseluruhan (Rp)</label>
                <input type="number" v-model="receiptData.total" class="form-input w-full rounded-lg" />
              </div>
            </div>
          </div>

          <!-- Tambah Teman -->
          <div>
            <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <IconUsers class="w-5 h-5 text-text-muted" />
              Siapa Saja yang Ikut?
            </h3>
            
            <div class="flex flex-wrap gap-3 mb-4">
              <div v-for="(member, idx) in members" :key="idx" 
                   class="bg-brand-soft text-brand-text px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                {{ member }}
                <button @click="removeMember(idx)" class="text-brand-primary hover:text-brand-primary-hover focus:outline-none">
                  <IconClose class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div class="flex gap-2">
              <input type="text" v-model="newMemberName" @keyup.enter="addMember" placeholder="Ketik nama lalu Enter..." 
                     class="form-input flex-1 rounded-lg" />
              <Button variant="primary" @click="addMember">
                Tambah
              </Button>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-8">
            <Button variant="secondary" @click="currentStep = 0">
              Kembali
            </Button>
            <Button variant="primary" @click="goToAssignment" :disabled="members.length < 1">
              Lanjut Bagi Menu
            </Button>
          </div>
        </div>

        <!-- STEP 3: ASSIGNMENT -->
        <div v-if="currentStep === 2" class="space-y-6 animate-fade-in-up">
          <p class="text-text-secondary mb-6">Pilih siapa saja yang mengkonsumsi masing-masing menu di bawah ini. AI akan otomatis membagi harganya secara rata.</p>
          
          <div class="space-y-4">
            <div v-for="(item, idx) in receiptData.items" :key="idx" 
                 class="bg-surface-card border border-border-default rounded-md p-4 transition-shadow hover:border-border-strong">
              
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-medium text-text-primary">{{ item.name }}</h4>
                  <p class="text-sm text-text-muted font-mono">Rp {{ formatNumber(item.price) }}</p>
                </div>
              </div>
              
              <!-- Checkboxes for members -->
              <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border-default">
                <label v-for="member in members" :key="member" 
                       class="inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" 
                         :value="member" 
                         v-model="itemAssignments[idx]" 
                         class="peer sr-only" />
                  <div class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-surface-subtle text-text-muted peer-checked:bg-brand-soft peer-checked:text-brand-text border border-transparent peer-checked:border-brand-primary">
                    {{ member }}
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-border-default">
            <Button variant="secondary" @click="currentStep = 1">
              Kembali
            </Button>
            <Button variant="primary" @click="processSplit" :disabled="isProcessing">
              <IconRefresh v-if="isProcessing" class="w-5 h-5 animate-spin" />
              <IconCheckCircle v-else class="w-5 h-5" />
              {{ isProcessing ? 'Memproses...' : 'Selesai & Bagi Tagihan' }}
            </Button>
          </div>
        </div>

      </div>
    </div>

    <!-- HISTORY SECTION -->
    <div class="mt-12 bg-surface-card rounded-lg border border-border-default overflow-hidden">
      <div class="p-6 md:p-8">
        <h2 class="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <IconReceipt class="w-6 h-6 text-brand-primary" />
          Riwayat Split Bill
        </h2>
        
        <div v-if="isLoadingHistory" class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-surface-subtle rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-surface-subtle rounded"></div>
              <div class="h-4 bg-surface-subtle rounded w-5/6"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="historyList.length === 0" class="text-center py-8">
          <p class="text-text-muted">Belum ada riwayat Split Bill. Yuk coba scan struk pertamamu!</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="history in historyList" :key="history.id" 
               @click="openHistory(history.id)"
               class="bg-surface-subtle border border-border-default p-5 rounded-md cursor-pointer hover:border-brand-primary transition-colors">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-text-primary text-lg">{{ history.merchant || 'Tempat Makan' }}</h3>
              <span class="text-xs text-text-faint">{{ formatDate(history.createdAt) }}</span>
            </div>
            <p class="text-sm text-text-secondary mb-4">Total: <span class="font-bold text-brand-primary">Rp {{ formatNumber(history.totalAmount) }}</span></p>
            <div class="text-xs text-text-muted truncate">
              {{ parseSummary(history.summaryText) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { IconAi, IconCheckCircle, IconClose, IconReceipt, IconRefresh, IconUpload, IconUsers } from '@/ui/icons';
import { Button } from '@/ui';
import { notify } from "@/lib/notify";
import { useCelebration } from '@/composables/useCelebration';
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/lib/apiClient';

const router = useRouter();
const steps = ['Upload Struk', 'Review & Teman', 'Bagi Menu'];
const { celebrate } = useCelebration();
const currentStep = ref(0);

// History State
const historyList = ref([]);
const isLoadingHistory = ref(false);

const fetchHistory = async () => {
  isLoadingHistory.value = true;
  try {
    const res = await apiClient.get('/split/history');
    if (res.data && res.data.data) {
      historyList.value = res.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch split history", error);
  } finally {
    isLoadingHistory.value = false;
  }
};

onMounted(() => {
  fetchHistory();
});

const openHistory = (id) => {
  const url = router.resolve(`/share/split/${id}`).href;
  window.open(url, '_blank');
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const parseSummary = (text) => {
  if (!text) return "";
  // Ambil beberapa baris pertama dari ringkasan WA
  const lines = text.split('\n').filter(line => line.trim() !== '');
  return lines.slice(0, 3).join(' ') + '...';
};

// State Step 1
const fileInput = ref(null);
const selectedFile = ref(null);
const isScanning = ref(false);

// State Step 2
const receiptData = reactive({
  merchant: '',
  subtotal: 0,
  tax: 0,
  service: 0,
  discount: 0,
  total: 0,
  items: []
});
const members = ref([]);
const newMemberName = ref('');

// State Step 3
const itemAssignments = ref([]); // Array of Array (Tiap elemen menyimpan daftar nama yang di-assign ke item dengan index tsb)
const isProcessing = ref(false);

// --- Methods Step 1 ---
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    selectedFile.value = e.target.files[0];
  }
};

const handleDrop = (e) => {
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    selectedFile.value = e.dataTransfer.files[0];
  }
};

const scanReceipt = async () => {
  if (!selectedFile.value) return;
  
  isScanning.value = true;
  try {
    const formData = new FormData();
    formData.append('image', selectedFile.value);
    formData.append('file', selectedFile.value);
    
    // Panggil API Backend (Kainest_Be) proxy
    const response = await apiClient.post('/split/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data && response.data.data) {
      const data = response.data.data;
      receiptData.merchant = data.merchant || 'Tempat Makan';
      receiptData.subtotal = data.subtotal || 0;
      receiptData.tax = data.tax || 0;
      receiptData.service = data.service || 0;
      receiptData.discount = data.discount || 0;
      receiptData.total = data.total || 0;
      receiptData.items = data.items || [];
      
      // Initialize assignments array based on items length
      itemAssignments.value = data.items.map(() => []);

      // Struk berhasil diurai AI — momen "wow" fitur ini.
      celebrate('split-bill');
      
      currentStep.value = 1;
    }
  } catch (error) {
    console.error("Gagal scan:", error);
    notify.error("Gagal memproses struk. Pastikan format foto jelas.");
  } finally {
    isScanning.value = false;
  }
};

// --- Methods Step 2 ---
const addMember = () => {
  const name = newMemberName.value.trim();
  if (name && !members.value.includes(name)) {
    members.value.push(name);
    newMemberName.value = '';
  }
};

const removeMember = (index) => {
  const nameToRemove = members.value[index];
  members.value.splice(index, 1);
  // Bersihkan assignment dari nama yang dihapus
  itemAssignments.value = itemAssignments.value.map(assigned => 
    assigned.filter(n => n !== nameToRemove)
  );
};

const goToAssignment = () => {
  if (members.value.length === 0) {
    notify.warning("Tambahkan setidaknya 1 orang.");
    return;
  }
  currentStep.value = 2;
};

// --- Methods Step 3 ---
const processSplit = async () => {
  isProcessing.value = true;
  try {
    // Bangun payload yang sesuai dengan Schema SplitBillRequest
    const assignmentsPayload = receiptData.items.map((item, idx) => ({
      item_name: item.name,
      total_price: item.price,
      assigned_to: itemAssignments.value[idx]
    })).filter(a => a.assigned_to.length > 0);

    const payload = {
      mode: 'itemized',
      merchant: receiptData.merchant,
      subtotal: Number(receiptData.subtotal),
      tax: Number(receiptData.tax),
      service: Number(receiptData.service),
      discount: Number(receiptData.discount),
      total: Number(receiptData.total),
      members: members.value,
      assignments: assignmentsPayload
    };

    // Simpan data Split ke DB
    const response = await apiClient.post('/split', payload);
    
    if (response.data && response.data.sessionId) {
      // Redirect ke halaman share
      router.push(`/share/split/${response.data.sessionId}`);
    }
  } catch (error) {
    console.error("Gagal proses split:", error);
    notify.error("Terjadi kesalahan saat memproses tagihan.");
  } finally {
    isProcessing.value = false;
  }
};

// --- Helpers ---
const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
