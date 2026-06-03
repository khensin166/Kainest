// src/features/auth/data/source/AuthRemoteSource.js
import api from "@/lib/apiClient";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  /**
   * Mengambil sesi aktif dari Better Auth via cookie.
   * Dipakai setelah social login callback untuk mendapatkan token
   * dan menyimpannya ke localStorage agar interceptor bisa mengirimnya sebagai Bearer.
   * Menggunakan axios mentah agar cookie dikirim tanpa Authorization header yang mungkin kosong.
   */
  async getSessionToken() {
    const response = await axios.get(`${API_BASE_URL}/auth/get-session`, {
      withCredentials: true, // Penting: kirim cookie session
    });
    // Better Auth mengembalikan { session: { token: "..." }, user: {...} }
    return response.data?.session?.token || null;
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
