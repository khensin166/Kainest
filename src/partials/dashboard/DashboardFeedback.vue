<template>
  <Card :padded="false">
    <template #header>
      <IconForum class="w-4 h-4 text-brand-primary" aria-hidden="true" />
      <h2 class="text-sm font-semibold text-text-primary">Ulasan Pengguna</h2>
    </template>

    <div class="divide-y divide-border-default max-h-96 overflow-y-auto">
      <div v-if="loadingFeedbacks" class="p-5 space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-start gap-3">
          <Skeleton class="w-8 h-8 rounded-full shrink-0" />
          <div class="flex-1 space-y-1.5">
            <Skeleton class="h-3 w-1/3" />
            <Skeleton class="h-2.5 w-full" />
          </div>
        </div>
      </div>

      <EmptyState
        v-else-if="feedbacks.length === 0"
        :icon="IconForum"
        title="Belum ada ulasan. Jadilah yang pertama!"
      />

      <template v-else>
        <div v-for="fb in feedbacks" :key="fb.id" class="px-5 py-4 hover:bg-surface-hover transition-colors">
          <div class="flex items-center gap-2 mb-1.5">
            <div class="w-7 h-7 rounded-full bg-brand-surface flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="fb.avatarUrl"
                :src="fb.avatarUrl" alt=""
                class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              <span v-else class="text-xs font-bold text-brand-primary">
                {{ fb.initial }}
              </span>
            </div>
            <span class="text-xs font-semibold text-text-primary">
              {{ fb.displayName }}
            </span>
            <div v-if="fb.rating" class="flex ml-auto" :aria-label="`Rating ${fb.rating} dari 5`">
              <IconStar v-for="i in 5" :key="i"
                :class="['w-3 h-3', i <= fb.rating ? 'text-status-warning' : 'text-border-default']" />
            </div>
          </div>
          <p class="text-xs text-text-muted leading-relaxed line-clamp-3">{{ fb.message }}</p>
          <button v-if="isAdmin" @click="hideFeedback(fb.id)"
            class="mt-1.5 text-xs text-status-danger hover:underline transition-colors cursor-pointer">
            Sembunyikan
          </button>
        </div>
      </template>
    </div>

    <template #footer>
      <form v-if="!submitted" class="w-full" @submit.prevent="submitFeedback">
        <p class="text-xs font-semibold text-text-primary mb-2">Bagikan pendapatmu tentang Kainest ✨</p>
        <div class="flex gap-1 mb-2" role="group" aria-label="Beri rating">
          <button v-for="i in 5" :key="i" type="button" :aria-label="`Beri ${i} bintang`"
            class="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
            @click="formRating = i">
            <IconStar :class="['w-5 h-5 transition-colors', i <= formRating ? 'text-status-warning' : 'text-border-default hover:text-status-warning']" />
          </button>
        </div>
        <textarea v-model="formMessage" rows="2" placeholder="Tulis ulasanmu di sini..." :disabled="submitting"
          class="w-full text-xs px-3 py-2 rounded-md border border-border-default bg-surface-input text-text-primary placeholder:text-text-muted resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary" />
        <Button type="submit" size="sm" block class="mt-2" :loading="submitting" :disabled="!formMessage.trim()">
          <IconSend v-if="!submitting" class="w-3.5 h-3.5" aria-hidden="true" />
          {{ submitting ? 'Mengirim...' : 'Kirim Ulasan' }}
        </Button>
      </form>
      <div v-else class="flex items-center gap-2 text-sm text-status-success">
        <IconCheckCircle class="w-5 h-5" aria-hidden="true" />
        Terima kasih atas ulasanmu!
      </div>
    </template>
  </Card>
</template>

<script setup>
import { IconCheckCircle, IconForum, IconSend, IconStar } from '@/ui/icons';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { useDashboardStore } from '@/features/dashboard/presentation/stores/useDashboardStore';
import { storeToRefs } from 'pinia';
import { Button, Card, Skeleton, EmptyState } from '@/ui';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const { feedbacks, isLoadingFeedbacks: loadingFeedbacks, isSubmittingFeedback: submitting } = storeToRefs(dashboardStore);
const formMessage = ref('');
const formRating = ref(0);
const submitted = ref(false);

const isAdmin = computed(() => authStore.user?.role === 'admin');

const submitFeedback = async () => {
  if (!formMessage.value.trim()) return;
  const ok = await dashboardStore.submitFeedback({
    message: formMessage.value.trim(),
    rating: formRating.value > 0 ? formRating.value : undefined,
  });
  if (ok) submitted.value = true;
};

const hideFeedback = (id) => dashboardStore.hideFeedback(id);

onMounted(() => dashboardStore.fetchFeedbacks());
</script>
