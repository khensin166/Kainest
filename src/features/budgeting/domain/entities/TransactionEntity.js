export class TransactionEntity {
  constructor({ id, amount, note, date, categoryName, categoryIcon, categoryId, type }) {
    this.id = id;
    this.amount = amount;
    this.note = note || "-";
    this.type = type || "EXPENSE"; // 'INCOME' | 'EXPENSE'
    this.categoryId = categoryId;
    this.date = date ? new Date(date) : new Date();
    this.categoryName = categoryName || "Unknown";
    this.categoryIcon = categoryIcon || "💸";
  }

  // Helper untuk format tanggal (Opsional, bisa juga pakai library kayak date-fns di UI)
  get formattedDate() {
    return this.date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }

  // Helper untuk format mata uang
  get formattedAmount() {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(this.amount);
  }
}
