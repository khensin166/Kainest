export class GetNotesUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    return this.repository.getNotes();
  }
}