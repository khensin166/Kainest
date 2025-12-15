import axios from 'axios';

export class WaBotRemoteSource {
  // Helper untuk membuat instance axios dinamis
  _getClient(baseUrl, apiKey = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    // Hapus slash di akhir URL jika ada
    const cleanUrl = baseUrl.replace(/\/$/, "");
    
    return axios.create({
      baseURL: cleanUrl, // URL Dinamis dari input user
      headers
    });
  }

  async generateKey(baseUrl, name, adminSecret) {
    const client = this._getClient(baseUrl);
    const response = await client.post('/api/admin/generate-key', {
      name,
      admin_secret: adminSecret
    });
    return response.data;
  }

  async getGroups(baseUrl, apiKey) {
    const client = this._getClient(baseUrl, apiKey);
    const response = await client.get('/api/groups');
    return response.data;
  }

  async sendMessage(baseUrl, apiKey, { phone, message, isGroup }) {
    const client = this._getClient(baseUrl, apiKey);
    const response = await client.post('/api/send-message', {
      phone,
      message,
      isGroup
    });
    return response.data;
  }
}