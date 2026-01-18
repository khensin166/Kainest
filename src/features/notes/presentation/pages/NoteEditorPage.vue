<!-- NoteEditorPage.vue -->
<template>
    <div class="p-4 md:p-8 max-w-5xl mx-auto">
        <div v-if="noteStore.isLoadingNote" class="text-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Memuat editor...</p>
        </div>

        <div v-else>
            <!-- Title Input: Plain Tailwind -->
            <input type="text" v-model="title" placeholder="Judul Catatan..."
                class="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-400 text-gray-800 dark:text-gray-100 mb-6 p-0" />

            <!-- Editor Container -->
            <div id="editorjs-container" 
                class="min-h-[500px] w-full
                       bg-gray-50 dark:bg-gray-900 
                       rounded-xl border border-gray-200 dark:border-gray-700/60 
                       pt-6 px-4 md:px-6 shadow-sm">
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex justify-between items-end sticky bottom-6 z-10">
                <div class="flex gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <button @click="onSave" :disabled="noteStore.isLoadingNote"
                        class="px-6 py-2.5 rounded-lg font-medium text-white transition-all
                               bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ noteStore.isLoadingNote ? 'Menyimpan...' : 'Simpan Note' }}
                    </button>
                    
                    <button @click="openShareModal" 
                        class="px-5 py-2.5 rounded-lg font-medium transition-colors
                               text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                        Bagikan
                    </button>
                </div>

                <button v-if="isEditing" @click="onDelete" 
                    class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    Hapus
                </button>
            </div>
        </div>

        <ShareNoteModal v-model="isShareModalOpen" :note="noteStore.currentNote" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoteStore } from '../stores/useNoteStore';
// --- 1. IMPOR SEMUA TOOLS EDITOR.JS ---
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
// Impor uploader kustom yang baru kita buat
// import { customUploader } from '../editor/uploader.js';
import { customUploader } from '../pages/editor/uploader.js';
import ShareNoteModal from '../components/ShareNoteModal.vue';

const route = useRoute();
const router = useRouter();
const noteStore = useNoteStore();

const editorInstance = ref(null);
const title = ref('');
// Fix logic isEditing
const isEditing = computed(() => !!route.params.id && route.params.id !== 'new');
const isShareModalOpen = ref(false);

const openShareModal = () => {
    // Pastikan note sudah disimpan sebelum dibagikan
    if (!noteStore.currentNote) {
        alert("Silakan simpan note terlebih dahulu sebelum membagikan.");
        return;
    }
    isShareModalOpen.value = true;
};
const closeShareModal = () => isShareModalOpen.value = false;

// Inisialisasi Editor.js
onMounted(async () => {
    const noteId = route.params.id;
    let initialData = {}; 

    if (isEditing.value) {
        try {
            await noteStore.fetchNoteById(noteId);
            // Safety check
            if (!noteStore.currentNote) throw new Error("Note not found");
            
            title.value = noteStore.currentNote.title;
            initialData = noteStore.currentNote.content; 
        } catch (error) {
            console.error("Error loading note:", error);
            router.push('/app/notes'); 
            return;
        }
    } else {
        noteStore.currentNote = null; 
        title.value = '';
    }

    // --- 2. KONFIGURASI INSTANCE EDITOR.JS ---
    const editor = new EditorJS({
        holder: 'editorjs-container',
        data: initialData,
        placeholder: 'Mulai tulis catatan Anda...',
        
        tools: {
            header: {
                class: Header,
                inlineToolbar: true,
                config: {
                    placeholder: 'Heading',
                    levels: [1, 2, 3], // Allow H1, H2, H3
                    defaultLevel: 2
                }
            },
            list: {
                class: List,
                inlineToolbar: true,
            },
            image: { 
                class: ImageTool,
                config: {
                    uploader: {
                        uploadByFile(file) {
                            return customUploader(file);
                        },
                    }
                }
            }
        },
        // Callback ketika editor siap
        onReady: () => {
             editorInstance.value = editor;
        },
    });
});

// Hancurkan instance editor saat keluar
onUnmounted(() => {
    // EditorJS destroy bersifat async atau perlu cek existency
    if (editorInstance.value && typeof editorInstance.value.destroy === 'function') {
        try {
            editorInstance.value.destroy();
        } catch (e) {
            console.warn("EditorJS destroy warning:", e);
        }
    }
    editorInstance.value = null;
});

