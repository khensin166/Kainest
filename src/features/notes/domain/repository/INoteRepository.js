export class INoteRepository {
  /**
   * Mengambil daftar semua notes (pribadi + shared)
   * @returns {Promise<Either<Failure, NoteEntity[]>>}
   */
  async getNotes() {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengambil satu note lengkap dengan kontennya
   * @param {string} noteId
   * @returns {Promise<Either<Failure, NoteEntity>>}
   */
  async getNoteById(noteId) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Membuat note baru
   * @param {object} data - { title, content, shareWithPartner, partnerPermission }
   * @returns {Promise<Either<Failure, NoteEntity>>}
   */
  async createNote(data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengupdate konten note (title, content)
   * @param {string} noteId
   * @param {object} data - { title, content }
   * @returns {Promise<Either<Failure, NoteEntity>>}
   */
  async updateNote(noteId, data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengupdate izin note (isPublic, partnerPermission)
   * @param {string} noteId
   * @param {object} data - { is_public, shareWithPartner, partnerPermission }
   * @returns {Promise<Either<Failure, NoteEntity>>}
   */
  async updateNotePermissions(noteId, data) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Menghapus note
   * @param {string} noteId
   * @returns {Promise<Either<Failure, boolean>>}
   */
  async deleteNote(noteId) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mengambil note publik (read-only)
   * @param {string} noteId
   * @returns {Promise<Either<Failure, NoteEntity>>}
   */
  async getPublicNote(noteId) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}