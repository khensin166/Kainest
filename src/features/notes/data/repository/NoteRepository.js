import { INoteRepository } from "../../domain/repository/INoteRepository";
import { NoteRemoteSource } from "../source/NoteRemoteSource";
import { mapNoteFromApi, mapNoteListFromApi } from "../mappers/NoteMapper";
import {
  left,
  right,
  ServerFailure,
} from "../../../../core/error/failure";

export class NoteRepository extends INoteRepository {
  constructor() {
    super();
    this.remoteSource = new NoteRemoteSource();
  }

  async getNotes() {
    try {
      const response = await this.remoteSource.getNotes();
      if (response.success) {
        const entities = mapNoteListFromApi(response.data);
        return right(entities);
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil notes."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async getNoteById(noteId) {
    try {
      const response = await this.remoteSource.getNoteById(noteId);
      if (response.success) {
        const entity = mapNoteFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil note."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async createNote(data) {
    try {
      const response = await this.remoteSource.createNote(data);
      if (response.success) {
        const entity = mapNoteFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal membuat note."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async updateNote(noteId, data) {
    try {
      const response = await this.remoteSource.updateNote(noteId, data);
      if (response.success) {
        const entity = mapNoteFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal update note."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async updateNotePermissions(noteId, data) {
    try {
      const response = await this.remoteSource.updateNotePermissions(noteId, data);
      if (response.success) {
        const entity = mapNoteFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal update izin."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async deleteNote(noteId) {
    try {
      const response = await this.remoteSource.deleteNote(noteId);
      if (response.success) {
        return right(true); // Sukses
      } else {
        return left(new ServerFailure(response.message || "Gagal menghapus note."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async getPublicNote(noteId) {
    try {
      const response = await this.remoteSource.getPublicNote(noteId);
      if (response.success) {
        const entity = mapNoteFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil note."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }
}