// src/features/todos/presentation/stores/useTodoStore.js
import { defineStore } from "pinia";
import { TodoRepository } from "../../data/repository/TodoRepository";
import { notify } from "@/lib/notify";
import moment from "moment";
import "moment/locale/id"; // Gunakan locale Indonesia

moment.locale("id");

const repository = new TodoRepository();

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    loading: false,
    error: null,
  }),
  getters: {
    groupedTodos: (state) => {
      // 1. Sort todos: yang belum selesai di atas, lalu berdasarkan tanggal dibuat (terbaru di atas)
      const sortedTodos = [...state.todos].sort((a, b) => {
        if (a.isCompleted === b.isCompleted) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isCompleted ? 1 : -1;
      });

      // 2. Group by date
      const groups = {};
      sortedTodos.forEach((todo) => {
        const date = moment(todo.createdAt);
        let key = date.format("dddd, D MMMM YYYY");

        if (date.isSame(moment(), "day")) {
          key = "Hari Ini";
        } else if (date.isSame(moment().subtract(1, "days"), "day")) {
          key = "Kemarin";
        }

        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(todo);
      });

      return groups;
    },
  },
  actions: {
    async fetchTodos() {
      this.loading = true;
      this.error = null;
      const result = await repository.getTodos();
      
      result.fold(
        (err) => {
          this.error = err.message;
          notify.error(err.message, err);
        },
        (data) => {
          this.todos = data;
        }
      );
      this.loading = false;
    },

    async addTodo(title, description = null) {
      this.loading = true;
      const result = await repository.createTodo({ title, description });
      
      result.fold(
        (err) => {
          notify.error(err.message, err);
        },
        (newTodo) => {
          this.todos.unshift(newTodo);
          notify.success("Tugas berhasil ditambahkan");
        }
      );
      this.loading = false;
    },

    async toggleTodo(todo) {
      // Optimistic update
      const originalStatus = todo.isCompleted;
      todo.isCompleted = !originalStatus;

      const result = await repository.updateTodo(todo.id, {
        is_completed: todo.isCompleted
      });

      result.fold(
        (err) => {
          // Revert jika gagal
          todo.isCompleted = originalStatus;
          notify.error(err.message, err);
        },
        (updatedTodo) => {
           // Update data dari server untuk memastikan sinkron
           const index = this.todos.findIndex(t => t.id === updatedTodo.id);
           if (index !== -1) {
             this.todos[index] = updatedTodo;
           }
        }
      );
    },

    async deleteTodo(todoId) {
      // confirm dialog ditangani di UI (TodoPage.vue) menggunakan GlobalDeleteModal

      this.loading = true;
      const result = await repository.deleteTodo(todoId);

      result.fold(
        (err) => {
          notify.error(err.message, err);
        },
        () => {
          this.todos = this.todos.filter(t => t.id !== todoId);
          notify.success("Tugas dihapus");
        }
      );
      this.loading = false;
    }
  },
});
