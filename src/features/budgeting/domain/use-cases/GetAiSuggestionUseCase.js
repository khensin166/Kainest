import { left, right, GeneralFailure } from "../../../../core/error/failure";

export class GetAiSuggestionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    try {
      return await this.repository.getAiSuggestion();
    } catch (error) {
      return left(new GeneralFailure("Terjadi kesalahan saat memuat saran AI."));
    }
  }
}
