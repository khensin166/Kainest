// RegisterBotUseCase.js
export class RegisterBotUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(baseUrl, appName, adminSecret) {
    // Logika bisnis: Validasi input dasar
    if (!baseUrl || !adminSecret) {
      throw new Error("Base URL dan Admin Secret wajib diisi");
    }
    return this.repository.generateKey(baseUrl, appName, adminSecret);
  }
}