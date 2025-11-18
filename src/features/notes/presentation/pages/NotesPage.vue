<!-- NotesPage -->
<template>
  <div class="p-4 md:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Catatan Anda</h1>
      <button @click="goToEditor" class="btn bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)]">
        Buat Note Baru
      </button>
    </div>

    <div v-if="noteStore.isLoadingList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="card bg-[var(--color-gray-50)] shadow-xl">
        <div class="card-body">
          <div class="skeleton h-8 w-3/4 mb-4"></div>
          <div class="skeleton h-4 w-1/2 mb-6"></div>
          <div class="card-actions justify-end">
            <div class="skeleton h-5 w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="noteStore.notesList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="note in noteStore.notesList" :key="note.id" @click="goToNote(note.id)"
        class="card bg-[var(--color-gray-50)] shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
        <div class="card-body">
          <h2 class="card-title">{{ note.title }}</h2>
          <p class="text-sm text-gray-500">
            Diperbarui: {{ formatRelativeTime(note.updatedAt) }}
          </p>
          <div class="card-actions justify-end mt-4">
            <span v-if="note.isPublic" class="badge badge-info">Publik</span>
            <span v-else-if="note.authorId !== authStore.user?.id" class="badge badge-warning">Dibagikan</span>
            <span v-else class="badge badge-outline">Pribadi</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div class="hero">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <PencilSquareIcon class="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Belum Ada Catatan</h1>
            <p class="py-6 text-gray-600 dark:text-gray-400">
              Mulai buat catatan pribadi atau catatan bersama pasangan Anda dengan mengeklik tombol di bawah.
            </p>
            <button @click="goToEditor" class="btn btn-primary text-white">
              Buat Note Pertama Anda
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNoteStore } from '../stores/useNoteStore';
import { useAuthStore } from '../../../auth/presentation/stores/authStore';
// Impor ikon untuk Hero Empty State
import { PencilSquareIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const noteStore = useNoteStore();
const authStore = useAuthStore();

// Ambil daftar notes saat halaman dimuat
onMounted(() => {
  // Hanya fetch jika list kosong untuk menghindari panggilan API berlebih
  if (noteStore.notesList.length === 0) {
    noteStore.fetchNotes();
  }
});

// Navigasi ke halaman editor untuk note baru
const goToEditor = () => {
  router.push('/app/notes/new');
};

// Navigasi ke halaman editor untuk note yang ada
const goToNote = (noteId) => {
  router.push(`/app/notes/${noteId}`);
};

// Helper untuk format waktu (bisa dipindah ke utils)
const formatRelativeTime = (date) => {
  // TODO: Ganti dengan library seperti 'date-fns' (formatRelative)
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>