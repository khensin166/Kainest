// src/features/auth/data/source/AuthRemoteSource.js
import api from "@/lib/apiClient";

export class AuthRemoteSource {
  async login(email, password) {
    const response = await api.post("/auth/sign-in/email", {
      email,
      password,
    });
    return response.data;
  }

  async register(email, password, displayName) {
    const response = await api.post("/auth/sign-up/email", {
      email,
      password,
      name: displayName,
    });
    return response.data;
  }

  async socialLogin(provider, callbackURL) {
    const response = await api.post("/auth/sign-in/social", {
      provider,
      callbackURL,
    });
    return response.data; // { url: "...", redirect: true }
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

  async logout() {
    // Memberikan body kosong `{}` agar Axios tetap mengirim header 'Content-Type: application/json'
    const response = await api.post("/auth/sign-out", {});
    return response.data;
  }
}
