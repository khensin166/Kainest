// usePlansStore.js — Rencana Keuangan: tagihan, cicilan, wishlist tabungan.
//
// Kontrak error: Either, bukan try/catch. Saat ini hanya useWaBotStore dan
// useGowaStore yang memakai try/catch mentah dan keduanya sudah terdaftar
// sebagai utang di KAINEST_ARCHITECTURE.md — jangan menambah yang ketiga.
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { notify } from "@/lib/notify";
import { plansUseCases } from "@/core/di/di";
import { mapFailureToMessage } from "@/core/error/map_failure_to_message";

export const usePlansStore = defineStore("plans", () => {
  const bills = ref([]);
  const cycle = ref(null);
  const goals = ref([]);
  const health = ref(null);
  const templates = ref([]);

  const isLoadingBills = ref(false);
  const isLoadingGoals = ref(false);
  const isLoadingHealth = ref(false);
  const isSubmitting = ref(false);
  const errorBills = ref(null);
  const errorGoals = ref(null);

  // --- Getters ---
  const openBills = computed(() =>
    bills.value.filter((b) => b.cycleStatus === "upcoming" || b.cycleStatus === "overdue")
  );
  const totalOpenBills = computed(() => openBills.value.reduce((t, b) => t + b.amount, 0));
  const activeGoals = computed(() => goals.value.filter((g) => g.status === "ACTIVE"));
  const totalMonthlyAllocation = computed(() =>
    activeGoals.value.reduce((t, g) => t + g.monthlyAllocation, 0)
  );
  const hasCommitments = computed(() => bills.value.length > 0 || goals.value.length > 0);

  /** Menjalankan aksi tulis, memberi tahu hasilnya, lalu menyegarkan data terkait. */
  async function jalankan(aksi, pesanSukses, segarkan = []) {
    isSubmitting.value = true;
    const result = await aksi();
    isSubmitting.value = false;

    if (result.right !== undefined && result.right !== null) {
      if (pesanSukses) notify.success(pesanSukses);
      await Promise.all(segarkan.map((f) => f()));
      return { success: true, data: result.right };
    }
    const pesan = mapFailureToMessage(result.left);
    notify.error(pesan, result.left);
    return { success: false, message: pesan, __handled: true };
  }

  // --- Tagihan ---
  async function fetchBills() {
    isLoadingBills.value = true;
    errorBills.value = null;
    const result = await plansUseCases.getBills.execute();
    isLoadingBills.value = false;

    if (result.right) {
      bills.value = result.right.bills;
      cycle.value = result.right.cycle;
    } else {
      errorBills.value = mapFailureToMessage(result.left);
    }
  }

  const createBill = (payload) =>
    jalankan(() => plansUseCases.createBill.execute(payload), "Tagihan tersimpan.", [
      fetchBills,
      fetchHealth,
    ]);

  const updateBill = (id, payload) =>
    jalankan(() => plansUseCases.updateBill.execute(id, payload), "Tagihan diperbarui.", [
      fetchBills,
      fetchHealth,
    ]);

  const deleteBill = (id) =>
    jalankan(() => plansUseCases.deleteBill.execute(id), "Tagihan dihapus.", [
      fetchBills,
      fetchHealth,
    ]);

  const payBill = (id, payload) =>
    jalankan(() => plansUseCases.payBill.execute(id, payload), "Tagihan ditandai lunas.", [
      fetchBills,
      fetchHealth,
    ]);

  const skipBill = (id) =>
    jalankan(() => plansUseCases.skipBill.execute(id), "Tagihan dilewati bulan ini.", [
      fetchBills,
      fetchHealth,
    ]);

  const cancelBillPayment = (id) =>
    jalankan(() => plansUseCases.cancelBillPayment.execute(id), "Penandaan dibatalkan.", [
      fetchBills,
      fetchHealth,
    ]);

  // --- Wishlist ---
  async function fetchGoals() {
    isLoadingGoals.value = true;
    errorGoals.value = null;
    const result = await plansUseCases.getGoals.execute();
    isLoadingGoals.value = false;

    if (result.right) goals.value = result.right;
    else errorGoals.value = mapFailureToMessage(result.left);
  }

  const createGoal = (payload) =>
    jalankan(() => plansUseCases.createGoal.execute(payload), "Wishlist dibuat.", [
      fetchGoals,
      fetchHealth,
    ]);

  const updateGoal = (id, payload) =>
    jalankan(() => plansUseCases.updateGoal.execute(id, payload), "Wishlist diperbarui.", [
      fetchGoals,
      fetchHealth,
    ]);

  const deleteGoal = (id) =>
    jalankan(() => plansUseCases.deleteGoal.execute(id), "Wishlist dihapus.", [
      fetchGoals,
      fetchHealth,
    ]);

  const updateGoalStatus = (id, status) =>
    jalankan(() => plansUseCases.updateGoalStatus.execute(id, status), "Status diperbarui.", [
      fetchGoals,
      fetchHealth,
    ]);

  const contribute = (id, payload) =>
    jalankan(
      () => plansUseCases.contribute.execute(id, payload),
      payload.amount < 0 ? "Penarikan tercatat." : "Setoran tercatat.",
      [fetchGoals, fetchHealth]
    );

  // --- Solvabilitas ---
  async function fetchHealth() {
    isLoadingHealth.value = true;
    const result = await plansUseCases.getHealth.execute();
    isLoadingHealth.value = false;
    if (result.right) health.value = result.right;
  }

  // --- Template kantong ---
  async function fetchTemplates() {
    const result = await plansUseCases.getTemplates.execute();
    if (result.right) templates.value = result.right;
  }

  const createTemplate = (name, pockets) =>
    jalankan(() => plansUseCases.createTemplate.execute({ name, pockets }), "Template tersimpan.", [
      fetchTemplates,
    ]);

  const deleteTemplate = (id) =>
    jalankan(() => plansUseCases.deleteTemplate.execute(id), "Template dihapus.", [fetchTemplates]);

  return {
    bills, cycle, goals, health, templates,
    isLoadingBills, isLoadingGoals, isLoadingHealth, isSubmitting,
    errorBills, errorGoals,
    openBills, totalOpenBills, activeGoals, totalMonthlyAllocation, hasCommitments,
    fetchBills, createBill, updateBill, deleteBill, payBill, skipBill, cancelBillPayment,
    fetchGoals, createGoal, updateGoal, deleteGoal, updateGoalStatus, contribute,
    fetchHealth,
    fetchTemplates, createTemplate, deleteTemplate,
  };
});
