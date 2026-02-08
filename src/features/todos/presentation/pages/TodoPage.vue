<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          To-do List Berdua
        </h1>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 p-6">
      <!-- Input Section -->
      <div class="mb-6">
        <form @submit.prevent="handleAddTodo" class="flex flex-col gap-3">
          <div class="flex gap-2">
            <div class="w-full space-y-2">
              <input v-model="newTodoTitle" type="text" placeholder="Apa yang ingin kita selesaikan hari ini?"
                class="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500"
                :disabled="todoStore.loading" />
              <input v-model="newTodoDescription" type="text" placeholder="Keterangan tambahan (opsional)"
                class="form-input w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500"
                :disabled="todoStore.loading" />
            </div>
            <button type="submit"
              class="btn bg-violet-500 hover:bg-violet-600 text-white whitespace-nowrap h-fit py-2.5"
              :disabled="!newTodoTitle.trim() || todoStore.loading">
              <span v-if="todoStore.loading">Loading...</span>
              <span v-else>Tambah Tugas</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Todo List -->
      <div v-if="todoStore.loading && todoStore.todos.length === 0" class="text-center py-8">
        <div class="inline-flex items-center justify-center">
          <div class="w-4 h-4 border-2 border-violet-500 rounded-full animate-spin border-t-transparent"></div>
          <span class="ml-2 text-gray-500 dark:text-gray-400">Memuat tugas...</span>
        </div>
      </div>

      <div v-else-if="Object.keys(todoStore.groupedTodos).length === 0" class="text-center py-12">
        <div class="text-gray-400 dark:text-gray-500 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01">
            </path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Belum ada tugas</h3>
        <p class="text-gray-500 dark:text-gray-400">Yuk, mulai catat hal-hal yang perlu dilakukan bersama!</p>
      </div>

      <div v-else class="space-y-6">
        <template v-for="(todos, date) in todoStore.groupedTodos" :key="date">
          <div>
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pl-1">
              {{ date }}
            </h3>
            <ul class="space-y-3">
              <li v-for="todo in todos" :key="todo.id"
                class="group flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <input type="checkbox" :checked="todo.isCompleted" @change="todoStore.toggleTodo(todo)"
                    class="mt-1 w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer" />
                  <div class="flex flex-col cursor-pointer select-none" @click="todoStore.toggleTodo(todo)">
                    <span class="text-gray-900 dark:text-gray-100 font-medium"
                      :class="{ 'line-through text-gray-400 dark:text-gray-500': todo.isCompleted }">
                      {{ todo.title }}
                    </span>
                    <span v-if="todo.description" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2"
                      :class="{ 'line-through text-gray-400/70 dark:text-gray-600': todo.isCompleted }">
                      {{ todo.description }}
                    </span>
                  </div>
                </div>

                <button @click="openDeleteModal(todo)"
                  class="text-gray-400 hover:text-red-500 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="Hapus tugas">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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
import { ref, onMounted } from 'vue';
import { useTodoStore } from '../stores/useTodoStore';
import { useModalStore } from '../../../../stores/modalStore';

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
