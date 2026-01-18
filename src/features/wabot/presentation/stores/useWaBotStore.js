// src/features/wabot/presentation/stores/useWaBotStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/lib/apiClient";
import { 
  registerBotUseCase, 
  getGroupsUseCase, 
  sendMessageUseCase, 
  waBotRepository 
} from "../../../../core/di/di";

export const useWaBotStore = defineStore("wabot", () => {
  // --- STATE ---
  const apiKey = ref(localStorage.getItem("wabot_api_key") || "");
  const baseUrl = ref(localStorage.getItem("wabot_base_url") || "");
  const adminSecret = ref(localStorage.getItem("wabot_admin_secret") || "");

  const apiKeysList = ref([]); // State untuk list key
  const groups = ref([]);
  const isLoading = ref(false);
  const isSending = ref(false);

  // --- DEPENDENCIES (Injected) ---
  const repositoryInstance = waBotRepository;
  const registerUseCaseInstance = registerBotUseCase;
  const getGroupsUseCaseInstance = getGroupsUseCase;
  const sendMessageUseCaseInstance = sendMessageUseCase;

  // --- ACTIONS ---

  // 1. Sync Config dari Database Kainest
  async function loadConfig() {
    try {
      const { data } = await apiClient.get("/wabot/config");
      if (data.success && data.data) {
        const {
          baseUrl: dbUrl,
          adminSecret: dbSecret,
          apiKey: dbKey,
        } = data.data;

        // Normalisasi URL
        const normalizedUrl = dbUrl ? dbUrl.replace(/\/$/, "") : "";

        if (normalizedUrl && normalizedUrl !== baseUrl.value) {
          baseUrl.value = normalizedUrl;
          localStorage.setItem("wabot_base_url", normalizedUrl);
        }

        if (dbSecret) {
          adminSecret.value = dbSecret;
          localStorage.setItem("wabot_admin_secret", dbSecret);
        }

        // Logic Baru: Jika di DB ada Key, pakai itu!
        if (dbKey && dbKey !== apiKey.value) {
          apiKey.value = dbKey;
          localStorage.setItem("wabot_api_key", dbKey);
        }
      }
    } catch (error) {
      console.error("Gagal sync config:", error);
    }
  }

  // 2. Simpan Config ke Database Kainest
  async function saveConfigToDb(url, secret, key) {
    try {
      await apiClient.post("/wabot/config", {
        baseUrl: url,
        adminSecret: secret,
        apiKey: key, // Kirim key juga
      });

      // Update Local State
      baseUrl.value = url;
      adminSecret.value = secret;
      if (key) apiKey.value = key;

      localStorage.setItem("wabot_base_url", url);
      localStorage.setItem("wabot_admin_secret", secret);
      if (key) localStorage.setItem("wabot_api_key", key);
    } catch (error) {
      throw error;
    }
  }

  // 3. Connect/Generate Key (Ke Railway)
  // 3. Connect/Generate Key (Ke Railway)
  async function connectBot(url, appName, secret) {
    isLoading.value = true;
    try {
      // Normalisasi URL
      const cleanUrl = url.replace(/\/$/, "");
      const key = await registerUseCaseInstance.execute(cleanUrl, appName, secret);

      // Simpan URL & Secret & Key ke DB Kainest
      await saveConfigToDb(cleanUrl, secret, key);

      return true;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // 4. Fetch Groups (Ke Railway)
  async function fetchGroups() {
    // Cek validitas data sebelum request
    if (!apiKey.value || !baseUrl.value) return;

    // --- TAMBAHKAN LOG INI ---
    console.log("Mencoba fetch group ke:", baseUrl.value);
    console.log("Menggunakan API Key:", apiKey.value);
    // -------------------------

    isLoading.value = true;
    try {
      const result = await getGroupsUseCaseInstance.execute(
        baseUrl.value,
        apiKey.value
      );
      groups.value = result;
    } catch (error) {
      console.error("Gagal ambil grup:", error);
      // Jika 403, mungkin key salah/expired.
      // Opsional: apiKey.value = "";
    } finally {
      isLoading.value = false;
    }
  }

  // 5. Send Message
  async function sendMessage(target, message, isGroup) {
    isSending.value = true;
    try {
      await sendMessageUseCaseInstance.execute(baseUrl.value, apiKey.value, {
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

  // 6. PERBAIKAN ACTION: Fetch All Keys (Pakai Repository)
  async function fetchApiKeysList() {
    if (!baseUrl.value || !adminSecret.value) {
      alert("Base URL dan Admin Secret harus diisi dulu!");
      return;
    }

    isLoading.value = true;
    try {
      // Panggil Repository, bukan Axios langsung
      const keys = await repositoryInstance.getAllApiKeys(
        baseUrl.value,
        adminSecret.value
      );

      apiKeysList.value = keys; // Repository sudah mengembalikan array data
    } catch (error) {
      console.error("Gagal ambil list key:", error);
      alert("Gagal mengambil list API Key. Pastikan Admin Secret benar.");
    } finally {
      isLoading.value = false;
    }
  }

  // 7. ACTION BARU: Select Key dari List
  async function selectApiKey(selectedKey) {
    // Update State
    apiKey.value = selectedKey;
    localStorage.setItem("wabot_api_key", selectedKey);

    // Simpan ke DB Kainest agar sinkron
    await saveConfigToDb(baseUrl.value, adminSecret.value, selectedKey);

    // Refresh grup dengan key baru
    await fetchGroups();
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
    apiKeysList, // Export ini
    isLoading,
    isSending,
    loadConfig,
    connectBot,
    fetchGroups,
    sendMessage,
    fetchApiKeysList, // Export ini
    selectApiKey, // Export ini
    logout,
  };
});
