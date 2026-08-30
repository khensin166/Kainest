export class GetGroupsUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  execute() {
    return this.repository.getGroups();
  }
}
