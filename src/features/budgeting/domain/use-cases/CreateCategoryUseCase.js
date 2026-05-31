export class CreateCategoryUseCase {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  /**
   * @param {string} name 
   * @param {string} icon 
   * @returns {Promise<Either<Failure, any>>}
   */
  async execute(name, icon) {
    return await this.budgetRepository.createCategory(name, icon);
  }
}
