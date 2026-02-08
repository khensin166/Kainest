export class SetupBudgetUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(data) {
    return await this.repository.setupBudget(data);
  }
}
