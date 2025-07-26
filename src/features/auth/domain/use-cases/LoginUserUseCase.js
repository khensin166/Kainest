// 📦features/auth/domain/use-cases/LoginUserUseCase.js
export class LoginUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new Error("Email dan password tidak boleh kosong");
    }
    return this.repository.login(email, password);
  }
}