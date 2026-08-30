<!-- UserManagementPage.vue — kendali peran & hak akses (RBAC).
     Peran dan izin modul BERDIRI SENDIRI di backend: mengubah peran tidak
     otomatis mengubah izin. UI ini sengaja tidak menampilkan izin "terwarisi"
     agar tidak membohongi cara kerja sistem yang sebenarnya. -->
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight">Manajemen Pengguna</h1>
          <PageGuide :steps="pageGuides.users" />
        </div>
        <p class="text-sm text-text-muted mt-1">
          Pusat kendali admin — atur hak akses, pantau, dan kelola aktivitas seluruh pengguna aplikasi.
        </p>
      </div>
      <Button variant="secondary" class="shrink-0" :loading="isLoading" @click="fetchUsers">
        <IconRefresh v-if="!isLoading" class="h-4 w-4" aria-hidden="true" />
        <span class="hidden sm:inline">Muat Ulang</span>
      </Button>
    </header>

    <!-- Ringkasan sekaligus filter peran -->
    <Card :padded="false" class="mb-4">
      <div class="grid grid-cols-3 divide-x divide-border-default border-b border-border-default">
        <button
          v-for="f in filterPeran"
          :key="f.value"
          type="button"
          class="px-4 py-3 text-center transition-colors cursor-pointer
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
          :class="peranTerpilih === f.value ? 'bg-surface-hover' : 'hover:bg-surface-hover/60'"
          :aria-pressed="peranTerpilih === f.value"
          @click="peranTerpilih = f.value"
        >
          <p class="text-xl font-bold tabular-nums" :class="peranTerpilih === f.value ? 'text-text-primary' : 'text-text-secondary'">
            {{ f.jumlah }}
          </p>
          <p class="text-xs mt-0.5" :class="peranTerpilih === f.value ? 'text-text-secondary' : 'text-text-muted'">
            {{ f.label }}
          </p>
        </button>
      </div>

      <div class="p-4">
        <Input v-model="pencarian" placeholder="Cari nama atau email...">
          <template #prefix><IconSearch class="h-4 w-4" aria-hidden="true" /></template>
        </Input>
      </div>
    </Card>

    <!-- Memuat -->
    <Card v-if="isLoading">
      <div class="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner class="h-6 w-6 text-brand-primary" />
        <p class="text-sm text-text-muted">Memuat data pengguna...</p>
      </div>
    </Card>

    <!-- Gagal -->
    <Card v-else-if="error" :padded="false">
      <div class="flex items-start gap-3 p-4">
        <IconWarning class="h-5 w-5 shrink-0 mt-0.5 text-status-danger" aria-hidden="true" />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-text-primary">Gagal memuat pengguna</p>
          <p class="text-sm text-text-muted mt-0.5">{{ error }}</p>
        </div>
        <Button variant="secondary" size="sm" class="shrink-0" @click="fetchUsers">Coba Lagi</Button>
      </div>
    </Card>

    <!-- Daftar pengguna -->
    <div v-else class="space-y-4">
      <Card v-if="penggunaTersaring.length === 0" :padded="false">
        <EmptyState
          :icon="IconUsers"
          :title="users.length === 0 ? 'Tidak Ada Pengguna' : 'Tidak ada yang cocok'"
          :description="users.length === 0
            ? 'Belum ada user yang terdaftar.'
            : 'Coba ubah kata pencarian atau filter perannya.'"
        />
      </Card>

      <Card
        v-for="user in penggunaTersaring"
        :key="user.id"
        :padded="false"
        :class="user._changed ? 'ring-1 ring-brand-primary border-brand-primary' : ''"
      >
        <!-- Identitas + peran aktif -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Avatar: inisial lokal bila tidak ada foto, tanpa layanan eksternal -->
            <div class="h-10 w-10 rounded-full shrink-0 overflow-hidden bg-brand-surface flex items-center justify-center">
              <img
                v-if="user.profile?.avatarUrl || user.image"
                class="h-full w-full object-cover"
                :src="user.profile?.avatarUrl || user.image"
                alt=""
                referrerpolicy="no-referrer"
              />
              <span v-else class="text-sm font-bold text-brand-primary">{{ inisial(user) }}</span>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-text-primary truncate">
                {{ user.profile?.displayName || user.name || "No Name" }}
              </p>
              <p class="text-sm text-text-muted truncate">{{ user.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <Badge :tone="user.role === 'admin' ? 'brand' : 'neutral'">
              {{ user.role === 'admin' ? 'Admin' : 'User' }}
            </Badge>
            <Button
              v-if="user._changed"
              size="sm"
              :loading="user._saving"
              @click="saveChanges(user)"
            >
              Simpan
            </Button>
          </div>
        </div>

        <!-- Peran: dua pilihan dengan penjelasan, bukan dropdown telanjang -->
        <div class="px-5 pb-5">
          <p class="text-xs font-medium text-text-muted mb-2">Peran</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="peran in DAFTAR_PERAN"
              :key="peran.value"
              type="button"
              class="text-left rounded-md border p-3 transition-colors cursor-pointer
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              :class="user.role === peran.value
                ? 'border-brand-primary bg-brand-surface'
                : 'border-border-default hover:border-border-strong hover:bg-surface-hover'"
              :aria-pressed="user.role === peran.value"
              @click="ubahPeran(user, peran.value)"
            >
              <span class="flex items-center gap-2">
                <component
                  :is="peran.icon"
                  class="w-4 h-4 shrink-0"
                  :class="user.role === peran.value ? 'text-brand-primary' : 'text-text-muted'"
                  aria-hidden="true"
                />
                <span class="text-sm font-semibold" :class="user.role === peran.value ? 'text-text-primary' : 'text-text-secondary'">
                  {{ peran.label }}
                </span>
              </span>
              <span class="block text-xs text-text-muted mt-1 leading-relaxed">{{ peran.desc }}</span>
            </button>
          </div>
        </div>

        <!-- Hak Akses IAM (Group) -->
        <div class="px-5 py-4 border-t border-border-default bg-surface-subtle">
          <div class="flex items-baseline justify-between gap-3 mb-3">
            <p class="text-sm font-medium text-text-primary">Grup Akses (IAM)</p>
          </div>

          <div class="w-full sm:w-1/2">
            <select
              v-model="user.userGroupId"
              @change="ubahGroup(user)"
              class="w-full px-3 py-2 border border-border-default rounded-md bg-surface text-sm text-text-primary focus:ring-2 focus:ring-brand-primary"
            >
              <option :value="null">Pilih Grup...</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }} ({{ group.permissions.length }} modul)
              </option>
            </select>
            <p class="text-xs text-text-muted mt-2">
              Hak akses modul secara otomatis diturunkan dari grup yang dipilih.
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { notify } from "@/lib/notify";
import { Button, Card, Badge, Input, Switch, Spinner, EmptyState } from '@/ui';
import { IconRefresh, IconSearch, IconShield, IconUser, IconUsers, IconWarning } from '@/ui/icons';
import { getUsersUseCase, updateUserAccessUseCase, getAdminGroupsUseCase, assignUserToGroupUseCase } from '@/core/di/di';
import { useModalStore } from '@/stores/modalStore';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';

