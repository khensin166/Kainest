// useBudgetStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

// --- Dependencies Injection ---
import { 
  getDashboardSummaryUseCase, 
  getAiAdviceUseCase, 
  createTransactionUseCase, 
  getCategoriesUseCase, 
  createCategoryUseCase,
  getSpendingTrendUseCase, 
  getTransactionsListUseCase, 
  getTransactionDetailUseCase, 
  updateTransactionUseCase, 
  deleteTransactionUseCase,
  setupBudgetUseCase,
  getPocketsUseCase,
  upsertPocketUseCase,
  deletePocketUseCase,
  bulkSetupPocketsUseCase,
  updatePocketKeywordsUseCase,
  getMonthlyHistoryUseCase
} from "../../../../core/di/di";

// No more manual instantiation - Clean! ✨
const getDashboardSummaryUseCaseInstance = getDashboardSummaryUseCase;
const getAiAdviceUseCaseInstance = getAiAdviceUseCase;
const createTransactionUseCaseInstance = createTransactionUseCase;
const getCategoriesUseCaseInstance = getCategoriesUseCase;
const createCategoryUseCaseInstance = createCategoryUseCase;
const getSpendingTrendUseCaseInstance = getSpendingTrendUseCase;
const getTransactionsListUseCaseInstance = getTransactionsListUseCase;
const updateTransactionUseCaseInstance = updateTransactionUseCase;
const deleteTransactionUseCaseInstance = deleteTransactionUseCase;
const setupBudgetUseCaseInstance = setupBudgetUseCase;
const getPocketsUseCaseInstance = getPocketsUseCase;
const upsertPocketUseCaseInstance = upsertPocketUseCase;
const deletePocketUseCaseInstance = deletePocketUseCase;
const bulkSetupPocketsUseCaseInstance = bulkSetupPocketsUseCase;
const updatePocketKeywordsUseCaseInstance = updatePocketKeywordsUseCase;
const getMonthlyHistoryUseCaseInstance = getMonthlyHistoryUseCase;

