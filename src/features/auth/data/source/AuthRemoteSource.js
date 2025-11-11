// src/features/auth/data/source/AuthRemoteSource.js
import api from "@/lib/apiClient";

export class AuthRemoteSource {
  async login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data; // Mengembalikan { success: true, token: "..." }
  }

  async register(email, password, displayName) {
    const response = await api.post("/auth/register", {
      email,
      password,
      name: displayName,
    });
    return response.data;
  }

  async getProfile() {
    // Panggil endpoint /profile untuk data LENGKAP, BUKAN /auth/me
    const response = await api.get("/profile");

    // Respons dari /profile adalah { success: true, profile: {...} }
    // Kita harus mengembalikan data 'profile' di dalamnya
    if (response.data.success) {
      return response.data.profile; // Kembalikan objek 'profile' yang nested
    } else {
      throw new Error(response.data.message || "Gagal mengambil data profil.");
    }
  }
}
