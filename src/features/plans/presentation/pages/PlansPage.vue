<!-- PlansPage.vue — Rencana Keuangan.
     Satu halaman untuk tagihan dan wishlist karena keduanya menjawab pertanyaan
     yang sama: "uang saya sudah dijanjikan ke mana?". Memisahkannya jadi dua
     halaman memaksa pengguna membuka dua tempat untuk satu pertanyaan. -->
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight">Rencana Keuangan</h1>
          <PageGuide :steps="pageGuides.plans" />
        </div>
        <p class="text-sm text-text-muted mt-1">
          Tagihan yang harus dibayar dan tabungan yang sedang dikumpulkan, dalam satu tempat.
        </p>
      </div>
      <Button variant="primary" class="shrink-0" @click="bukaFormBaru">
        <IconAdd class="h-4 w-4 shrink-0" aria-hidden="true" />
        <span class="ml-2">{{ tab === 'bills' ? 'Tagihan Baru' : 'Wishlist Baru' }}</span>
      </Button>
    </header>

    <div class="mb-6">
      <SolvencyBar :health="store.health" />
    </div>

    <Tabs v-model="tab" :items="tabItems">
      <template #bills>
        <BillList :bills="store.bills" :loading="store.isLoadingBills" :error="store.errorBills"
          @retry="store.fetchBills" @pay="bukaPembayaran" @skip="lewati" @cancel="batalkan"
          @edit="bukaFormUbah" @remove="hapusTagihan" />
      </template>

      <template #goals>
        <div v-if="store.isLoadingGoals" class="flex justify-center py-12">
          <Spinner class="h-6 w-6 text-brand-primary" />
        </div>
        <EmptyState v-else-if="store.goals.length === 0" :icon="IconSavings"
          title="Belum ada wishlist"
          description="Buat target seperti “Jalan ke Bali”, tentukan berapa yang disisihkan tiap bulan, dan pantau progresnya." />
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SavingGoalCard v-for="goal in store.goals" :key="goal.id" :goal="goal"
            @edit="bukaFormWishlist" @remove="hapusWishlist" @contribute="bukaSetoran" />
        </div>
      </template>
    </Tabs>

    <BillFormModal :open="formTagihanTerbuka" :bill="tagihanTerpilih" :categories="budgetStore.categoriesList"
      :submitting="store.isSubmitting" @close="formTagihanTerbuka = false" @submit="simpanTagihan" />

    <BillPayModal :open="modalBayarTerbuka" :bill="tagihanTerpilih" :submitting="store.isSubmitting"
      @close="modalBayarTerbuka = false" @submit="bayar" />

    <SavingGoalFormModal :open="formWishlistTerbuka" :goal="wishlistTerpilih"
      :submitting="store.isSubmitting" @close="formWishlistTerbuka = false" @submit="simpanWishlist" />

    <ContributeModal :open="modalSetorTerbuka" :goal="wishlistTerpilih" :submitting="store.isSubmitting"
      @close="modalSetorTerbuka = false" @submit="setor" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Button, Tabs, Spinner, EmptyState } from '@/ui';
import { IconAdd, IconSavings } from '@/ui/icons';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { usePlansStore } from '../stores/usePlansStore';
import { useBudgetStore } from '@/features/budgeting/presentation/stores/useBudgetStore';
import SolvencyBar from '../components/SolvencyBar.vue';
import BillList from '../components/BillList.vue';
import BillFormModal from '../components/BillFormModal.vue';
import BillPayModal from '../components/BillPayModal.vue';
import SavingGoalCard from '../components/SavingGoalCard.vue';
import SavingGoalFormModal from '../components/SavingGoalFormModal.vue';
import ContributeModal from '../components/ContributeModal.vue';

const store = usePlansStore();
const budgetStore = useBudgetStore();

const tabItems = [
  { value: 'bills', label: 'Tagihan' },
  { value: 'goals', label: 'Tabungan' },
];
const tab = ref('bills');

const formTagihanTerbuka = ref(false);
const modalBayarTerbuka = ref(false);
const formWishlistTerbuka = ref(false);
const modalSetorTerbuka = ref(false);
const tagihanTerpilih = ref(null);
const wishlistTerpilih = ref(null);

onMounted(() => {
  store.fetchBills();
  store.fetchGoals();
  store.fetchHealth();
  budgetStore.fetchAllCategories(); // sudah punya penjaga: berhenti bila daftar terisi
});

function bukaFormBaru() {
  if (tab.value === 'bills') {
    tagihanTerpilih.value = null;
    formTagihanTerbuka.value = true;
  } else {
    wishlistTerpilih.value = null;
    formWishlistTerbuka.value = true;
  }
}

function bukaFormUbah(bill) {
  tagihanTerpilih.value = bill;
  formTagihanTerbuka.value = true;
}

function bukaPembayaran(bill) {
  tagihanTerpilih.value = bill;
  modalBayarTerbuka.value = true;
}

function bukaFormWishlist(goal) {
  wishlistTerpilih.value = goal;
  formWishlistTerbuka.value = true;
}

function bukaSetoran(goal) {
  wishlistTerpilih.value = goal;
  modalSetorTerbuka.value = true;
}

async function simpanTagihan(payload) {
  const hasil = tagihanTerpilih.value
    ? await store.updateBill(tagihanTerpilih.value.id, payload)
    : await store.createBill(payload);
  if (hasil.success) formTagihanTerbuka.value = false;
}

async function bayar(payload) {
  const hasil = await store.payBill(tagihanTerpilih.value.id, payload);
  if (hasil.success) modalBayarTerbuka.value = false;
}

const lewati = (bill) => store.skipBill(bill.id);
const batalkan = (bill) => store.cancelBillPayment(bill.id);

function hapusTagihan(bill) {
  if (confirm(`Hapus tagihan "${bill.name}" beserta riwayat pembayarannya?`)) {
    store.deleteBill(bill.id);
  }
}

async function simpanWishlist(payload) {
  const hasil = wishlistTerpilih.value
    ? await store.updateGoal(wishlistTerpilih.value.id, payload)
    : await store.createGoal(payload);
  if (hasil.success) formWishlistTerbuka.value = false;
}

async function setor(payload) {
  const hasil = await store.contribute(wishlistTerpilih.value.id, payload);
  if (hasil.success) modalSetorTerbuka.value = false;
}

function hapusWishlist(goal) {
  if (confirm(`Hapus wishlist "${goal.name}" beserta riwayat setorannya?`)) {
    store.deleteGoal(goal.id);
  }
}
</script>
