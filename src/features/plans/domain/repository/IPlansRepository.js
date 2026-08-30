/**
 * Kontrak lapisan data untuk fitur Rencana Keuangan (dependency inversion).
 * Seluruh method mengembalikan Either: left(Failure) | right(data).
 */
export class IPlansRepository {
  getBills() { throw new Error("Not implemented"); }
  getUpcomingBills(_days) { throw new Error("Not implemented"); }
  createBill(_payload) { throw new Error("Not implemented"); }
  updateBill(_id, _payload) { throw new Error("Not implemented"); }
  deleteBill(_id) { throw new Error("Not implemented"); }
  payBill(_id, _payload) { throw new Error("Not implemented"); }
  skipBill(_id) { throw new Error("Not implemented"); }
  cancelBillPayment(_id) { throw new Error("Not implemented"); }
  getGoals() { throw new Error("Not implemented"); }
  createGoal(_payload) { throw new Error("Not implemented"); }
  updateGoal(_id, _payload) { throw new Error("Not implemented"); }
  deleteGoal(_id) { throw new Error("Not implemented"); }
  updateGoalStatus(_id, _status) { throw new Error("Not implemented"); }
  contribute(_id, _payload) { throw new Error("Not implemented"); }
  getContributions(_id) { throw new Error("Not implemented"); }
  getHealth() { throw new Error("Not implemented"); }
  getTemplates() { throw new Error("Not implemented"); }
  createTemplate(_payload) { throw new Error("Not implemented"); }
  deleteTemplate(_id) { throw new Error("Not implemented"); }
}
