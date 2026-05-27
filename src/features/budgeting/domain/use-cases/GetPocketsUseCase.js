export class GetPocketsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return await this.repository.getPockets();
  }
}
