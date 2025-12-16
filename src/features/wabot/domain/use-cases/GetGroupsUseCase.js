// GetGroupsUseCase.js
export class GetGroupsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(baseUrl, apiKey) {
    return this.repository.getGroups(baseUrl, apiKey);
  }
}