export class GetProfileUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getProfile();
  }
}
