export class GetPublicNoteUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(noteId) {
    return this.repository.getPublicNote(noteId);
  }
}