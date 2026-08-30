export class DeleteGroupUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  execute(groupId) {
    return this.repository.deleteGroup(groupId);
  }
}
