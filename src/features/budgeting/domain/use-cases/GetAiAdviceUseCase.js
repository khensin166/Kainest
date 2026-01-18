import { left, right, GeneralFailure } from "../../../../core/error/failure";

export class GetAiAdviceUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(categoryId) {
    if (!categoryId) {
      return left(new GeneralFailure("Category ID diperlukan untuk meminta saran AI."));
    }
    try {
      return await this.repository.getAiAdvice(categoryId);
    } catch (error) {
      return left(new GeneralFailure("Terjadi kesalahan saat menghubungi AI Advisor."));
    }
  }
}