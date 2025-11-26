// src/features/notes/data/mappers/NoteMapper.js
import { NoteEntity } from "../../domain/entities/NoteEntity";

/**
 * Memetakan respons API (dari GET /notes/:id atau GET /notes/public/:id)
 * @param {object} apiNote - Objek Note mentah dari API
 * @returns {NoteEntity}
 */
export function mapNoteFromApi(apiNote) {
  if (!apiNote) return null;

  return new NoteEntity({
    id: apiNote.id,
    title: apiNote.title,
    content: apiNote.content,
    isPublic: apiNote.is_public,
    partnerPermission: apiNote.partnerPermission,
    createdAt: apiNote.createdAt,
    updatedAt: apiNote.updatedAt,
    authorId: apiNote.authorId,
    coupleId: apiNote.coupleId,
    // Flatten data penulis jika ada (dari getPublicNote)
    authorName: apiNote.author?.profile?.displayName || apiNote.author?.name,
    authorAvatar: apiNote.author?.profile?.avatarUrl,
  });
}

/**
 * Memetakan respons API list (dari GET /notes)
 * @param {Array<object>} apiNoteList - Array note mentah dari API
 * @returns {Array<NoteEntity>}
 */
export function mapNoteListFromApi(apiNoteList) {
  if (!apiNoteList || !Array.isArray(apiNoteList)) return [];
  // Perhatikan: respons GET /notes adalah list sederhana,
  // jadi kita hanya memetakan apa adanya.
  return apiNoteList.map(note => new NoteEntity({
      id: note.id,
      title: note.title,
      updatedAt: note.updatedAt,
      isPublic: note.is_public,
      authorId: note.authorId
  }));
}