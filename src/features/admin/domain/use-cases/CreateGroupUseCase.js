export class CreateGroupUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  execute(data) {
    return this.repository.createGroup(data);
  }
}
