import { defineStore } from "pinia";
import { ref, computed } from "vue";

// --- Dependencies Injection ---
import { GetDashboardSummaryUseCase } from "../../domain/use-case/GetDashboardSummaryUseCase";
import { GetAiAdviceUseCase } from "../../domain/use-case/GetAiAdviceUseCase";
import { CreateTransactionUseCase } from "../../domain/use-case/CreateTransactionUseCase";
import { GetCategoriesUseCase } from "../../domain/use-case/GetCategoriesUseCase";
import { BudgetRepository } from "../../data/repository/BudgetRepository";
import { GetSpendingTrendUseCase } from "../../domain/use-case/GetSpendingTrendUseCase";
import { GetTransactionsListUseCase } from "../../domain/use-case/GetTransactionsListUseCase";
import { GetTransactionDetailUseCase } from "../../domain/use-case/GetTransactionDetailUseCase";
import { UpdateTransactionUseCase } from "../../domain/use-case/UpdateTransactionUseCase";
import { DeleteTransactionUseCase } from "../../domain/use-case/DeleteTransactionUseCase";

4;

const budgetRepository = new BudgetRepository();
const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(
  budgetRepository
);
const getAiAdviceUseCase = new GetAiAdviceUseCase(budgetRepository);
const createTransactionUseCase = new CreateTransactionUseCase(budgetRepository);
const getCategoriesUseCase = new GetCategoriesUseCase(budgetRepository);
const getSpendingTrendUseCase = new GetSpendingTrendUseCase(budgetRepository);
const getTransactionsListUseCase = new GetTransactionsListUseCase(
  budgetRepository
);
const getTransactionDetailUseCase = new GetTransactionDetailUseCase(
  budgetRepository
);
const updateTransactionUseCase = new UpdateTransactionUseCase(budgetRepository);
const deleteTransactionUseCase = new DeleteTransactionUseCase(budgetRepository);

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
  // Menyimpan ID transaksi yang sedang dihapus agar bisa menampilkan spinner di tombol spesifik
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
  // Chart.js butuh object terpisah untuk labels (sumbu X) dan data (sumbu Y)
  const chartDataCollection = computed(() => {
    if (trendDataList.value.length === 0) return null;

    return {
      // Labels sumbu X (misal: ["1", "2", "3", ...])
      labels: trendDataList.value.map((item) => item.labelDay),
      datasets: [
        {
          label: "Realisasi Pengeluaran",
          // Data sumbu Y (misal: [0, 50000, 0, ...])
          data: trendDataList.value.map((item) => item.amount),
          // Config warna chart (bisa dipindah ke komponen UI nanti)
          borderColor: "#10B981", // Tailwind green-500
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.3, // Garis agak melengkung
          fill: true,
        },
        // Nanti bisa ditambahkan dataset kedua untuk "Limit Harian" jika mau
      ],
    };
  });

  // --- BARU: GETTER UNTUK PAGINATION ---
  const currentPage = computed(() => transactionsMeta.value?.currentPage || 1);
  const totalPages = computed(() => transactionsMeta.value?.totalPages || 1);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPreviousPage = computed(() => currentPage.value > 1);
  // =========================================
  // ⚡ ACTIONS (DIPERBAIKI DISINI)
  // =========================================

  async function fetchDashboardSummary() {
    console.log(
      "⚡ [STORE ACTION] fetchDashboardSummary dipanggil (Support Failure Lama)!"
    );
    isLoadingSummary.value = true;
    errorSummary.value = null;

    // 1. Panggil Use Case
    const result = await getDashboardSummaryUseCase.execute();

    // console.log("🔍 Debug Result dari UseCase:", result); // Uncomment kalau mau liat bentuk objeknya

    // 2. Cek Hasil (PERBAIKAN: Cek properti 'right' secara langsung)
    // Jika result.right ada isinya (tidak null), berarti sukses.
    if (result.right) {
      // Sukses: Ambil datanya dari properti .right
      summaryData.value = result.right;
      console.log("✅ Data berhasil dimuat ke Store:", summaryData.value);
    } else {
      // Gagal: Ambil pesan error dari properti .left.message
      // Kita pakai optional chaining (?.) jaga-jaga kalau result.left entah kenapa null
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

    const result = await getAiAdviceUseCase.execute(categoryId);

    // (PERBAIKAN: Cek properti 'right')
    if (result.right) {
      const adviceData = result.right; // Ambil data dari .right
      const targetCategory = summaryData.value.categories[categoryIndex];
      targetCategory.zone = adviceData.zone;
      targetCategory.aiAdvice = adviceData.advice;
    } else {
      // Ambil error dari .left
      console.error("Gagal mengambil saran AI:", result.left?.message);
    }
  }

  async function submitTransaction(transactionData) {
    isTransactionSubmitting.value = true;
    const result = await createTransactionUseCase.execute(transactionData);
    isTransactionSubmitting.value = false;

    // (PERBAIKAN: Cek properti 'right')
    if (result.right) {
      await fetchDashboardSummary();
      return { success: true };
    } else {
      // Ambil error dari .left
      return { success: false, message: result.left?.message };
    }
  }
  /**
   * ACTION BARU: Mengambil daftar semua kategori untuk dropdown form
   * Biasanya dipanggil saat modal transaksi dibuka
   */
  async function fetchAllCategories() {
    // Jika data sudah ada, tidak perlu fetch ulang (caching sederhana)
    if (categoriesList.value.length > 0) return;

    console.log("⚡ [STORE ACTION] fetchAllCategories dipanggil!");
    isLoadingCategories.value = true;

    const result = await getCategoriesUseCase.execute();

    // Cek hasil (menggunakan properti .right sesuai struktur failure.js kamu)
    if (result.right) {
      categoriesList.value = result.right; // Simpan array entity
      console.log(
        "✅ Kategori berhasil dimuat:",
        categoriesList.value.length,
        "item"
      );
    } else {
      console.error("❌ Gagal memuat kategori:", result.left?.message);
      // Opsional: Bisa set error state khusus jika perlu ditampilkan di UI dropdown
    }

    isLoadingCategories.value = false;
  }

  /**
   * ACTION BARU: Mengambil data tren harian untuk grafik
   * Dipanggil bersamaan dengan fetchDashboardSummary di onMounted
   */
  async function fetchSpendingTrend() {
    console.log("⚡ [STORE ACTION] fetchSpendingTrend dipanggil!");
    isLoadingTrend.value = true;

    const result = await getSpendingTrendUseCase.execute();

    if (result.right) {
      trendDataList.value = result.right; // Simpan data entity penuh
      console.log(`✅ Data grafik dimuat: ${trendDataList.value.length} hari`);
    } else {
      console.error("❌ Gagal memuat data grafik:", result.left?.message);
      // Opsional: set error state khusus grafik
    }

    isLoadingTrend.value = false;
  }

  /**
   * CREATE: Membuat transaksi baru (Existing)
   */
  async function submitTransaction(transactionData) {
    isTransactionSubmitting.value = true;
    const result = await createTransactionUseCase.execute(transactionData);
    isTransactionSubmitting.value = false;

    if (result.right) {
      // Refresh dashboard dan list transaksi (jika sedang dibuka) agar data sinkron
      await fetchDashboardSummary();
      // Kita tidak await ini agar UI lebih responsif, biarkan refresh di background
      fetchTransactions({ page: 1 });
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  /**
   * BARU: READ LIST - Mengambil daftar riwayat transaksi dengan filter
   * @param {object} params - { page, limit, startDate, endDate }
   */
  async function fetchTransactions(params = {}) {
    console.log("⚡ [STORE ACTION] fetchTransactions dipanggil:", params);
    isLoadingTransactions.value = true;

    // Set default params jika tidak ada
    const finalParams = { page: 1, limit: 10, ...params };

    const result = await getTransactionsListUseCase.execute(finalParams);

    if (result.right) {
      // Simpan data list dan metadata pagination
      transactionsList.value = result.right.transactions;
      transactionsMeta.value = result.right.meta;
      console.log(
        `✅ List transaksi dimuat: ${transactionsList.value.length} item (Page ${transactionsMeta.value.currentPage}/${transactionsMeta.value.totalPages})`
      );
    } else {
      console.error("❌ Gagal memuat list transaksi:", result.left?.message);
      // Opsional: set error state khusus list
    }
    isLoadingTransactions.value = false;
  }

  /**
   * BARU: READ DETAIL - Mengambil satu data untuk pre-fill form edit
   * @param {string} id
   * @returns {TransactionEntity | null}
   */
  async function fetchTransactionById(id) {
    isLoadingTransactions.value = true; // Gunakan loading global atau buat khusus
    const result = await getTransactionDetailUseCase.execute(id);
    isLoadingTransactions.value = false;

    if (result.right) {
      return result.right; // Kembalikan entity langsung ke komponen pemanggil
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
   * @param {string} id
   * @param {object} updateData
   */
  async function updateTransaction(id, updateData) {
    isTransactionSubmitting.value = true; // Re-use state loading form
    const result = await updateTransactionUseCase.execute(id, updateData);
    isTransactionSubmitting.value = false;

    if (result.right) {
      // Refresh data agar UI sinkron
      await fetchDashboardSummary(); // Update sisa uang di dashboard
      // Refresh halaman list saat ini agar data yang diedit berubah
      if (transactionsMeta.value?.currentPage) {
        fetchTransactions({ page: transactionsMeta.value.currentPage });
      }
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  /**
   * BARU: DELETE - Menghapus transaksi
   * @param {string} id
   */
  async function deleteTransaction(id) {
    // Set ID yang sedang dihapus untuk loading spinner spesifik
    isDeletingTransactionId.value = id;

    const result = await deleteTransactionUseCase.execute(id);

    isDeletingTransactionId.value = null; // Reset loading

    if (result.right) {
      // Refresh data
      await fetchDashboardSummary(); // Update sisa uang
      // Refresh halaman list (kembali ke page 1 jaga-jaga jika item terakhir di page tersebut dihapus)
      fetchTransactions({ page: 1 });
      return { success: true };
    } else {
      return { success: false, message: result.left?.message };
    }
  }

  return {
    summaryData,
    isLoadingSummary,
    errorSummary,
    trendDataList,
    isLoadingTrend,
    categoriesList,
    transactionsList,
    transactionsMeta,
    isLoadingTransactions,
    isDeletingTransactionId,
    isLoadingCategories,
    isTransactionSubmitting,
    budgetCategories,
    totalRemaining,
    currentPeriodMonth,
    hasData,
    transactionsList,
    transactionsMeta,
    isLoadingTransactions,
    isDeletingTransactionId,
    fetchDashboardSummary,
    chartDataCollection,
    expenseCategories,
    fetchAiAdviceForCategory,
    submitTransaction,
    fetchSpendingTrend,
    fetchAllCategories,
    fetchTransactions,
    fetchTransactionById,
    updateTransaction,
    deleteTransaction,
  };
});
