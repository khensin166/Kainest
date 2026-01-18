export class GetNoteByIdUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(noteId) {
    return this.repository.getNoteById(noteId);
  }
}