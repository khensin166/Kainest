<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight">Manajemen Grup Akses (IAM)</h1>
        </div>
        <p class="text-sm text-text-muted mt-1">
          Buat dan atur Grup Pengguna. Tetapkan modul apa saja yang boleh diakses oleh masing-masing grup.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="secondary" :loading="isLoading" @click="fetchGroups">
          <IconRefresh v-if="!isLoading" class="h-4 w-4" aria-hidden="true" />
          <span class="hidden sm:inline">Muat Ulang</span>
        </Button>
        <Button variant="primary" @click="openGroupModal()">
          + Grup Baru
        </Button>
      </div>
    </header>

    <!-- Memuat -->
    <Card v-if="isLoading" class="mb-6">
      <div class="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner class="h-6 w-6 text-brand-primary" />
        <p class="text-sm text-text-muted">Memuat daftar grup...</p>
      </div>
    </Card>

    <!-- Daftar Group -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="group in groups" :key="group.id" class="flex flex-col">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
              {{ group.name }}
              <Badge v-if="group.isDefault" tone="brand" size="sm">Default</Badge>
            </h3>
            <p class="text-sm text-text-muted mt-1">{{ group.description || 'Tidak ada deskripsi' }}</p>
          </div>
        </div>
        
        <div class="mb-4 flex-1">
          <p class="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Akses Modul:</p>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="perm in group.permissions" :key="perm" tone="neutral" size="sm">
              {{ getModuleName(perm) }}
            </Badge>
            <span v-if="group.permissions.length === 0" class="text-sm text-text-muted italic">Tidak ada akses</span>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-border-default pt-4 mt-auto">
          <div class="text-sm text-text-muted flex items-center gap-2">
            <IconUsers class="w-4 h-4" />
            <span>{{ group._count?.users || 0 }} pengguna</span>
          </div>
          <div class="flex gap-2">
            <Button variant="secondary" size="sm" @click="openGroupModal(group)">Edit</Button>
            <Button v-if="!group.isDefault" variant="danger" size="sm" @click="confirmDelete(group)">Hapus</Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Modal Form Group -->
    <Modal v-model:open="isModalOpen" :title="editingGroup ? 'Edit Grup Akses' : 'Buat Grup Baru'">
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-text-primary mb-1">Nama Grup <span class="text-status-danger">*</span></label>
          <Input v-model="form.name" placeholder="Misal: Keuangan Spesial" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-primary mb-1">Deskripsi</label>
          <Input v-model="form.description" placeholder="Deskripsi singkat tentang grup ini" />
        </div>
        <div class="flex items-center gap-3">
          <Switch v-model="form.isDefault" />
          <div>
            <p class="text-sm font-medium text-text-primary">Jadikan Default</p>
            <p class="text-xs text-text-muted">Pengguna yang baru mendaftar otomatis masuk grup ini.</p>
          </div>
        </div>

        <!-- Pemilihan Modul -->
        <div class="pt-4 border-t border-border-default">
          <h4 class="text-sm font-semibold text-text-primary mb-4">Pilih Hak Akses Modul</h4>
          
          <div class="space-y-6">
            <div v-for="category in moduleCategories" :key="category.group">
              <p class="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{{ category.group }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label 
                  v-for="mod in category.modules" 
                  :key="mod.id" 
                  class="flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors"
                  :class="form.permissions.includes(mod.id) ? 'border-brand-primary bg-brand-surface' : 'border-border-default hover:bg-surface-hover'"
                >
                  <span class="text-sm font-medium" :class="form.permissions.includes(mod.id) ? 'text-text-primary' : 'text-text-secondary'">{{ mod.label }}</span>
                  <input type="checkbox" :value="mod.id" v-model="form.permissions" class="hidden" />
                  <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                       :class="form.permissions.includes(mod.id) ? 'border-brand-primary bg-brand-primary' : 'border-border-strong bg-surface'">
                    <svg v-if="form.permissions.includes(mod.id)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <Button variant="secondary" @click="isModalOpen = false">Batal</Button>
          <Button variant="primary" :loading="isSaving" :disabled="!form.name" @click="saveGroup">Simpan Grup</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { notify } from "@/lib/notify";
