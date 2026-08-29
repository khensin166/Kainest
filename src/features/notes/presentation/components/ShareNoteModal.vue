<!-- ShareNoteModal.vue -->
<template>
  <div 
    v-if="modelValue" 
    @click.self="closeModal" 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
  >
    <div class="bg-surface-card rounded-lg border border-border-default w-full max-w-md p-6">
      <h2 class="text-xl font-bold mb-4 text-text-primary">Bagikan Catatan</h2>
      
      <div class="mb-4">
        <label class="flex items-center gap-3 cursor-pointer">
          <Switch v-model="shareSettings.is_public" />
          <span class="text-sm font-semibold text-text-primary">Bagikan ke Publik (Web)</span>
        </label>
        <p class="text-xs text-text-muted mt-1 ml-1">
          Siapa pun yang memiliki tautan dapat melihat note ini.
        </p>
        <div v-if="shareSettings.is_public" class="mt-2">
          <input 
            type="text" 
            :value="publicUrl" 
            readonly 
            class="w-full h-8 px-3 text-xs bg-surface-input border border-border-default rounded-md text-text-primary" 
          />
        </div>
      </div>

      <div class="h-px bg-border-default my-4"></div>
      
      <div >
        <label class="flex items-center gap-3 cursor-pointer">
          <Switch v-model="shareSettings.shareWithPartner" :disabled="shareSettings.is_public" />
          <span class="text-sm font-semibold text-text-primary">Bagikan ke Pasangan</span>
        </label>
        <p class="text-xs text-text-muted mt-1 ml-1">
          Pasangan Anda dapat mengakses note ini dari akun mereka.
        </p>
        
        <div v-if="shareSettings.shareWithPartner && !shareSettings.is_public" class="mt-3 ml-1">
          <label class="block text-sm text-text-secondary mb-1">Izin Pasangan:</label>
          <select 
            v-model="shareSettings.partnerPermission"
            class="h-8 px-3 text-xs bg-surface-input border border-border-default rounded-md text-text-primary w-full"
          >
            <option value="VIEWER">Hanya Bisa Melihat (Viewer)</option>
            <option value="EDITOR">Bisa Mengedit (Editor)</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-8">
        <Button variant="ghost" @click="closeModal">Batal</Button>
        <Button variant="primary" @click="saveSettings" :disabled="noteStore.isLoadingNote">
          {{ noteStore.isLoadingNote ? 'Menyimpan...' : 'Simpan' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button, Switch } from '@/ui';
import { ref, watch, computed } from 'vue';
import { useNoteStore } from '../stores/useNoteStore';

const props = defineProps({
  modelValue: Boolean, // Kontrol buka/tutup modal (v-model)
  note: Object,        // Note yang sedang diedit
});

const emit = defineEmits(['update:modelValue']);

const noteStore = useNoteStore();
const shareSettings = ref({
  is_public: false,
  shareWithPartner: false,
  partnerPermission: 'VIEWER',
});

// Hitung URL publik
const publicUrl = computed(() => {
  if (!props.note) return '';
  // Ambil host dari window.location (misal: https://kainest.com)
  return `${window.location.origin}/share/notes/${props.note.id}`;
});

// Update state modal saat note prop berubah
watch(() => props.note, (newNote) => {
  if (newNote) {
    shareSettings.value = {
      is_public: newNote.isPublic,
      shareWithPartner: !!newNote.coupleId, // Benar jika coupleId ada
      partnerPermission: newNote.partnerPermission,
    };
  }
});

// Menutup modal
const closeModal = () => {
  emit('update:modelValue', false);
};

// Menyimpan pengaturan
const saveSettings = async () => {
  if (!props.note) return;
  
  try {
    // Panggil aksi di store dengan data dari 'shareSettings'
    await noteStore.updateNotePerms(props.note.id, shareSettings.value);
    closeModal(); // Tutup modal jika sukses
  } catch (error) {
    // Modal error akan ditampilkan oleh store
    console.error("Gagal update izin:", error);
  }
};
</script>