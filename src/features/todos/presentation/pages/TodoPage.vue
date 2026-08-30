<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-6">
      <div class="mb-4 sm:mb-0 flex items-center gap-3">
        <h1 class="text-2xl font-bold text-text-primary tracking-tight">
          To-do List Berdua
        </h1>
        <PageGuide :steps="pageGuides.todos" />
      </div>
    </div>

    <div class="bg-surface-card rounded-md border border-border-default p-6">
      <!-- Input Section -->
      <div class="mb-6">
        <form @submit.prevent="handleAddTodo" class="flex flex-col gap-3">
          <div class="flex gap-2">
            <div class="w-full space-y-2">
              <input v-model="newTodoTitle" type="text" placeholder="Apa yang ingin kita selesaikan hari ini?"
                class="form-input w-full rounded-md border-border-default bg-surface-input text-text-primary focus:border-brand-primary focus:ring-brand-primary"
                :disabled="todoStore.loading" />
              <input v-model="newTodoDescription" type="text" placeholder="Keterangan tambahan (opsional)"
                class="form-input w-full text-sm rounded-md border-border-default bg-surface-input text-text-primary focus:border-brand-primary focus:ring-brand-primary"
                :disabled="todoStore.loading" />
            </div>
            <Button variant="primary" type="submit" class="whitespace-nowrap" :disabled="!newTodoTitle.trim() || todoStore.loading">
              <span v-if="todoStore.loading">Loading...</span>
              <span v-else>Tambah Tugas</span>
            </Button>
          </div>
        </form>
      </div>

      <!-- Todo List -->
      <div v-if="todoStore.loading && todoStore.todos.length === 0" class="text-center py-8">
        <div class="inline-flex items-center justify-center">
          <div class="w-4 h-4 border-2 border-brand-primary rounded-full animate-spin border-t-transparent"></div>
          <span class="ml-2 text-text-muted">Memuat tugas...</span>
        </div>
      </div>

      <BaseEmptyState 
        v-else-if="Object.keys(todoStore.groupedTodos).length === 0"
        :icon="IconChecklist"
        title="Belum ada tugas"
        message="Yuk, mulai catat hal-hal yang perlu dilakukan bersama!"
        heightClass="py-12"
      />

      <div v-else class="space-y-6">
        <template v-for="(todos, date) in todoStore.groupedTodos" :key="date">
          <div>
            <h3 class="text-xs font-bold text-text-muted mb-3 pl-1">
              {{ date }}
            </h3>
            <ul class="space-y-3">
              <li v-for="todo in todos" :key="todo.id"
                class="group flex items-start justify-between p-4 bg-surface-subtle rounded-lg hover:bg-surface-hover transition-colors border border-transparent hover:border-border-strong">
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <input type="checkbox" :checked="todo.isCompleted" @change="todoStore.toggleTodo(todo)"
                    class="mt-1 w-5 h-5 rounded border-border-default text-brand-primary focus:ring-brand-primary cursor-pointer" />
                  <div class="flex flex-col cursor-pointer select-none" @click="todoStore.toggleTodo(todo)">
                    <span class="text-text-primary font-medium"
                      :class="{ 'line-through text-text-muted': todo.isCompleted }">
                      {{ todo.title }}
                    </span>
                    <span v-if="todo.description" class="text-sm text-text-muted mt-0.5 line-clamp-2"
                      :class="{ 'line-through text-text-muted/70': todo.isCompleted }">
                      {{ todo.description }}
                    </span>
                  </div>
                </div>

                <button @click="openDeleteModal(todo)"
                  class="text-text-muted hover:text-status-danger focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="Hapus tugas">
                  <IconDelete class="w-5 h-5" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconChecklist, IconDelete } from '@/ui/icons';
import { Button } from '@/ui';
import { ref, onMounted } from 'vue';
import { useTodoStore } from '../stores/useTodoStore';
import { useModalStore } from '../../../../stores/modalStore';
import BaseEmptyState from '@/components/BaseEmptyState.vue';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';

const todoStore = useTodoStore();
const newTodoTitle = ref('');
const newTodoDescription = ref('');

const modalStore = useModalStore();

onMounted(() => {
  todoStore.fetchTodos();
});

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return;
  await todoStore.addTodo(newTodoTitle.value, newTodoDescription.value);
  newTodoTitle.value = ''; // Reset input
  newTodoDescription.value = '';
};

const openDeleteModal = (todo) => {
  modalStore.openDeleteModal({
    title: "Hapus Tugas",
    message: `Apakah Anda yakin ingin menghapus tugas "${todo.title}"?`,
    onConfirm: async () => {
      await todoStore.deleteTodo(todo.id);
    },
  });
};
</script>
