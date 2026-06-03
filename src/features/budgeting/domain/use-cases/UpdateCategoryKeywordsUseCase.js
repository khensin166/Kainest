export class UpdateCategoryKeywordsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(categoryId, keywords) {
    return await this.repository.updateCategoryKeywords(categoryId, keywords);
  }
}
