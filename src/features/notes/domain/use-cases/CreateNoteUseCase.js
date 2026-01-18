// src/features/notes/domain/use-case/CreateNoteUseCase.js
import { left, GeneralFailure } from "../../../../core/error/failure";

export class CreateNoteUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    if (!data.title) {
      return left(new GeneralFailure("Judul tidak boleh kosong."));
    }
    return this.repository.createNote(data);
  }
}