import { Button, Card, Badge, Input, Switch, Spinner, Modal } from '@/ui';
import { IconRefresh, IconUsers } from '@/ui/icons';
import { getAdminGroupsUseCase, createGroupUseCase, updateGroupUseCase, deleteGroupUseCase } from '@/core/di/di';
import { useModalStore } from '@/stores/modalStore';

const modalStore = useModalStore();

const groups = ref([]);
const isLoading = ref(true);

const isModalOpen = ref(false);
const isSaving = ref(false);
const editingGroup = ref(null);

const form = ref({
  name: '',
  description: '',
  isDefault: false,
  permissions: []
});

const moduleCategories = [
  {
    group: 'Keuangan',
    modules: [
      { id: 'budgeting', label: 'Kantong Keuangan (Utama)' },
      { id: 'history', label: 'Rekap & Riwayat' },
      { id: 'split', label: 'Split Bill AI' },
      { id: 'plan', label: 'Rencana Keuangan' },
    ]
  },
  {
    group: 'Produktivitas',
    modules: [
      { id: 'todos', label: 'To-do' },
      { id: 'notes', label: 'Notes' },
      { id: 'calendar', label: 'Calendar' },
    ]
  },
  {
    group: 'Lainnya',
    modules: [
      { id: 'gallery', label: 'Gallery' },
      { id: 'wabot', label: 'WaBot' },
    ]
  }
];

// Helper to get module label
const getModuleName = (id) => {
  for (const cat of moduleCategories) {
    const mod = cat.modules.find(m => m.id === id);
    if (mod) return mod.label;
  }
  return id;
};

const fetchGroups = async () => {
  isLoading.value = true;
  const result = await getAdminGroupsUseCase.execute();
  if (!result.left) {
    groups.value = result.right;
  } else {
    notify.error("Gagal memuat grup akses");
  }
  isLoading.value = false;
};

const openGroupModal = (group = null) => {
  if (group) {
    editingGroup.value = group;
    form.value = {
      name: group.name,
      description: group.description || '',
      isDefault: group.isDefault,
      permissions: [...group.permissions]
    };
  } else {
    editingGroup.value = null;
    form.value = {
      name: '',
      description: '',
      isDefault: false,
      permissions: []
    };
  }
  isModalOpen.value = true;
};

const saveGroup = async () => {
  isSaving.value = true;
  
  const payload = {
    name: form.value.name,
    description: form.value.description,
    isDefault: form.value.isDefault,
    permissions: form.value.permissions
  };

  let result;
  if (editingGroup.value) {
    result = await updateGroupUseCase.execute(editingGroup.value.id, payload);
  } else {
    result = await createGroupUseCase.execute(payload);
  }

  if (!result.left) {
    notify.success(editingGroup.value ? "Grup berhasil diperbarui" : "Grup baru berhasil dibuat");
    isModalOpen.value = false;
    await fetchGroups();
  } else {
    notify.error(result.left?.message || "Terjadi kesalahan saat menyimpan grup");
  }
  isSaving.value = false;
};

const confirmDelete = (group) => {
  modalStore.openModal({
    newTitle: "Hapus Grup",
    newMessage: `Anda yakin ingin menghapus grup "${group.name}"? Pengguna yang ada di dalam grup ini akan kehilangan seluruh aksesnya hingga dipindahkan ke grup lain.`,
    newStatus: "warning",
    onConfirm: async () => {
      const result = await deleteGroupUseCase.execute(group.id);
      if (!result.left) {
        notify.success("Grup berhasil dihapus");
        await fetchGroups();
      } else {
        notify.error(result.left?.message || "Gagal menghapus grup");
      }
    }
  });
};

onMounted(() => {
  fetchGroups();
});
</script>
