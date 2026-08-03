<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold flex items-center gap-2">
          <SparklesIcon class="w-8 h-8 text-violet-500" />
          Split Bill AI
        </h1>
        <p class="text-sm text-gray-500 mt-1">Otomatis deteksi struk, bagi tagihan lebih adil tanpa pusing.</p>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      <!-- STEPPER -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex-1 py-4 px-4 text-center text-sm font-semibold transition-colors duration-200"
          :class="currentStep >= index ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600' : 'text-gray-400 border-b-2 border-transparent'"
        >
          {{ index + 1 }}. {{ step }}
        </div>
      </div>

      <div class="p-6 md:p-8">
        
        <!-- STEP 1: UPLOAD -->
        <div v-if="currentStep === 0" class="space-y-6">
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
               @click="triggerFileInput"
               @dragover.prevent
               @drop.prevent="handleDrop">
            
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
            
            <DocumentArrowUpIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
            
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Upload Foto Struk</h3>
            <p class="text-sm text-gray-500 mt-1">Klik untuk memilih atau drag & drop file (JPG, PNG)</p>
            
            <div v-if="selectedFile" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-sm">
              <CheckCircleIcon class="w-5 h-5" />
              {{ selectedFile.name }}
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="scanReceipt" 
              :disabled="!selectedFile || isScanning"
              class="btn bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg shadow-violet-500/30 transition-all"
            >
              <ArrowPathIcon v-if="isScanning" class="w-5 h-5 animate-spin" />
              <SparklesIcon v-else class="w-5 h-5" />
              {{ isScanning ? 'Membaca Struk...' : 'Mulai Scan AI' }}
            </button>
          </div>
        </div>

        <!-- STEP 2: REVIEW & MEMBERS -->
        <div v-if="currentStep === 1" class="space-y-8 animate-fade-in-up">
          
          <!-- Rincian Nota -->
          <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <ReceiptRefundIcon class="w-5 h-5 text-gray-500" />
              Rincian Tagihan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Tempat</label>
                <input type="text" v-model="receiptData.merchant" class="form-input w-full rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtotal (Rp)</label>
                <input type="number" v-model="receiptData.subtotal" class="form-input w-full rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pajak (Rp)</label>
                <input type="number" v-model="receiptData.tax" class="form-input w-full rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Keseluruhan (Rp)</label>
                <input type="number" v-model="receiptData.total" class="form-input w-full rounded-lg" />
              </div>
            </div>
          </div>

          <!-- Tambah Teman -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <UsersIcon class="w-5 h-5 text-gray-500" />
              Siapa Saja yang Ikut?
            </h3>
            
            <div class="flex flex-wrap gap-3 mb-4">
              <div v-for="(member, idx) in members" :key="idx" 
                   class="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                {{ member }}
                <button @click="removeMember(idx)" class="text-indigo-400 hover:text-indigo-600 focus:outline-none">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div class="flex gap-2">
              <input type="text" v-model="newMemberName" @keyup.enter="addMember" placeholder="Ketik nama lalu Enter..." 
                     class="form-input flex-1 rounded-lg" />
              <button @click="addMember" class="btn bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 rounded-lg px-4">
                Tambah
              </button>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-8">
            <button @click="currentStep = 0" class="btn border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-300">
              Kembali
            </button>
            <button @click="goToAssignment" :disabled="members.length < 1" class="btn bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/30 px-6">
              Lanjut Bagi Menu
            </button>
          </div>
        </div>

        <!-- STEP 3: ASSIGNMENT -->
        <div v-if="currentStep === 2" class="space-y-6 animate-fade-in-up">
          <p class="text-gray-600 dark:text-gray-400 mb-6">Pilih siapa saja yang mengkonsumsi masing-masing menu di bawah ini. AI akan otomatis membagi harganya secara rata.</p>
          
          <div class="space-y-4">
            <div v-for="(item, idx) in receiptData.items" :key="idx" 
                 class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500 font-mono">Rp {{ formatNumber(item.price) }}</p>
                </div>
              </div>
              
              <!-- Checkboxes for members -->
              <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <label v-for="member in members" :key="member" 
                       class="inline-flex items-center cursor-pointer select-none">
                  <input type="checkbox" 
                         :value="member" 
                         v-model="itemAssignments[idx]" 
                         class="peer sr-only" />
                  <div class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                              bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400
                              peer-checked:bg-violet-100 peer-checked:text-violet-700 
                              dark:peer-checked:bg-violet-900/40 dark:peer-checked:text-violet-400
                              border border-transparent peer-checked:border-violet-300 dark:peer-checked:border-violet-700/50">
                    {{ member }}
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button @click="currentStep = 1" class="btn border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-300">
              Kembali
            </button>
            <button @click="processSplit" :disabled="isProcessing" class="btn bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/30 px-6 flex items-center gap-2">
              <ArrowPathIcon v-if="isProcessing" class="w-5 h-5 animate-spin" />
              <CheckCircleIcon v-else class="w-5 h-5" />
              {{ isProcessing ? 'Memproses...' : 'Selesai & Bagi Tagihan' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/lib/apiClient';
import { 
  SparklesIcon, 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const steps = ['Upload Struk', 'Review & Teman', 'Bagi Menu'];
const currentStep = ref(0);

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
      
      currentStep.value = 1;
    }
  } catch (error) {
    console.error("Gagal scan:", error);
    alert("Gagal memproses struk. Pastikan format foto jelas.");
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
    alert("Tambahkan setidaknya 1 orang.");
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
    alert("Terjadi kesalahan saat memproses tagihan.");
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
