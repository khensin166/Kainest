// useBudgetStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

// --- Dependencies Injection ---
import { 
  getDashboardSummaryUseCase, 
  getAiAdviceUseCase, 
  createTransactionUseCase, 
  getCategoriesUseCase, 
  getSpendingTrendUseCase, 
  getTransactionsListUseCase, 
  getTransactionDetailUseCase, 
  updateTransactionUseCase, 
  deleteTransactionUseCase 
} from "../../../../core/di/di";

// No more manual instantiation - Clean! ✨
const getDashboardSummaryUseCaseInstance = getDashboardSummaryUseCase;
const getAiAdviceUseCaseInstance = getAiAdviceUseCase;
const createTransactionUseCaseInstance = createTransactionUseCase;
const getCategoriesUseCaseInstance = getCategoriesUseCase;
const getSpendingTrendUseCaseInstance = getSpendingTrendUseCase;
const getTransactionsListUseCaseInstance = getTransactionsListUseCase;
const getTransactionDetailUseCaseInstance = getTransactionDetailUseCase;
const updateTransactionUseCaseInstance = updateTransactionUseCase;
const deleteTransactionUseCaseInstance = deleteTransactionUseCase;

export const useBudgetStore = defineStore("budget", () => {
  // =========================================
  // 📦 STATE
  // =========================================
  const summaryData = ref(null);
  const isLoadingSummary = ref(false);
  const errorSummary = ref(null);
  const isTransactionSubmitting = ref(false);
  const categoriesList = ref([]); // Menyimpan array CategoryEntity
  const isLoadingCategories = ref(false); // Status loading dropdown
  const trendDataList = ref([]); // Menyimpan array TrendDataEntity penuh satu bulan
  const isLoadingTrend = ref(false);
  const transactionsList = ref([]); // Array TransactionEntity
  const transactionsMeta = ref(null); // Object pagination { currentPage, totalPages, ... }
  const isLoadingTransactions = ref(false);
  const isDeletingTransactionId = ref(null);

  // =========================================
  // 🧠 GETTERS
  // =========================================
  const budgetCategories = computed(() => summaryData.value?.categories || []);
  const totalRemaining = computed(
    () => summaryData.value?.totals?.remaining || 0
  );
  const currentPeriodMonth = computed(() => summaryData.value?.month || "-");
  const hasData = computed(
    () => !!summaryData.value && !isLoadingSummary.value
  );
  const expenseCategories = computed(() =>
    categoriesList.value.filter((c) => c.type === "EXPENSE")
  );

  // GETTER BARU: Mengubah data entity menjadi format siap pakai untuk Chart.js
  const chartDataCollection = computed(() => {
    if (trendDataList.value.length === 0) return null;

    return {
      labels: trendDataList.value.map((item) => item.labelDay),
      datasets: [
        {
          label: "Realisasi Pengeluaran",
          data: trendDataList.value.map((item) => item.amount),
          borderColor: "#10B981", // Tailwind green-500
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  });

  // GETTER BARU: Mengelompokkan transaksi berdasarkan tanggal untuk UI "Recent Activity"
  const groupedTransactions = computed(() => {
    if (transactionsList.value.length === 0) return {};

    const groups = {};
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    transactionsList.value.forEach((tx) => {
      if (!tx.date) return;
      const txDateStr = tx.date.toISOString().split("T")[0];

      let groupKey = txDateStr;
      if (txDateStr === today) groupKey = "Hari Ini";
      else if (txDateStr === yesterday) groupKey = "Kemarin";
      else {
        groupKey = tx.date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
    });

    return groups;
  });

  // GETTER UNTUK PAGINATION
  const currentPage = computed(() => transactionsMeta.value?.currentPage || 1);
  const totalPages = computed(() => transactionsMeta.value?.totalPages || 1);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPreviousPage = computed(() => currentPage.value > 1);

  // =========================================
  // ⚡ ACTIONS
  // =========================================

  async function fetchDashboardSummary() {
    console.log(
      "⚡ [STORE ACTION] fetchDashboardSummary dipanggil (Support Failure Lama)!"
    );
    isLoadingSummary.value = true;
    errorSummary.value = null;

    const result = await getDashboardSummaryUseCaseInstance.execute();

    // (Cek properti 'right' karena failure.js lama)
    if (result.right) {
      summaryData.value = result.right;
      console.log("✅ Data berhasil dimuat ke Store:", summaryData.value);
    } else {
      errorSummary.value =
        result.left?.message || "Terjadi kesalahan tidak diketahui.";
      summaryData.value = null;
      console.error("❌ Gagal memuat data:", errorSummary.value);
    }

    isLoadingSummary.value = false;
  }

  async function fetchAiAdviceForCategory(categoryId) {
    if (!summaryData.value || !summaryData.value.categories) return;
    const categoryIndex = summaryData.value.categories.findIndex(
      (c) => c.categoryId === categoryId
    );
    if (categoryIndex === -1) return;

    const result = await getAiAdviceUseCaseInstance.execute(categoryId);

    if (result.right) {
      const adviceData = result.right;
      const targetCategory = summaryData.value.categories[categoryIndex];
      targetCategory.zone = adviceData.zone;
      targetCategory.aiAdvice = adviceData.advice;
    } else {
      console.error("Gagal mengambil saran AI:", result.left?.message);
    }
  }

  async function fetchAllCategories() {
    if (categoriesList.value.length > 0) return;

    console.log("⚡ [STORE ACTION] fetchAllCategories dipanggil!");
    isLoadingCategories.value = true;

    const result = await getCategoriesUseCaseInstance.execute();

    if (result.right) {
      categoriesList.value = result.right;
    } else {
      console.error("❌ Gagal memuat kategori:", result.left?.message);
    }

    isLoadingCategories.value = false;
  }

  async function fetchSpendingTrend() {
    console.log("⚡ [STORE ACTION] fetchSpendingTrend dipanggil!");
    isLoadingTrend.value = true;

    const result = await getSpendingTrendUseCaseInstance.execute();

    if (result.right) {
      trendDataList.value = result.right;
    } else {
      console.error("❌ Gagal memuat data grafik:", result.left?.message);
    }

    isLoadingTrend.value = false;
  }

  /**
   * CREATE: Membuat transaksi baru (Existing)
   */
  async function submitTransaction(transactionData) {
    isTransactionSubmitting.value = true;
    const result = await createTransactionUseCaseInstance.execute(transactionData);
    isTransactionSubmitting.value = false;

    if (result.right) {
      fetchDashboardSummary();
      fetchTransactions({ page: 1 }, true);
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  /**
   * BARU: READ LIST - Mengambil daftar riwayat transaksi dengan filter
   */
  async function fetchTransactions(params = {}, forceRefresh = false) {
    const finalParams = { page: 1, limit: 10, ...params };

    // Validasi Cache:
    // Gunakan cache hanya jika:
    // 1. Tidak dipaksa refresh (!forceRefresh)
    // 2. Data sudah ada (transactionsList.length > 0)
    // 3. Halaman yang diminta SAMA dengan halaman yang tersimpan (params.page == meta.currentPage)
    // 4. Tidak ada filter pencarian/tanggal yang aktif (opsional, tapi aman untuk re-fetch jika filter berubah)
    const isSamePage = transactionsMeta.value?.currentPage === finalParams.page;

    if (
      transactionsList.value.length > 0 && 
      !forceRefresh && 
      isSamePage
    ) {
      console.log("⚡ Menggunakan data cache di Store (Page sama & tidak force)");
      return;
    }

    console.log("🌐 Mengambil data baru dari API...", finalParams);

    const result = await getTransactionsListUseCaseInstance.execute(finalParams);

    if (result.right) {
      transactionsList.value = result.right.transactions;
      transactionsMeta.value = result.right.meta;
    } else {
      console.error("❌ Gagal memuat list transaksi:", result.left?.message);
    }
    isLoadingTransactions.value = false;
  }

  /**
   * BARU: READ DETAIL - Mengambil satu data untuk pre-fill form edit
   */
  async function fetchTransactionById(id) {
    isLoadingTransactions.value = true;
    const result = await getTransactionDetailUseCaseInstance.execute(id);
    isLoadingTransactions.value = false;

    if (result.right) {
      return result.right;
    } else {
      console.error(
        "❌ Gagal mengambil detail transaksi:",
        result.left?.message
      );
      return null;
    }
  }

  /**
   * BARU: UPDATE - Menyimpan perubahan transaksi
   */
  async function updateTransaction(id, updateData) {
    isTransactionSubmitting.value = true;
    const result = await updateTransactionUseCaseInstance.execute(id, updateData);
    isTransactionSubmitting.value = false;

    if (result.right) {
      fetchDashboardSummary();
      if (transactionsMeta.value?.currentPage) {
        fetchTransactions({ page: transactionsMeta.value.currentPage }, true);
      }
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  /**
   * BARU: DELETE - Menghapus transaksi
   */
  async function deleteTransaction(id) {
    isDeletingTransactionId.value = id;

    const result = await deleteTransactionUseCaseInstance.execute(id);

    isDeletingTransactionId.value = null;

    if (result.right) {
      fetchDashboardSummary();
      fetchTransactions({ page: 1 }, true);
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  // RETURN SEMUA STATE, GETTERS, DAN ACTIONS (SUDAH DIRAPIKAN)
  return {
    // State
    summaryData,
    isLoadingSummary,
    errorSummary,
    trendDataList,
    isLoadingTrend,
    categoriesList,
    isLoadingCategories,
    isTransactionSubmitting,
    transactionsList,
    transactionsMeta,
    isLoadingTransactions,
    isDeletingTransactionId,

    // Getters
    budgetCategories,
    totalRemaining,
    currentPeriodMonth,
    hasData,
    chartDataCollection,
    expenseCategories,
    groupedTransactions,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,

    // Actions
    fetchDashboardSummary,
    fetchAiAdviceForCategory,
    fetchSpendingTrend,
    fetchAllCategories,
    submitTransaction,
    fetchTransactions,
    fetchTransactionById,
    updateTransaction,
    deleteTransaction,
  };
});
