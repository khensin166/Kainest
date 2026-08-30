/**
 * Bentuk data milik aplikasi. Template tidak boleh menyentuh bentuk JSON API —
 * mapper yang mengubahnya lebih dulu.
 */

export class BillEntity {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name ?? "";
    this.amount = data.amount ?? 0;
    this.frequency = data.frequency ?? "MONTHLY";
    this.dueDay = data.dueDay ?? 1;
    this.dueMonth = data.dueMonth ?? null;
    this.startDate = data.startDate ?? null;
    this.note = data.note ?? "";
    this.status = data.status ?? "ACTIVE";
    this.reminderDaysBefore = data.reminderDaysBefore ?? 3;
    this.totalInstallments = data.totalInstallments ?? null;
    this.paidInstallments = data.paidInstallments ?? 0;

    // Diratakan agar template tidak menulis bill.category?.name
    this.categoryId = data.category?.id ?? data.categoryId ?? "";
    this.categoryName = data.category?.name ?? "";
    this.categoryIcon = data.category?.icon ?? "";

    this.dueDate = data.dueDate ?? null;
    this.daysUntilDue = data.daysUntilDue ?? null;
    this.cycleStatus = data.cycleStatus ?? "not_due";
    this.paidAmount = data.paidAmount ?? null;
  }

  get isInstallment() {
    return this.totalInstallments != null;
  }

  /** "4/12" untuk cicilan, null untuk tagihan berulang tanpa akhir. */
  get installmentLabel() {
    return this.isInstallment ? `${this.paidInstallments}/${this.totalInstallments}` : null;
  }

  get isSettled() {
    return this.cycleStatus === "paid" || this.cycleStatus === "skipped";
  }
}

export class SavingGoalEntity {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name ?? "";
    this.icon = data.icon ?? "";
    this.targetAmount = data.targetAmount ?? 0;
    this.monthlyAllocation = data.monthlyAllocation ?? 0;
    this.targetDate = data.targetDate ?? null;
    this.status = data.status ?? "ACTIVE";
    this.collectedAmount = data.collectedAmount ?? 0;
    this.remainingAmount = data.remainingAmount ?? 0;
    this.progressPercent = data.progressPercent ?? 0;
    this.monthsToFinish = data.monthsToFinish ?? null;
    this.estimatedFinish = data.estimatedFinish ?? null;
    this.behindTarget = data.behindTarget ?? false;
  }

  get isAchieved() {
    return this.status === "ACHIEVED";
  }
}

export class PlanHealthEntity {
  constructor(data = {}) {
    this.zone = data.zone ?? "SAFE";
    this.sisaKantong = data.sisaKantong ?? 0;
    this.belumDialokasikan = data.belumDialokasikan ?? 0;
    this.uangTersedia = data.uangTersedia ?? 0;
    this.tagihanBelumLunas = data.tagihanBelumLunas ?? 0;
    this.alokasiTabungan = data.alokasiTabunganBelumTersetor ?? 0;
    this.komitmenTersisa = data.komitmenTersisa ?? 0;
    this.sisaAman = data.sisaAman ?? 0;
    this.shortfall = data.shortfall ?? 0;
    this.cycleLabel = data.cycle?.label ?? "";
    this.openBills = data.openBills ?? [];
  }

  get isDanger() {
    return this.zone === "DANGER";
  }
  get isWarning() {
    return this.zone === "WARNING";
  }
}
