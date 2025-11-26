export class BudgetSummaryEntity {
  constructor({ categoryId, categoryName, icon, limit, spent, remaining, percentageUsed, status, zone, aiAdvice }) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.icon = icon || '💰';
    this.limit = limit;
    this.spent = spent;
    this.remaining = remaining;
    this.percentageUsed = percentageUsed;
    // Status dari Bulanan (SAFE/WARNING/OVERBUDGET)
    this.status = status; 
    // Zone dari Harian (GREEN/YELLOW/RED) - Nanti diisi terpisah
    this.zone = zone || null; 
    // Saran AI - Nanti diisi terpisah
    this.aiAdvice = aiAdvice || null;
  }

  // Helper untuk menentukan warna berdasarkan status/zone
  get statusColor() {
    if (this.zone === 'RED' || this.status === 'OVERBUDGET') return 'text-red-500 bg-red-100';
    if (this.zone === 'YELLOW' || this.status === 'WARNING') return 'text-yellow-500 bg-yellow-100';
    return 'text-green-500 bg-green-100'; // Default Aman
  }
}