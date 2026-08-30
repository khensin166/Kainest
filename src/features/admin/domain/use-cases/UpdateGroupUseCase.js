export class UpdateGroupUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  execute(groupId, data) {
    return this.repository.updateGroup(groupId, data);
  }
}
