import axios from "axios";

export class WaBotRemoteSource {
  /**
   * Membuat instance Axios dinamis berdasarkan URL dan API Key
   */
  _getClient(baseUrl, apiKey = null) {
    const headers = { "Content-Type": "application/json" };

    // Header wajib untuk endpoint selain generate-key
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    // Normalisasi URL (hapus slash di akhir jika ada)
    const cleanUrl = baseUrl.replace(/\/$/, "");

    return axios.create({
      baseURL: cleanUrl,
      headers,
    });
  }

  // 1. Generate API Key Baru
  // Endpoint: POST /api/admin/generate-key
  async generateKey(baseUrl, name, adminSecret) {
    const client = this._getClient(baseUrl);
    const response = await client.post("/api/admin/generate-key", {
      name: name,
      admin_secret: adminSecret,
    });
    return response.data; // Response: { status: true, apiKey: "sk_..." }
  }

  // 3. Cek Daftar Grup
  // Endpoint: GET /api/groups
  async getGroups(baseUrl, apiKey) {
    const client = this._getClient(baseUrl, apiKey);
    const response = await client.get("/api/groups");
    return response.data; // Response: { status: "success", groups: [...] }
  }

  // 2 & 4. Kirim Pesan (Personal & Grup)
  // Endpoint: POST /api/send-message
  async sendMessage(baseUrl, apiKey, payload) {
    const client = this._getClient(baseUrl, apiKey);
    // Payload: { phone, message, isGroup }
    const response = await client.post("/api/send-message", payload);
    return response.data;
  }
}
