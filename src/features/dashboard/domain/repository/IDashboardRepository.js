// Kontrak repository Dashboard. Semua method mengembalikan Either:
// left(Failure) | right(data).
export class IDashboardRepository {
  getSystemUpdates() { throw new Error("Method not implemented."); }
  syncSystemUpdates() { throw new Error("Method not implemented."); }
  getFeedbacks() { throw new Error("Method not implemented."); }
  submitFeedback(data) { throw new Error("Method not implemented."); }
  hideFeedback(id) { throw new Error("Method not implemented."); }
}
