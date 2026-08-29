export class HideFeedbackUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return await this.repository.hideFeedback(id); }
}
