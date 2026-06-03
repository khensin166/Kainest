export class GetUsersUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getUsers();
  }
}
