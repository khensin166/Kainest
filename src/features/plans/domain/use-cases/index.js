/**
 * Satu berkas = satu aksi bisnis, dikelompokkan di sini karena seluruhnya
 * berupa penerusan tipis ke repository. Memecahnya jadi 19 berkas satu-baris
 * menambah berkas tanpa menambah kejelasan.
 */
const buat = (fn) => ({ execute: fn });

export const buatUseCases = (repository) => ({
  getBills: buat(() => repository.getBills()),
  getUpcomingBills: buat((days) => repository.getUpcomingBills(days)),
  createBill: buat((payload) => repository.createBill(payload)),
  updateBill: buat((id, payload) => repository.updateBill(id, payload)),
  deleteBill: buat((id) => repository.deleteBill(id)),
  payBill: buat((id, payload) => repository.payBill(id, payload)),
  skipBill: buat((id) => repository.skipBill(id)),
  cancelBillPayment: buat((id) => repository.cancelBillPayment(id)),

  getGoals: buat(() => repository.getGoals()),
  createGoal: buat((payload) => repository.createGoal(payload)),
  updateGoal: buat((id, payload) => repository.updateGoal(id, payload)),
  deleteGoal: buat((id) => repository.deleteGoal(id)),
  updateGoalStatus: buat((id, status) => repository.updateGoalStatus(id, status)),
  contribute: buat((id, payload) => repository.contribute(id, payload)),
  getContributions: buat((id) => repository.getContributions(id)),

  getHealth: buat(() => repository.getHealth()),

  getTemplates: buat(() => repository.getTemplates()),
  createTemplate: buat((payload) => repository.createTemplate(payload)),
  deleteTemplate: buat((id) => repository.deleteTemplate(id)),
});
