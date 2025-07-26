// 📦features/auth/domain/use-cases/GetProfileUseCase.js
export class GetProfileUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(token) {
    if (!token) {
      throw new Error("Token is required");
    }
    return this.repository.getProfile(token);
  }
}