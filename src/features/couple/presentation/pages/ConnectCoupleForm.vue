<template>
    <div>
        <div v-if="coupleStore.isLoading && !coupleStore.connectionStatus" class="text-center">
            <p>Memeriksa status koneksi...</p>
        </div>

        <div v-else-if="coupleStore.connectionStatus?.connected">
            <h2 class="text-xl text-text-primary font-bold">
                ❤️ Pasangan Terhubung
            </h2>
            <p class="text-sm text-text-muted mt-1 mb-6">
                Kelola pencatatan keuangan bersama dan bagikan pengeluaran dengan pasangan Anda.
            </p>
            <div class="bg-surface-subtle p-4 rounded-lg flex items-center space-x-4">
                <img :src="partnerAvatar" alt="Partner Avatar" class="w-16 h-16 rounded-full object-cover" referrerpolicy="no-referrer" />
                <div>
                    <p class="font-bold text-lg text-text-primary">{{ partnerName }}</p>
                    <p class="text-sm text-text-muted">
                        Terhubung sejak: {{ formattedJoinDate }}
                    </p>
                </div>
            </div>
        </div>

        <div v-else>
            <div class="mb-8">
                <h3 class="text-lg font-semibold text-text-primary mb-2">Kode Undangan Anda</h3>
                <p class="text-sm text-text-muted mb-3">
                    Berikan kode ini kepada pasangan Anda agar dia bisa terhubung dengan Anda.
                </p>

                <button type="button" @click="copyToClipboard"
                    class="w-full bg-surface-subtle p-4 rounded-lg text-center relative group cursor-pointer hover:bg-surface-hover transition-colors duration-150"
                    :disabled="myInvitationCode === 'MEMUAT...'">
                    <p
                        class="text-3xl font-bold tracking-widest text-brand-primary transition-colors">
                        {{ myInvitationCode }}
                    </p>

                    <div class="absolute top-0 right-0 p-2">
                        <CheckIcon v-if="isCopied" class="w-5 h-5 text-status-success" />
                        <ClipboardIcon v-else
                            class="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>

                <p v-if="isCopied" class="text-sm text-status-success text-center mt-2">
                    Disalin ke clipboard!
                </p>
            </div>

            <div class="relative my-8">
                <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-border-default" />
                </div>
                <div class="relative flex justify-center">
                    <span class="bg-surface-card px-3 text-lg font-medium text-text-muted">ATAU</span>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">Terhubung ke Pasangan</h3>
                <p class="text-sm text-text-muted mb-3">
                    Masukkan kode undangan yang diberikan oleh pasangan Anda di sini.
                </p>
                <form @submit.prevent="handleConnect">
                    <label for="invite_code" class="block text-sm font-medium text-text-primary mb-1">
                        Kode Undangan Pasangan
                    </label>
                    <input id="invite_code" v-model="inputCode" class="form-input w-full uppercase" type="text"
                        placeholder="XXXX-XXXX" required />
                    <div class="flex justify-end mt-4">
                        <button type="submit" :disabled="coupleStore.isLoading || !isDirty"
                            class="px-4 py-2 text-sm font-medium text-text-inverse bg-brand-primary hover:bg-brand-primary-hover rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
                            {{ coupleStore.isLoading ? 'Menghubungkan...' : 'Hubungkan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../../auth/presentation/stores/authStore';
import { useCoupleStore } from '../../presentation/stores/useCoupleStore';
import UserAvatar from "@/images/user-avatar-32.png";
import { ClipboardIcon, CheckIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const coupleStore = useCoupleStore();
const isCopied = ref(false);
const inputCode = ref('');

// --- Computed Properties ---

const isDirty = computed(() => {
    return inputCode.value.trim().length > 0;
});

// Mengambil kode undangan SAYA dari authStore
const myInvitationCode = computed(() => {
    return authStore.user?.invitationCode || 'MEMUAT...';
});

// Mengambil nama pasangan
const partnerName = computed(() => {
    const partner = coupleStore.connectionStatus?.partner;
    return partner?.displayName || partner?.name || 'Pasangan Anda';
});

// Mengambil avatar pasangan
const partnerAvatar = computed(() => {
    return coupleStore.connectionStatus?.partner?.avatarUrl || UserAvatar;
});

// Format tanggal
const formattedJoinDate = computed(() => {
    const date = coupleStore.connectionStatus?.createdAt;
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
});

const copyToClipboard = async () => {
    // Jangan lakukan apa-apa jika sedang 'MEMUAT...' atau sudah disalin
    if (myInvitationCode.value === 'MEMUAT...' || isCopied.value) return;

    try {
        // API Clipboard modern
        await navigator.clipboard.writeText(myInvitationCode.value);

        // Beri feedback ke user
        isCopied.value = true;

        // Reset ikon setelah 2 detik
        setTimeout(() => {
            isCopied.value = false;
        }, 2000);

    } catch (err) {
        console.error('Gagal menyalin kode:', err);
        // (Opsional: Tampilkan modal error jika gagal)
    }
};

// --- Methods ---

const handleConnect = async () => {
    if (!inputCode.value) return;
    try {
        await coupleStore.connectToPartner(inputCode.value.toUpperCase());
        inputCode.value = ''; // Kosongkan form jika berhasil
    } catch (error) {
        console.error("Gagal terhubung:", error.message);
    }
};
</script>