<template>
  <div class="bg-surface-card rounded-2xl border border-border-default shadow-none overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-2 px-5 py-4 border-b border-border-default">
        <ChatBubbleLeftRightIcon class="w-4 h-4 text-brand-primary" />
        <h2 class="text-sm font-semibold text-text-primary">Ulasan Pengguna</h2>
      </div>

      <!-- Feedback List -->
      <div class="divide-y divide-border-default max-h-[400px] overflow-y-auto">
        <div v-if="loadingFeedbacks" class="p-5 space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-surface-hover animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-surface-hover rounded animate-pulse w-1/3"></div>
              <div class="h-2.5 bg-surface-hover rounded animate-pulse w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="feedbacks.length === 0" class="py-8 text-center text-sm text-text-muted">
          Belum ada ulasan. Jadilah yang pertama!
        </div>

        <div v-else>
          <div v-for="fb in feedbacks" :key="fb.id"
            class="px-5 py-3.5 hover:bg-surface-hover transition-colors">
            <div class="flex items-center gap-2 mb-1.5">
              <!-- Avatar -->
              <div class="w-7 h-7 rounded-full bg-brand-surface flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img v-if="fb.user?.profile?.avatarUrl || fb.user?.image"
                  :src="fb.user?.profile?.avatarUrl || fb.user?.image"
                  class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                <span v-else class="text-xs font-bold text-brand-primary">
                  {{ (fb.user?.profile?.displayName || fb.user?.name || '?').charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-xs font-semibold text-text-primary">
                {{ fb.user?.profile?.displayName || fb.user?.name || 'Pengguna' }}
              </span>
              <!-- Star rating -->
              <div v-if="fb.rating" class="flex ml-auto">
                <StarIcon v-for="i in 5" :key="i"
                  :class="['w-3 h-3', i <= fb.rating ? 'text-status-warning' : 'text-surface-hover']" />
              </div>
            </div>
            <p class="text-xs text-text-muted leading-relaxed line-clamp-3">{{ fb.message }}</p>
            <!-- Admin hide button -->
            <button v-if="isAdmin" @click="hideFeedback(fb.id)"
              class="mt-1.5 text-xs text-status-danger hover:text-status-danger/80 transition-colors">
              Sembunyikan
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Form -->
      <div class="px-5 py-4 border-t border-border-default bg-surface-subtle">
        <form @submit.prevent="submitFeedback" v-if="!submitted">
          <p class="text-xs font-semibold text-text-primary mb-2">Bagikan pendapatmu tentang Kainest ✨</p>
          <!-- Star Rating Input -->
          <div class="flex gap-1 mb-2">
            <button v-for="i in 5" :key="i" type="button" @click="formRating = i">
              <StarIcon :class="['w-5 h-5 transition-colors', i <= formRating ? 'text-status-warning' : 'text-surface-hover hover:text-status-warning']" />
            </button>
          </div>
          <textarea v-model="formMessage" rows="2" placeholder="Tulis ulasanmu di sini..."
            class="w-full text-xs px-3 py-2 rounded-xl border border-border-default bg-surface-card text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none transition-colors"
            :disabled="submitting" />
          <button type="submit" :disabled="submitting || !formMessage.trim()"
            class="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-60 text-text-inverse text-xs font-semibold rounded-xl transition-all shadow-none">
            <PaperAirplaneIcon class="w-3.5 h-3.5" />
            {{ submitting ? 'Mengirim...' : 'Kirim Ulasan' }}
          </button>
        </form>
        <div v-else class="flex items-center gap-2 text-sm text-status-success">
          <CheckCircleIcon class="w-5 h-5" />
          Terima kasih atas ulasanmu!
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { ChatBubbleLeftRightIcon, StarIcon, PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/vue/24/solid';
import { ChatBubbleLeftRightIcon as ChatBubbleOutline } from '@heroicons/vue/24/outline';
import axios from 'axios';

const authStore = useAuthStore();
const feedbacks = ref([]);
const loadingFeedbacks = ref(true);
const formMessage = ref('');
const formRating = ref(0);
const submitting = ref(false);
const submitted = ref(false);

const isAdmin = computed(() => authStore.user?.role === 'admin');

const apiHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchFeedbacks = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.get(`${baseUrl}/feedbacks`, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    feedbacks.value = res.data?.feedbacks || [];
  } catch (e) {
    console.warn('[FeedbackCard] Gagal fetch:', e.message);
  } finally {
    loadingFeedbacks.value = false;
  }
};

const submitFeedback = async () => {
  if (!formMessage.value.trim()) return;
  submitting.value = true;
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await axios.post(`${baseUrl}/feedbacks`, {
      message: formMessage.value.trim(),
      rating: formRating.value > 0 ? formRating.value : undefined,
    }, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    submitted.value = true;
    await fetchFeedbacks();
  } catch (e) {
    console.error('[FeedbackCard] Gagal submit:', e.message);
  } finally {
    submitting.value = false;
  }
};

const hideFeedback = async (id) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    await axios.patch(`${baseUrl}/feedbacks/${id}/visibility`, {}, {
      headers: apiHeaders(),
      withCredentials: true,
    });
    feedbacks.value = feedbacks.value.filter(f => f.id !== id);
  } catch (e) {
    console.error('[FeedbackCard] Gagal hide:', e.message);
  }
};

onMounted(() => fetchFeedbacks());
</script>
