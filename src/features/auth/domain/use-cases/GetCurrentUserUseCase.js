// GetUserUseCase
export class GetCurrentUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getCurrentUser();
  }
}