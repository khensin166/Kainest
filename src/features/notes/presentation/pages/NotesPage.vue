<!-- NotesPage -->
<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-text-primary">Catatan Anda</h1>
            <PageGuide :steps="pageGuides.notes" />
        </div>
            <p class="text-text-muted mt-1">Kelola catatan pribadi dan bersama</p>
      </div>
      <button @click="goToEditor" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-none text-sm font-medium text-text-inverse 
               bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
        <span class="mr-2">+</span> Buat Note Baru
      </button>
    </div>

    <!-- SKELETON LOADING -->
    <div v-if="noteStore.isLoadingList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-surface-card rounded-xl shadow-none border border-border-default p-6 animate-pulse">
        <div class="h-6 bg-surface-subtle rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-surface-subtle rounded w-1/2 mb-6"></div>
        <div class="flex justify-end">
             <div class="h-5 w-16 bg-surface-subtle rounded"></div>
        </div>
      </div>
    </div>

    <!-- NOTES LIST -->
    <div v-else-if="noteStore.notesList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="note in noteStore.notesList" :key="note.id" @click="goToNote(note.id)"
        class="group bg-surface-card rounded-xl border border-border-default p-6 
               shadow-none hover:border-border-strong 
               transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[180px]">
        
        <div>
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-2">
                    {{ note.title || 'Tanpa Judul' }}
                </h2>
                <!-- Optional: Icon or menu -->
            </div>
            
            <p class="text-sm text-text-muted mb-4">
                Diperbarui: {{ formatRelativeTime(note.updatedAt) }}
            </p>
        </div>

        <div class="flex justify-between items-center mt-4">
             <!-- Badges with standard Tailwind -->
            <span v-if="note.isPublic" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/20 text-brand-primary">
                Publik
            </span>
            <span v-else-if="note.authorId !== authStore.user?.id" 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-warning-bg text-status-warning">
                Dibagikan
            </span>
            <span v-else 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-subtle text-text-primary">
                Pribadi
            </span>
            
            <!-- Arrow icon for better UX -->
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-muted group-hover:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <BaseEmptyState 
      v-else 
      icon="📒"
      title="Belum Ada Catatan"
      message="Mulai buat catatan pribadi atau catatan bersama pasangan Anda."
      heightClass="py-20"
    >
      <button @click="goToEditor" 
           class="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-none text-text-inverse bg-brand-primary hover:bg-brand-primary-hover transition-colors">
        Buat Note Pertama Anda
      </button>
    </BaseEmptyState>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNoteStore } from '../stores/useNoteStore';
import { useAuthStore } from '../../../auth/presentation/stores/authStore';
// Impor ikon untuk Hero Empty State
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import BaseEmptyState from '@/components/BaseEmptyState.vue';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';

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