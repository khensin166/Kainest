// src/features/notes/presentation/stores/useNoteStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { 
  getNotesUseCase, 
  getNoteByIdUseCase, 
  createNoteUseCase, 
  updateNoteUseCase, 
  updateNotePermissionsUseCase, 
  deleteNoteUseCase, 
  getPublicNoteUseCase 
} from "../../../../core/di/di";
import { useModalStore } from "../../../../stores/modalStore";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";

export const useNoteStore = defineStore("note", () => {
  // === STATE ===
  const notesList = ref([]); // Daftar note (untuk halaman list)
  const currentNote = ref(null); // Note yang sedang dibuka/diedit
  const isLoadingList = ref(false); // Loading untuk list
  const isLoadingNote = ref(false); // Loading untuk satu note

  // === DEPENDENCIES ===
  const modalStore = useModalStore();
  
  // === USE CASES (Injected) ===
  const getNotesUseCaseInstance = getNotesUseCase;
  const getNoteByIdUseCaseInstance = getNoteByIdUseCase;
  const createNoteUseCaseInstance = createNoteUseCase;
  const updateNoteUseCaseInstance = updateNoteUseCase;
  const updateNotePermissionsUseCaseInstance = updateNotePermissionsUseCase;
  const deleteNoteUseCaseInstance = deleteNoteUseCase;
  const getPublicNoteUseCaseInstance = getPublicNoteUseCase;

  // === ACTIONS ===

  /**
   * Mengambil daftar semua note (private + shared)
   */
  async function fetchNotes() {
    isLoadingList.value = true;
    const result = await getNotesUseCaseInstance.execute();
    isLoadingList.value = false;

    if (result.right) {
      notesList.value = result.right; // result.right adalah NoteEntity[]
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    }
  }

  /**
   * Mengambil satu note lengkap untuk diedit
   */
  async function fetchNoteById(noteId) {
    isLoadingNote.value = true;
    currentNote.value = null; // Kosongkan dulu
    const result = await getNoteByIdUseCaseInstance.execute(noteId);
    isLoadingNote.value = false;

    if (result.right) {
      currentNote.value = result.right; // result.right adalah NoteEntity
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw new Error(mapFailureToMessage(result.left)); // Lempar error agar page bisa redirect
    }
  }

  /**
   * Membuat note baru
   */
  async function createNewNote(data) {
    isLoadingNote.value = true;
    const result = await createNoteUseCaseInstance.execute(data);
    isLoadingNote.value = false;

    if (result.right) {
      currentNote.value = result.right; // Simpan note baru
      // Tambahkan ke list (opsional, atau panggil fetchNotes() lagi)
      notesList.value.unshift(result.right);
      return result.right; // Kembalikan note baru
    } else {
      modalStore.openModal({
        newTitle: "Gagal Membuat Note",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw new Error(mapFailureToMessage(result.left));
    }
  }

  /**
   * Mengupdate konten note (title, content)
   */
  async function updateNoteContent(noteId, data) {
    isLoadingNote.value = true;
    const result = await updateNoteUseCaseInstance.execute(noteId, data);
    isLoadingNote.value = false;

    if (result.right) {
      currentNote.value = result.right;
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Note disimpan.",
        newStatus: "success",
      });
    } else {
      modalStore.openModal({
        newTitle: "Gagal Menyimpan",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw new Error(mapFailureToMessage(result.left));
    }
  }

  /**
   * Mengupdate izin note
   */
  async function updateNotePerms(noteId, data) {
    isLoadingNote.value = true;
    const result = await updateNotePermissionsUseCaseInstance.execute(noteId, data);
    isLoadingNote.value = false;

    if (result.right) {
      currentNote.value = result.right;
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Pengaturan berhasil disimpan.",
        newStatus: "success",
      });
    } else {
      modalStore.openModal({
        newTitle: "Gagal",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw new Error(mapFailureToMessage(result.left));
    }
  }

  /**
   * Menghapus note
   */
  async function deleteNote(noteId) {
    isLoadingNote.value = true;
    const result = await deleteNoteUseCaseInstance.execute(noteId);
    isLoadingNote.value = false;

    if (result.right) {
      // Hapus dari list state
      notesList.value = notesList.value.filter((n) => n.id !== noteId);
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Note telah dihapus.",
        newStatus: "success",
      });
    } else {
      modalStore.openModal({
        newTitle: "Gagal Menghapus",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw new Error(mapFailureToMessage(result.left));
    }
  }

  // --- Untuk Halaman Publik ---
  const publicNote = ref(null);

  async function fetchPublicNote(noteId) {
    isLoadingNote.value = true;
    publicNote.value = null;
    const result = await getPublicNoteUseCaseInstance.execute(noteId);
    isLoadingNote.value = false;

    if (result.right) {
      publicNote.value = result.right;
    } else {
      // Jangan tampilkan modal, cukup lempar error
      throw new Error(mapFailureToMessage(result.left));
    }
  }

  // --- RETURN ---
  return {
    notesList,
    currentNote,
    isLoadingList,
    isLoadingNote,
    fetchNotes,
    fetchNoteById,
    createNewNote,
    updateNoteContent,
    updateNotePerms,
    deleteNote,
    // Publik
    publicNote,
    fetchPublicNote,
  };
});
