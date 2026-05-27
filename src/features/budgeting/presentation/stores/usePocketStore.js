import { defineStore } from "pinia";
import {
  getPocketsUseCase,
  upsertPocketUseCase,
  deletePocketUseCase,
  bulkSetupPocketsUseCase,
  updateCategoryKeywordsUseCase
} from "../../../../core/di/di";
import { toast } from "vue3-toastify";

export const usePocketStore = defineStore("pocket", {
  state: () => ({
    pockets: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchPockets() {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await getPocketsUseCase.execute();
        if (result.right) {
          this.pockets = result.right;
        } else {
          this.error = result.left?.message;
          toast.error(this.error);
        }
      } catch (err) {
        this.error = err.message || "Failed to fetch pockets";
        toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async upsertPocket(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await upsertPocketUseCase.execute(data);
        if (result.right) {
          toast.success("Kantong berhasil disimpan");
          await this.fetchPockets();
          return true;
        } else {
          this.error = result.left?.message;
          toast.error(this.error);
          return false;
        }
      } catch (err) {
        this.error = err.message || "Failed to save pocket";
        toast.error(this.error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePocket(categoryId) {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await deletePocketUseCase.execute(categoryId);
        if (result.right) {
          toast.success("Kantong berhasil dihapus");
          await this.fetchPockets();
          return true;
        } else {
          this.error = result.left?.message;
          toast.error(this.error);
          return false;
        }
      } catch (err) {
        this.error = err.message || "Failed to delete pocket";
        toast.error(this.error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async bulkSetupPockets(data) {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await bulkSetupPocketsUseCase.execute(data);
        if (result.right) {
          toast.success("Setup kantong berhasil");
          await this.fetchPockets();
          return true;
        } else {
          this.error = result.left?.message;
          toast.error(this.error);
          return false;
        }
      } catch (err) {
        this.error = err.message || "Failed to setup pockets";
        toast.error(this.error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async updateKeywords(categoryId, keywords) {
      this.isLoading = true;
      this.error = null;
      try {
        const result = await updateCategoryKeywordsUseCase.execute(categoryId, keywords);
        if (result.right) {
          toast.success("Kata kunci berhasil diperbarui");
          await this.fetchPockets();
          return true;
        } else {
          this.error = result.left?.message;
          toast.error(this.error);
          return false;
        }
      } catch (err) {
        this.error = err.message || "Failed to update keywords";
        toast.error(this.error);  
        return false;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