// Fungsi untuk menyimpan
const onSave = async () => {
    if (!editorInstance.value) return;

    try {
        const outputData = await editorInstance.value.save();

        if (isEditing.value) {
            // --- UPDATE NOTE YANG ADA ---
             if (!noteStore.currentNote || !noteStore.currentNote.id) {
                console.error("ID Note tidak ditemukan saat update");
                return;
             }

            await noteStore.updateNoteContent(noteStore.currentNote.id, {
                title: title.value,
                content: outputData 
            });
            // Opsional: Balik ke list atau tetap di sini? 
            // User request: "saya tidak kembali ke halaman list"
            // Mari kita kembalikan ke list setelah save sukses
            router.push('/app/notes');

        } else {
            // --- BUAT NOTE BARU ---
            const newNote = await noteStore.createNewNote({
                title: title.value,
                content: outputData,
                shareWithPartner: false
            });
            
            if (newNote && newNote.id) {
               // Redirect ke list atau mode edit? User minta "kembali ke halaman list"
               router.push('/app/notes');
            }
        }
    } catch (error) {
        console.error('Gagal menyimpan:', error);
    }
};

const onDelete = async () => {
    if (!isEditing.value) return;
    if (confirm('Apakah Anda yakin ingin menghapus note ini selamanya?')) {
        try {
            await noteStore.deleteNote(noteStore.currentNote.id);
            router.push('/app/notes'); 
        } catch (error) {
            console.error('Gagal menghapus:', error);
        }
    }
};
</script>

<style>
/* 
  EDITOR.JS CUSTOM STYLING 
  Kita perlu override default styles karena Editor.js punya style bawaan yang sempit dan reset.
*/

/* 1. Perlebar Area Konten */
.ce-block__content,
.ce-toolbar__content {
  max-width: 100% !important; /* Gunakan full width dari container */
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 2. Styling Typography untuk Header */
/* Editor.js biasanya merender h1, h2 dst. Kita paksa styling Tailwind-ish */
.ce-header {
  font-weight: 800 !important;
  color: inherit !important;
  padding-bottom: 0.5rem !important;
  margin-top: 1rem !important;
}

h1.ce-header { font-size: 2.25rem !important; }
h2.ce-header { font-size: 1.875rem !important; }
h3.ce-header { font-size: 1.5rem !important; }

/* 3. Styling Paragraph */
.ce-paragraph {
  font-size: 1.125rem !important; /* text-lg */
  line-height: 1.75 !important;
  color: inherit !important;
}

/* 4. Fix warna text untuk Dark Mode secara manual jika inherit gagal */
.dark .ce-header,
.dark .ce-paragraph {
  color: #e5e7eb !important; /* gray-200 */
}

/* 5. Block Tunes & Popover (Dark Mode Overrides) */
/* Mengubah background popover utama */
.dark .ce-popover,
.dark .ce-popover__items,
.dark .ce-inline-toolbar,
.dark .ce-conversion-toolbar,
.dark .ce-settings,
.dark .ce-toolbar__settings-btn {
    background-color: #1f2937 !important; /* bg-gray-800 */
    border-color: #374151 !important; /* border-gray-700 */
    color: #e5e7eb !important; /* text-gray-200 */
}

/* Item di dalam popover (Text & Icon) */
.dark .ce-popover-item,
.dark .ce-conversion-tool,
.dark .ce-inline-tool {
    color: #e5e7eb !important;
}

/* Icon SVG fill */
.dark .ce-popover-item__icon,
.dark .ce-conversion-tool__icon,
.dark .ce-inline-tool__icon,
.dark .ce-toolbar__plus,
.dark .ce-toolbar__settings-btn {
    color: #e5e7eb !important;
    background-color: transparent !important;
}

/* Hover States */
.dark .ce-popover-item:hover,
.dark .ce-conversion-tool:hover,
.dark .ce-inline-tool:hover,
.dark .ce-toolbar__settings-btn:hover,
.dark .ce-toolbar__plus:hover,
.dark .ce-settings__button:hover {
    background-color: #374151 !important; /* bg-gray-700 */
    color: #ffffff !important;
}

/* Active States */
.dark .ce-popover-item--active,
.dark .ce-inline-tool--active,
.dark .ce-conversion-tool--active {
    background-color: #4b5563 !important; /* bg-gray-600 */
    color: #ffffff !important;
}

/* Search Input di Toolbox */
.dark .cdx-search-field, 
.dark .ce-popover__search {
    background-color: #111827 !important; /* bg-gray-900 */
    color: #e5e7eb !important;
    border-color: #374151 !important;
}

/* Custom Text dalam Toolbox */
.dark .ce-popover-item__title,
.dark .ce-popover-item__secondary-title {
    color: inherit !important;
}

/* Menghilangkan shadow putih jika ada */
.dark .ce-popover--opened,
.dark .ce-inline-toolbar {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3) !important;
}

/* Plus button background fix */
.dark .ce-toolbar__plus {
    color: #9ca3af !important; /* gray-400 */
}
.dark .ce-toolbar__plus:hover {
    color: #e5e7eb !important;
}
</style>