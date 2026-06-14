export class UpdatePocketKeywordsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(categoryId, keywords) {
    return await this.repository.updatePocketKeywords(categoryId, keywords);
  }
}