const modalStore = useModalStore();

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);
const pencarian = ref('');
const peranTerpilih = ref('all');

const groups = ref([]);

const fetchGroups = async () => {
  const result = await getAdminGroupsUseCase.execute();
  if (!result.left) {
    groups.value = result.right;
  }
};

const DAFTAR_PERAN = [
  {
    value: 'user',
    label: 'User',
    icon: IconUser,
    desc: 'Akses terbatas pada modul yang diaktifkan di bawah.',
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: IconShield,
    desc: 'Akses penuh ke seluruh aplikasi, termasuk halaman ini.',
  },
];

const jumlahAdmin = computed(() => users.value.filter((u) => u.role === 'admin').length);

const filterPeran = computed(() => [
  { value: 'all', label: 'Total Pengguna', jumlah: users.value.length },
  { value: 'admin', label: 'Admin', jumlah: jumlahAdmin.value },
  { value: 'user', label: 'User', jumlah: users.value.length - jumlahAdmin.value },
]);

const penggunaTersaring = computed(() => {
  let daftar = users.value;

  if (peranTerpilih.value !== 'all') {
    daftar = daftar.filter((u) => u.role === peranTerpilih.value);
  }

  const q = pencarian.value.trim().toLowerCase();
  if (q) {
    daftar = daftar.filter(
      (u) =>
        (u.profile?.displayName || '').toLowerCase().includes(q) ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }
  return daftar;
});

const inisial = (user) =>
  (user.profile?.displayName || user.name || user.email || '?').charAt(0).toUpperCase();

const fetchUsers = async () => {
  isLoading.value = true;
  error.value = null;

  const result = await getUsersUseCase.execute();

  if (result.left) {
    error.value = result.left.message;
  } else {
    users.value = result.right.map((u) => ({
      ...u,
      role: u.role || 'user',
      permissions: u.permissions || [],
      userGroupId: u.userGroupId || null,
      _changed: false,
      _groupChanged: false,
      _saving: false,
    }));
  }
  isLoading.value = false;
};

const ubahPeran = (user, peran) => {
  if (user.role === peran) return;
  user.role = peran;
  user._changed = true;
};

const ubahGroup = (user) => {
  user._changed = true;
  user._groupChanged = true;
};

const saveChanges = async (user) => {
  user._saving = true;

  // 1. Update Role
  const roleResult = await updateUserAccessUseCase.execute(user.id, {
    role: user.role,
  });

  // 2. Update Group jika berubah
  if (user._groupChanged) {
    const groupResult = await assignUserToGroupUseCase.execute(user.id, user.userGroupId);
    if (groupResult.left) {
      notify.error(groupResult.left.message || "Gagal mengupdate grup");
    }
  }

  user._saving = false;

  if (roleResult.left) {
    notify.error(roleResult.left.message, roleResult.left);
  } else {
    user._changed = false;
    user._groupChanged = false;
    notify.success(`Akses untuk ${user.email} berhasil diperbarui.`);
  }
};

onMounted(() => {
  fetchGroups();
  fetchUsers();
});
</script>