export const useBudgetStore = defineStore("budget", () => {
  // =========================================
  // 📦 STATE
  // =========================================
  const summaryData = ref(null);
  const isLoadingSummary = ref(false);
  const errorSummary = ref(null);
  const typeFilter = ref("ALL"); 
  const isTransactionSubmitting = ref(false);
  const categoriesList = ref([]); // Menyimpan array CategoryEntity
  const isLoadingCategories = ref(false); // Status loading dropdown
  const trendDataList = ref([]); // Menyimpan array TrendDataEntity penuh satu bulan
  const isLoadingTrend = ref(false);
  const transactionsList = ref([]); // Array TransactionEntity
  const transactionsMeta = ref(null); // Object pagination { currentPage, totalPages, ... }
  const isLoadingTransactions = ref(false);
  const isDeletingTransactionId = ref(null);

  // === POCKET STATE ===
  const pocketsList = ref([]);
  const isLoadingPockets = ref(false);
  const errorPockets = ref(null);

  // === HISTORY STATE ===
  const historyList = ref([]);
  const isLoadingHistory = ref(false);

  // =========================================
  // 🧠 GETTERS
  // =========================================
  const salary = computed(() => summaryData.value?.salary || 0);
  const budgetCategories = computed(() => summaryData.value?.categories || []);
  const totalRemaining = computed(
    () => summaryData.value?.totals?.remaining || 0
  );
  const unallocatedBudget = computed(
    () => summaryData.value?.totals?.unallocated ?? 0
  );
  const currentPeriodMonth = computed(() => summaryData.value?.month || "-");
  const hasData = computed(
    () => !!summaryData.value && !isLoadingSummary.value
  );
  const expenseCategories = computed(() =>
    categoriesList.value.filter((c) => c.type === "EXPENSE")
  );
  const incomeCategories = computed(() =>
    categoriesList.value.filter((c) => c.type === "INCOME")
  );

  // GETTERS BARU UNTUK INCOME & MoM
  const totalIncome = computed(
    () => summaryData.value?.totals?.additionalIncome ?? summaryData.value?.totals?.income ?? 0
  );

  const momSpent = computed(() => summaryData.value?.totals?.mom?.spent ?? null);
  const momIncome = computed(() => summaryData.value?.totals?.mom?.additionalIncome ?? summaryData.value?.totals?.mom?.income ?? null);
  const momLimit = computed(() => summaryData.value?.totals?.mom?.limit ?? null);
  const momRemaining = computed(() => summaryData.value?.totals?.mom?.remaining ?? null);
  const totalSpent = computed(() => summaryData.value?.totals?.spent || 0);


  // GETTER BARU: Mengubah data entity menjadi format siap pakai untuk Chart.js
  const chartDataCollection = computed(() => {
    if (trendDataList.value.length === 0) return null;

    // Agregasi (Group by) berdasarkan labelDay agar tidak ada tanggal ganda
    const aggregated = {};
    trendDataList.value.forEach((item) => {
      if (!aggregated[item.labelDay]) {
        aggregated[item.labelDay] = 0;
      }
      aggregated[item.labelDay] += item.amount;
    });

    return {
      labels: Object.keys(aggregated),
      datasets: [
        {
          label: "Realisasi Pengeluaran",
          data: Object.values(aggregated),
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

  async function createCategory(name, icon) {
    const result = await createCategoryUseCaseInstance.execute(name, icon);
    if (result.right) {
      // Reload list kategori agar langsung update di UI
      categoriesList.value = [];
      await fetchAllCategories();
      return { success: true, data: result.right };
    } else {
      return { success: false, message: result.left?.message };
    }
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
      fetchMonthlyHistory();
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  /**
   * UPDATE: Memperbarui transaksi (Existing)
   */
  async function updateTransaction(id, transactionData) {
    isTransactionSubmitting.value = true;
    const result = await updateTransactionUseCaseInstance.execute(id, transactionData);
    isTransactionSubmitting.value = false;

    if (result.right) {
      // Refresh list agar data terbaru tampil
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
    const finalParams = { page: 1, limit: 10, type: typeFilter.value, ...params };

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
      fetchMonthlyHistory();
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
      fetchMonthlyHistory();
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  /**
   * BARU: Setup Budget Configuration
   */
  async function setupBudget(data) {
    const result = await setupBudgetUseCaseInstance.execute(data);
    
    if (result.right) {
      // fetchDashboardSummary dipindahkan ke komponen parent (BudgetDashboardPage)
      // agar tidak terjadi race condition UI saat modal ditutup.
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  // =========================================
  // 💰 POCKET ACTIONS
  // =========================================

  async function fetchPockets() {
    isLoadingPockets.value = true;
    errorPockets.value = null;
    const result = await getPocketsUseCaseInstance.execute();
    if (result.right) {
      pocketsList.value = result.right;
    } else {
      errorPockets.value = result.left?.message;
      console.error("Gagal memuat daftar kantong:", errorPockets.value);
    }
    isLoadingPockets.value = false;
  }

  async function upsertPocket(data) {
    isLoadingPockets.value = true;
    errorPockets.value = null;
    const result = await upsertPocketUseCaseInstance.execute(data);
    isLoadingPockets.value = false;
    
    if (result.right) {
      await fetchPockets();
      await fetchDashboardSummary(); // Refresh dashboard agar limit kategori terupdate
      return true;
    } else {
      errorPockets.value = result.left?.message;
      return false;
    }
  }

  async function deletePocket(categoryId) {
    isLoadingPockets.value = true;
    errorPockets.value = null;
    const result = await deletePocketUseCaseInstance.execute(categoryId);
    isLoadingPockets.value = false;

    if (result.right) {
      await fetchPockets();
      await fetchDashboardSummary(); // Refresh dashboard
      return true;
    } else {
      errorPockets.value = result.left?.message;
      return false;
    }
  }

  async function bulkSetupPockets(data) {
    isLoadingPockets.value = true;
    errorPockets.value = null;
    const result = await bulkSetupPocketsUseCaseInstance.execute(data);
    isLoadingPockets.value = false;

    if (result.right) {
      await fetchPockets();
      // fetchDashboardSummary dipindahkan ke komponen parent (BudgetDashboardPage)
      // agar tidak terjadi race condition UI saat modal ditutup.
      return true;
    } else {
      errorPockets.value = result.left?.message;
      return false;
    }
  }

  async function updateKeywords(categoryId, keywords) {
    isLoadingPockets.value = true;
    errorPockets.value = null;
    const result = await updatePocketKeywordsUseCaseInstance.execute(categoryId, keywords);
    isLoadingPockets.value = false;

    if (result.right) {
      await fetchPockets();
      return true;
    } else {
      errorPockets.value = result.left?.message;
      return false;
    }
  }

  // =========================================
  // 📅 HISTORY ACTIONS
  // =========================================

  async function fetchMonthlyHistory() {
    isLoadingHistory.value = true;
    const result = await getMonthlyHistoryUseCaseInstance.execute();
    isLoadingHistory.value = false;

    if (result.right) {
      historyList.value = result.right;
    } else {
      console.error("❌ Gagal memuat riwayat bulanan:", result.left?.message);
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
    typeFilter,

    // Pocket State
    pocketsList,
    isLoadingPockets,
    errorPockets,

    // History State
    historyList,
    isLoadingHistory,

    // Getters
    salary,
    budgetCategories,
    totalRemaining,
    unallocatedBudget,
    currentPeriodMonth,
    hasData,
    chartDataCollection,
    expenseCategories,
    incomeCategories,
    totalIncome,
    totalSpent,
    momSpent,
    momIncome,
    momLimit,
    momRemaining,
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
    createCategory,
    submitTransaction,
    updateTransaction,
    fetchTransactions,
    deleteTransaction,
    setupBudget,

    // Pocket Actions
    fetchPockets,
    upsertPocket,
    deletePocket,
    bulkSetupPockets,
    updateKeywords,

    // History Actions
    fetchMonthlyHistory,
  };
});
