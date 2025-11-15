export class DeleteNoteUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(noteId) {
    return this.repository.deleteNote(noteId);
  }
}