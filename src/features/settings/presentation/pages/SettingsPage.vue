<!-- src\features\settings\presentation\pages\SettingsPage.vue -->
<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold text-text-primary tracking-tight">
        Pengaturan Akun
      </h1>
      <PageGuide :steps="pageGuides.settings" />
    </div>

    <div class="bg-surface-card rounded-md border border-border-default p-6">
      <div class="mb-6 border-b border-border-default">
        <ul class="flex flex-wrap -mb-px">
          <li class="mr-2">
            <a href="#" @click.prevent="activeTab = 'profile'" class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'profile' ? 'border-brand-primary text-brand-primary' : 'border-transparent hover:text-text-primary hover:border-border-strong'">Edit Profil</a>
          </li>
          <li class="mr-2">
            <a href="#" @click.prevent="activeTab = 'couple'" class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'couple' ? 'border-brand-primary text-brand-primary' : 'border-transparent hover:text-text-primary hover:border-border-strong'">Pasangan</a>
          </li>
          <li class="mr-2">
            <a href="#" @click.prevent="activeTab = 'security'" class="inline-block p-4 border-b-2 rounded-t-lg" :class="activeTab === 'security' ? 'border-brand-primary text-brand-primary' : 'border-transparent hover:text-text-primary hover:border-border-strong'">Keamanan</a>
          </li>
        </ul>
      </div>

      <div>
        <div v-if="activeTab === 'profile'">
          <EditProfileForm :user="authStore.user" />
        </div>
        <div v-if="activeTab === 'couple'">
          <ConnectCoupleForm />
        </div>
        <div v-if="activeTab === 'security'">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../../auth/presentation/stores/authStore";
import { useProfileStore } from "../../../profile/presentation/stores/useProfileStore";
import { useCoupleStore } from "../../../couple/presentation/stores/useCoupleStore";
import EditProfileForm from "./EditProfileForm.vue";
import ChangePasswordForm from "./ChangePasswordForm.vue";
import ConnectCoupleForm from "../../../couple/presentation/pages/ConnectCoupleForm.vue";

const authStore = useAuthStore();
const profileStore = useProfileStore()
const coupleStore = useCoupleStore();;
const activeTab = ref("profile");

onMounted(() => {
  if (!authStore.user) {
    profileStore.fetchProfile();
  }
  if (!coupleStore.connectionStatus) {
    coupleStore.fetchCoupleStatus();
  }
});
</script>
