export class UpdateNoteUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(noteId, data) {
    return this.repository.updateNote(noteId, data);
  }
}