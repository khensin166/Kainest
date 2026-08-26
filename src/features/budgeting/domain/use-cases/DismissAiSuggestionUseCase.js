import { left, right, GeneralFailure } from "../../../../core/error/failure";

export class DismissAiSuggestionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(suggestionId) {
    if (!suggestionId) {
      return left(new GeneralFailure("ID Saran tidak valid."));
    }
    try {
      return await this.repository.dismissAiSuggestion(suggestionId);
    } catch (error) {
      return left(new GeneralFailure("Terjadi kesalahan saat mengabaikan saran AI."));
    }
  }
}
