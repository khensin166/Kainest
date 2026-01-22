<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">

    <div v-if="noteStore.isLoadingNote" class="text-center py-20">
      <p class="text-gray-600 dark:text-gray-400">Memuat catatan...</p>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <h1 class="text-3xl font-bold text-red-600 mb-4">Catatan Tidak Ditemukan</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error }}
      </p>
      <router-link to="/" class="btn btn-primary bg-violet-600 text-white">
        Kembali ke Beranda
      </router-link>
    </div>

    <article v-else-if="note"
      class="bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-3xl mx-auto p-6 md:p-10 transition-colors duration-300">
      <header class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <div class="flex justify-between items-start mb-3">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {{ note.title }}
          </h1>

          <!-- Dark Mode Toggle -->
          <button @click="toggleDark()"
            class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Toggle Theme">
            <component :is="isDark ? Sun : Moon" class="w-5 h-5" />
          </button>
        </div>

        <div v-if="note.authorName" class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
          <img :src="note.authorAvatar || defaultAvatar" class="w-8 h-8 rounded-full object-cover"
            alt="Author Avatar" />
          <span>Ditulis oleh <strong>{{ note.authorName }}</strong></span>
        </div>
      </header>

      <NoteRenderer :content="note.content" />

    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core'; // VueUse
import { Sun, Moon } from 'lucide-vue-next'; // Icons
import { useNoteStore } from '../stores/useNoteStore';
import NoteRenderer from '../components/NoteRenderer.vue'; // Impor renderer
import defaultAvatar from '@/images/user-avatar-32.png'; // Impor avatar default

const route = useRoute();
const router = useRouter();
const noteStore = useNoteStore();

// --- Dark Mode Logic ---
const isDark = useDark();
const toggleDark = useToggle(isDark);

const note = ref(null);
const error = ref(null); // State untuk pesan error

onMounted(async () => {
  const noteId = route.params.id;
  if (!noteId) {
    error.value = "ID Catatan tidak valid.";
    return;
  }

  try {
    // Panggil aksi untuk note publik (tidak perlu login)
    await noteStore.fetchPublicNote(noteId);
    note.value = noteStore.publicNote;
  } catch (e) {
    // Tangkap error jika note tidak ditemukan atau tidak publik
    console.error(e.message);
    error.value = "Note ini mungkin tidak ada, atau tidak lagi dibagikan secara publik.";
  }
});
</script>