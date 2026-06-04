<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <ChatBubbleLeftRightIcon class="w-4 h-4 text-violet-500" />
        <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Ulasan Pengguna</h2>
      </div>

      <!-- Feedback List -->
      <div class="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-72 overflow-y-auto">
        <div v-if="loadingFeedbacks" class="p-5 space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
              <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="feedbacks.length === 0" class="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Belum ada ulasan. Jadilah yang pertama!
        </div>

        <div v-else>
          <div v-for="fb in feedbacks" :key="fb.id"
            class="px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            <div class="flex items-center gap-2 mb-1.5">
              <!-- Avatar -->
              <div class="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img v-if="fb.user?.profile?.avatarUrl || fb.user?.image"
                  :src="fb.user?.profile?.avatarUrl || fb.user?.image"
                  class="w-full h-full object-cover" />
                <span v-else class="text-xs font-bold text-violet-600 dark:text-violet-400">
                  {{ (fb.user?.profile?.displayName || fb.user?.name || '?').charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                {{ fb.user?.profile?.displayName || fb.user?.name || 'Pengguna' }}
              </span>
              <!-- Star rating -->
              <div v-if="fb.rating" class="flex ml-auto">
                <StarIcon v-for="i in 5" :key="i"
                  :class="['w-3 h-3', i <= fb.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600']" />
              </div>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">{{ fb.message }}</p>
            <!-- Admin hide button -->
            <button v-if="isAdmin" @click="hideFeedback(fb.id)"
              class="mt-1.5 text-xs text-red-400 hover:text-red-600 transition-colors">
              Sembunyikan
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Form -->
      <div class="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <form @submit.prevent="submitFeedback" v-if="!submitted">
          <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Bagikan pendapatmu tentang Kainest ✨</p>
          <!-- Star Rating Input -->
          <div class="flex gap-1 mb-2">
            <button v-for="i in 5" :key="i" type="button" @click="formRating = i">
              <StarIcon :class="['w-5 h-5 transition-colors', i <= formRating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600 hover:text-amber-300']" />
            </button>
          </div>
          <textarea v-model="formMessage" rows="2" placeholder="Tulis ulasanmu di sini..."
            class="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none transition-colors"
            :disabled="submitting" />
          <button type="submit" :disabled="submitting || !formMessage.trim()"
            class="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition-all">
            <PaperAirplaneIcon class="w-3.5 h-3.5" />
            {{ submitting ? 'Mengirim...' : 'Kirim Ulasan' }}
          </button>
        </form>
        <div v-else class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
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
