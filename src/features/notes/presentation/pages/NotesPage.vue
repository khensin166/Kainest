<!-- NotesPage -->
<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Catatan Anda</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Kelola catatan pribadi dan bersama</p>
      </div>
      <button @click="goToEditor" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
               bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors">
        <span class="mr-2">+</span> Buat Note Baru
      </button>
    </div>

    <!-- SKELETON LOADING -->
    <div v-if="noteStore.isLoadingList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div class="flex justify-end">
             <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <!-- NOTES LIST -->
    <div v-else-if="noteStore.notesList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="note in noteStore.notesList" :key="note.id" @click="goToNote(note.id)"
        class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 
               shadow-sm hover:shadow-lg dark:shadow-none dark:hover:border-gray-500 
               transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[180px]">
        
        <div>
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                    {{ note.title || 'Tanpa Judul' }}
                </h2>
                <!-- Optional: Icon or menu -->
            </div>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Diperbarui: {{ formatRelativeTime(note.updatedAt) }}
            </p>
        </div>

        <div class="flex justify-between items-center mt-4">
             <!-- Badges with standard Tailwind -->
            <span v-if="note.isPublic" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Publik
            </span>
            <span v-else-if="note.authorId !== authStore.user?.id" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Dibagikan
            </span>
            <span v-else 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Pribadi
            </span>
            
            <!-- Arrow icon for better UX -->
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="text-center py-20 bg-white dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
      <div class="max-w-md mx-auto">
        <PencilSquareIcon class="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Belum Ada Catatan</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          Mulai buat catatan pribadi atau catatan bersama pasangan Anda.
        </p>
        <button @click="goToEditor" 
             class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 transition-colors">
          Buat Note Pertama Anda
        </button>
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