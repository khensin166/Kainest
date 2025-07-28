// LogoutUserUseCase
export class LogoutUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.logout();
  }
}
