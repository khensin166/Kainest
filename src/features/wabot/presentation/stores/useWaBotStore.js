// useWaBotStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/lib/apiClient"; // Konek ke Kainest Backend
import { WaBotRepository } from "../../data/repository/WaBotRepository";
import { RegisterBotUseCase } from "../../domain/use-cases/RegisterBotUseCase";
import { GetGroupsUseCase } from "../../domain/use-cases/GetGroupsUseCase";
import { SendMessageUseCase } from "../../domain/use-cases/SendMessageUseCase";

export const useWaBotStore = defineStore("wabot", () => {
  // --- STATE ---
  // Default ambil dari LocalStorage agar cepat
  const apiKey = ref(localStorage.getItem("wabot_api_key") || "");
  const baseUrl = ref(localStorage.getItem("wabot_base_url") || "");
  const adminSecret = ref(localStorage.getItem("wabot_admin_secret") || "");

  const groups = ref([]);
  const isLoading = ref(false);
  const isSending = ref(false);

  // --- DEPENDENCIES ---
  const repository = new WaBotRepository();
  const registerUseCase = new RegisterBotUseCase(repository);
  const getGroupsUseCase = new GetGroupsUseCase(repository);
  const sendMessageUseCase = new SendMessageUseCase(repository);

  // --- ACTIONS ---

  // 1. Sync Config dari Database Kainest
  async function loadConfig() {
    try {
      const { data } = await apiClient.get("/wabot/config");

      // --- PERBAIKAN DI SINI ---
      // Cek 'data.success' (boolean), bukan 'data.status'
      if (data.success && data.data) {
        const { baseUrl: dbUrl, adminSecret: dbSecret } = data.data;

        // Update state & LocalStorage jika berbeda
        // Kita gunakan normalisasi agar URL konsisten
        const normalizedUrl = dbUrl.replace(/\/$/, "");

        if (normalizedUrl !== baseUrl.value) {
          console.log("Store: Base URL updated from DB ->", normalizedUrl); // Debugging
          baseUrl.value = normalizedUrl;
          localStorage.setItem("wabot_base_url", normalizedUrl);
        }

        if (dbSecret) {
          adminSecret.value = dbSecret;
          localStorage.setItem("wabot_admin_secret", dbSecret);
        }
      }
    } catch (error) {
      console.error("Gagal sync config:", error);
    }
  }

  // 2. Simpan Config ke Database Kainest
  async function saveConfigToDb(url, secret) {
    try {
      await apiClient.post("/wabot/config", {
        baseUrl: url,
        adminSecret: secret,
      });
      // Update State Lokal
      baseUrl.value = url;
      adminSecret.value = secret;
      localStorage.setItem("wabot_base_url", url);
      localStorage.setItem("wabot_admin_secret", secret);
    } catch (error) {
      throw error;
    }
  }

  // 3. Connect ke Railway (Generate Key)
  async function connectBot(url, appName, secret) {
    isLoading.value = true;
    try {
      // Hit API Railway: POST /api/admin/generate-key
      const key = await registerUseCase.execute(url, appName, secret);

      // Simpan Key di Browser
      apiKey.value = key;
      localStorage.setItem("wabot_api_key", key);

      // Simpan URL di Database Kainest
      await saveConfigToDb(url, secret);

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // 4. Fetch Groups dari Railway
  async function fetchGroups() {
    if (!apiKey.value || !baseUrl.value) return;

    isLoading.value = true;
    try {
      // Hit API Railway: GET /api/groups
      const result = await getGroupsUseCase.execute(
        baseUrl.value,
        apiKey.value
      );
      groups.value = result;
    } catch (error) {
      console.error("Gagal ambil grup:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // 5. Send Message ke Railway
  async function sendMessage(target, message, isGroup) {
    isSending.value = true;
    try {
      // Hit API Railway: POST /api/send-message
      await sendMessageUseCase.execute(baseUrl.value, apiKey.value, {
        phone: target,
        message,
        isGroup,
      });
      return true;
    } catch (error) {
      throw error;
    } finally {
      isSending.value = false;
    }
  }

  function logout() {
    apiKey.value = "";
    localStorage.removeItem("wabot_api_key");
    groups.value = [];
  }

  return {
    apiKey,
    baseUrl,
    adminSecret,
    groups,
    isLoading,
    isSending,
    loadConfig,
    connectBot,
    fetchGroups,
    sendMessage,
    logout,
  };
});
