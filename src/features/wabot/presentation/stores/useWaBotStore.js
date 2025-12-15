import { defineStore } from 'pinia';
import { ref } from 'vue';
import { WaBotRepository } from '../../data/repository/WaBotRepository';
import { RegisterBotUseCase } from '../../domain/use-cases/RegisterBotUseCase';
import { GetGroupsUseCase } from '../../domain/use-cases/GetGroupsUseCase';
import { SendMessageUseCase } from '../../domain/use-cases/SendMessageUseCase';

export const useWaBotStore = defineStore('wabot', () => {
  // --- STATE ---
  const apiKey = ref(localStorage.getItem('wabot_api_key') || '');
  const baseUrl = ref(localStorage.getItem('wabot_base_url') || '');
  const groups = ref([]);
  const isLoading = ref(false);
  const isSending = ref(false);

  // --- DEPENDENCIES ---
  const repository = new WaBotRepository();
  const registerUseCase = new RegisterBotUseCase(repository);
  const getGroupsUseCase = new GetGroupsUseCase(repository);
  const sendMessageUseCase = new SendMessageUseCase(repository);

  // --- ACTIONS ---
  
  /**
   * Menghubungkan ke Bot (Generate Key)
   */
  async function connectBot(url, appName, adminSecret) {
    isLoading.value = true;
    try {
      const key = await registerUseCase.execute(url, appName, adminSecret);
      
      // Simpan ke State & LocalStorage
      apiKey.value = key;
      baseUrl.value = url;
      localStorage.setItem('wabot_api_key', key);
      localStorage.setItem('wabot_base_url', url);
      
      // Langsung ambil grup setelah connect
      await fetchGroups();
      return true;
    } catch (error) {
      console.error(error);
      throw error; // Lempar error ke UI
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Mengambil Daftar Grup
   */
  async function fetchGroups() {
    if (!apiKey.value || !baseUrl.value) return;
    
    isLoading.value = true;
    try {
      const result = await getGroupsUseCase.execute(baseUrl.value, apiKey.value);
      groups.value = result;
    } catch (error) {
      console.error("Gagal ambil grup:", error);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Mengirim Pesan
   */
  async function sendMessage(target, message, isGroup) {
    isSending.value = true;
    try {
      await sendMessageUseCase.execute(baseUrl.value, apiKey.value, {
        phone: target,
        message,
        isGroup
      });
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      isSending.value = false;
    }
  }

  function logout() {
    apiKey.value = '';
    groups.value = [];
    localStorage.removeItem('wabot_api_key');
  }

  return {
    apiKey,
    baseUrl,
    groups,
    isLoading,
    isSending,
    connectBot,
    fetchGroups,
    sendMessage,
    logout
  };
});