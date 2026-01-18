export class GetCoupleStatusUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    return this.repository.getCoupleStatus();
  }
}