// src/features/budgeting/domain/use-case/GetDashboardSummaryUseCase.js
export class GetDashboardSummaryUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    // Cukup panggil dan return langsung.
    // Repository sudah menjamin return-nya adalah Either (Right/Left)
    return await this.repository.getMonthlySummary();
  }
}
