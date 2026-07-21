import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/apiClient';

// WebSocket GOWA (Langsung ke GOWA karena WS tidak kena CORS strict)
const GOWA_WS_URL = import.meta.env.VITE_GOWA_WS_URL || 'wss://gowa.kenantomfie.com/ws';

export const useGowaStore = defineStore('gowa', () => {
  const devices = ref([]);
  const isLoading = ref(false);
  const sockets = ref({});
  const qrCodes = ref({});

  const fetchDevices = async () => {
    isLoading.value = true;
    try {
      const response = await api.get('/wabot/devices');
      if (response.data && response.data.data) {
        devices.value = response.data.data.map(d => ({
          id: d.device_id,
          status: 'CONNECTING', 
          name: d.device_id,
        }));
      }
    } catch (error) {
      console.error('[GOWA] Gagal mengambil daftar device:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const createDevice = async (deviceId) => {
    try {
      await api.post('/wabot/devices', { device_id: deviceId });
      await fetchDevices();
      connectWebSocket(deviceId);
      await fetchQr(deviceId);
    } catch (error) {
      console.error('[GOWA] Gagal membuat device:', error);
      throw error;
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      if (sockets.value[deviceId]) {
        sockets.value[deviceId].close();
        delete sockets.value[deviceId];
      }
      await api.delete(`/wabot/devices/${deviceId}`);
      devices.value = devices.value.filter(d => d.id !== deviceId);
      delete qrCodes.value[deviceId];
    } catch (error) {
      console.error('[GOWA] Gagal menghapus device:', error);
      throw error;
    }
  };

  const logoutDevice = async (deviceId) => {
    try {
      await api.post(`/wabot/devices/${deviceId}/logout`);
      updateDeviceStatus(deviceId, 'UNPAIRED');
      await fetchQr(deviceId);
    } catch (error) {
      console.error('[GOWA] Gagal logout device:', error);
      throw error;
    }
  };

  const fetchQr = async (deviceId) => {
    try {
      const response = await api.get(`/wabot/devices/${deviceId}/login`);
      if (response.data && response.data.data && response.data.data.qr) {
        qrCodes.value[deviceId] = response.data.data.qr;
      }
    } catch (error) {
      console.error(`[GOWA] Gagal mengambil QR untuk ${deviceId}:`, error);
    }
  };

  const connectWebSocket = (deviceId) => {
    if (sockets.value[deviceId]) {
      sockets.value[deviceId].close();
    }

    const wsUrl = `${GOWA_WS_URL}?device_id=${deviceId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`[GOWA WS] Terhubung: ${deviceId}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`[GOWA WS] Pesan dari ${deviceId}:`, data);
        
        if (data.status) {
          updateDeviceStatus(deviceId, data.status);
          
          if (data.status === 'UNPAIRED' && data.qr) {
             qrCodes.value[deviceId] = data.qr;
          } else if (data.status === 'UNPAIRED' && !data.qr) {
             fetchQr(deviceId);
          } else if (data.status === 'CONNECTED') {
             qrCodes.value[deviceId] = null;
          }
        } else if (data.message === 'Connection Success') {
           updateDeviceStatus(deviceId, 'CONNECTED');
           qrCodes.value[deviceId] = null;
        } else if (data.message === 'Scan QR Code') {
           updateDeviceStatus(deviceId, 'UNPAIRED');
           if (data.qr) qrCodes.value[deviceId] = data.qr;
           else fetchQr(deviceId);
        }
      } catch (err) {
        console.error(`[GOWA WS] Error parsing message dari ${deviceId}:`, err);
      }
    };

    ws.onerror = (error) => {
      console.error(`[GOWA WS] Error pada ${deviceId}:`, error);
      updateDeviceStatus(deviceId, 'DISCONNECTED');
    };

    ws.onclose = () => {
      console.log(`[GOWA WS] Terputus: ${deviceId}`);
      updateDeviceStatus(deviceId, 'DISCONNECTED');
      if (devices.value.find(d => d.id === deviceId)) {
        setTimeout(() => connectWebSocket(deviceId), 5000);
      }
    };

    sockets.value[deviceId] = ws;
  };

  const initWebSockets = () => {
    devices.value.forEach(device => {
      connectWebSocket(device.id);
    });
  };

  const cleanupSockets = () => {
    Object.values(sockets.value).forEach(ws => ws.close());
    sockets.value = {};
  };

  const updateDeviceStatus = (deviceId, status) => {
    const device = devices.value.find(d => d.id === deviceId);
    if (device) {
      device.status = status;
    }
  };

  return {
    devices,
    isLoading,
    qrCodes,
    fetchDevices,
    createDevice,
    deleteDevice,
    logoutDevice,
    fetchQr,
    connectWebSocket,
    initWebSockets,
    cleanupSockets,
  };
});
