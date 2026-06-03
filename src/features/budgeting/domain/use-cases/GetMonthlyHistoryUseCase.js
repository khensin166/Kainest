export class GetMonthlyHistoryUseCase {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  /**
   * @returns {Promise<Either<Failure, Array>>}
   */
  async execute() {
    return await this.budgetRepository.getMonthlyHistory();
  }
}
