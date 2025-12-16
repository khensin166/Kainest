// SendMessageUseCase.js
export class SendMessageUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(baseUrl, apiKey, payload) {
    // payload = { phone, message, isGroup }
    return this.repository.sendMessage(baseUrl, apiKey, payload);
  }
}