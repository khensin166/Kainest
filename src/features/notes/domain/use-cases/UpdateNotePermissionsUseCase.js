export class UpdateNotePermissionsUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(noteId, data) {
    return this.repository.updateNotePermissions(noteId, data);
  }
}