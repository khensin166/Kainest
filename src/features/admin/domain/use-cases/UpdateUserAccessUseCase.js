export class UpdateUserAccessUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(userId, data) {
    return this.repository.updateUserAccess(userId, data);
  }
}
