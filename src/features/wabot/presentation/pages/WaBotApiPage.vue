<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">WhatsApp Bot Control</h1>
      <div v-if="waStore.apiKey" class="badge badge-success gap-2 text-white">Connected</div>
      <div v-else class="badge badge-error gap-2 text-white">Disconnected</div>
    </div>

    <div v-if="!waStore.apiKey" class="card bg-base-100 shadow-xl border border-base-200">
      <div class="card-body">
        <h2 class="card-title text-xl mb-4">Konfigurasi Server Bot</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold">Bot Base URL</span></label>
            <input v-model="configForm.baseUrl" type="text" placeholder="https://domain-kamu.up.railway.app" class="input input-bordered" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold">Admin Secret</span></label>
            <input v-model="configForm.adminSecret" type="password" class="input input-bordered" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text font-semibold">Nama Aplikasi</span></label>
            <input v-model="configForm.appName" type="text" class="input input-bordered" />
          </div>
        </div>
        <div class="card-actions justify-end mt-6">
          <button @click="handleConnect" class="btn btn-primary text-white" :disabled="waStore.isLoading">
            <span v-if="waStore.isLoading" class="loading loading-spinner"></span> Connect
          </button>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-1 space-y-6">
        <div class="card bg-base-100 shadow-xl border border-base-200">
          <div class="card-body">
            <h2 class="card-title mb-4">Kirim Pesan</h2>
            <div role="tablist" class="tabs tabs-boxed mb-4 bg-base-200">
              <a role="tab" class="tab" :class="{ 'tab-active': !isGroupMode }" @click="isGroupMode = false">Personal</a>
              <a role="tab" class="tab" :class="{ 'tab-active': isGroupMode }" @click="isGroupMode = true">Grup</a>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Tujuan</span></label>
              <input v-model="messageForm.target" type="text" class="input input-bordered font-mono text-sm" />
            </div>
            <div class="form-control mt-4">
              <label class="label"><span class="label-text font-semibold">Pesan</span></label>
              <textarea v-model="messageForm.message" class="textarea textarea-bordered h-32"></textarea>
            </div>
            <div class="card-actions justify-end mt-6">
              <button @click="handleSend" class="btn btn-secondary text-white w-full" :disabled="waStore.isSending">
                <span v-if="waStore.isSending" class="loading loading-spinner"></span> Kirim
              </button>
            </div>
          </div>
        </div>
        <button @click="waStore.logout" class="btn btn-outline btn-error btn-sm w-full">Reset Config</button>
      </div>

      <div class="xl:col-span-2">
        <div class="card bg-base-100 shadow-xl border border-base-200 h-full">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Daftar Grup</h2>
              <button @click="waStore.fetchGroups" class="btn btn-ghost btn-sm" :disabled="waStore.isLoading">
                <span v-if="waStore.isLoading" class="loading loading-spinner"></span> Refresh
              </button>
            </div>
            <div class="overflow-x-auto bg-base-200/50 rounded-lg h-[500px]">
              <table class="table table-zebra table-pin-rows">
                <thead>
                  <tr class="bg-base-200">
                    <th>Nama Grup</th>
                    <th>ID</th>
                    <th class="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="group in waStore.groups" :key="group.id" class="hover">
                    <td>{{ group.subject }}</td>
                    <td class="font-mono text-xs">{{ group.id }}</td>
                    <td class="text-right">
                      <button @click="selectGroup(group.id)" class="btn btn-xs btn-primary btn-outline">Pilih</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useWaBotStore } from '../stores/useWaBotStore';

const waStore = useWaBotStore();

const configForm = reactive({
  baseUrl: localStorage.getItem('wabot_base_url') || '',
  adminSecret: '',
  appName: 'Kainest Web',
});

const isGroupMode = ref(false);
const messageForm = reactive({ target: '', message: '' });

const handleConnect = async () => {
  try {
    await waStore.connectBot(configForm.baseUrl, configForm.appName, configForm.adminSecret);
    alert('Terhubung!');
  } catch (e) {
    alert('Gagal terhubung: ' + e.message);
  }
};

const handleSend = async () => {
  try {
    await waStore.sendMessage(messageForm.target, messageForm.message, isGroupMode.value);
    alert('Terkirim!');
    messageForm.message = '';
  } catch (e) {
    alert('Gagal kirim.');
  }
};

const selectGroup = (id) => {
  isGroupMode.value = true;
  messageForm.target = id;
};

onMounted(() => {
  if (waStore.apiKey) {
    waStore.fetchGroups();
  }
});
</script>