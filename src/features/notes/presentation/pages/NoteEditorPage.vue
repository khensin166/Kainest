<!-- NoteEditorPage.vue -->
<template>
    <div class="p-4 md:p-8">
        <div v-if="noteStore.isLoadingNote" class="text-center py-20">
            <p>Memuat editor...</p>
        </div>

        <div v-else>
            <input type="text" v-model="title" placeholder="Judul Catatan..."
                class="input input-lg w-full text-3xl font-bold mb-4 focus:outline-none focus:border-transparent" />

            <div id="editorjs-container" class="bg-white rounded-lg shadow-inner p-4 min-h-[400px]">
            </div>

            <div class="mt-6 flex justify-between items-center">
                <div>
                    <button @click="onSave" :disabled="noteStore.isLoadingNote"
                        class="btn btn-primary bg-violet-600 text-white mr-2">
                        {{ noteStore.isLoadingNote ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                    <button @click="openShareModal" class="btn btn-outline">
                        Bagikan
                    </button>
                </div>
                <button v-if="isEditing" @click="onDelete" class="btn btn-error btn-outline">
                    Hapus Note
                </button>
            </div>
        </div>

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
const isEditing = computed(() => route.params.id !== 'new');
const isShareModalOpen = ref(false);

// Inisialisasi Editor.js
onMounted(async () => {
    const noteId = route.params.id;
    let initialData = {}; // Data awal untuk Editor.js

    if (isEditing.value) {
        try {
            // 1. Ambil data note yang ada
            await noteStore.fetchNoteById(noteId);
            title.value = noteStore.currentNote.title;
            initialData = noteStore.currentNote.content; // Ini adalah JSON
        } catch (error) {
            router.push('/app/notes'); // Gagal ambil note, kembali ke list
        }
    } else {
        // 2. Note baru
        noteStore.currentNote = null; // Pastikan kosong
        title.value = '';
    }

    // --- 2. KONFIGURASI INSTANCE EDITOR.JS ---
    editorInstance.value = new EditorJS({
        holder: 'editorjs-container',
        data: initialData,
        placeholder: 'Mulai tulis catatan Anda...',

        // Konfigurasi tools
        tools: {
            header: {
                class: Header,
                inlineToolbar: true, // Izinkan bold/italic di judul
            },
            list: {
                class: List,
                inlineToolbar: true,
            },
            image: { // Konfigurasi alat gambar
                class: ImageTool,
                config: {
                    // 'uploader' adalah kunci terpenting
                    uploader: {
                        /**
                         * Fungsi ini akan dipanggil oleh Editor.js saat
                         * user memilih file gambar.
                         */
                        uploadByFile(file) {
                            // Panggil fungsi uploader kustom kita
                            return customUploader(file);
                        },
                        // (Kita tidak perlu uploadByUrl)
                    }
                }
            }
            // TODO: Tambahkan tools lain (Attaches, Quote, dll) di sini
        },
    });
    // --- BATAS KONFIGURASI EDITOR ---
});

// Hancurkan instance editor saat keluar
onUnmounted(() => {
    if (editorInstance.value) {
        editorInstance.value.destroy();
        editorInstance.value = null;
    }
});

// Fungsi untuk menyimpan
const onSave = async () => {
    if (!editorInstance.value) return;

    try {
        const outputData = await editorInstance.value.save();

        if (isEditing.value) {
            // --- UPDATE NOTE YANG ADA ---
            await noteStore.updateNoteContent(noteStore.currentNote.id, {
                title: title.value,
                content: outputData // JSON dari Editor.js
            });
        } else {
            // --- BUAT NOTE BARU ---
            // (Untuk demo, kita buat private dulu)
            const newNote = await noteStore.createNewNote({
                title: title.value,
                content: outputData,
                shareWithPartner: false,
                partnerPermission: 'VIEWER'
            });
            // Arahkan ke URL note baru
            router.push(`/app/notes/${newNote.id}`);
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
            router.push('/app/notes'); // Kembali ke list
        } catch (error) {
            console.error('Gagal menghapus:', error);
        }
    }
};

</script>