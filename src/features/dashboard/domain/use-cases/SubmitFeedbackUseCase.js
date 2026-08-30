export class SubmitFeedbackUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(payload) { return await this.repository.submitFeedback(payload); }
}
