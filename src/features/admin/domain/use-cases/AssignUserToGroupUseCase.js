export class AssignUserToGroupUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  execute(userId, groupId) {
    return this.repository.assignUserToGroup(userId, groupId);
  }
}
