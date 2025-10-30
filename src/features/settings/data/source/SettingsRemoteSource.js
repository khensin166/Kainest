// features\settings\data\source\SettingsRemoteSource.js
import apiClient from "../../../../lib/apiClient";
import axios from "axios";

export class SettingsRemoteSource {

  async getProfile() {
    try {
      // Panggil endpoint data profil LENGKAP
      const response = await apiClient.get("/profile");
      return response.data; // Mengembalikan { success: true, profile: {...} }
    } catch (error) {
      throw error;
    }
  }

  async changePassword({ currentPassword, newPassword, confirmationPassword }) {
    try {
      const response = await apiClient.put("/user/admin/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        confirmation_password: confirmationPassword,
      });
      return response.data;
    } catch (error) {
      // Lempar error asli agar repository bisa memeriksanya
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      // Kita gunakan PATCH /profile (dari backend Hono kita)
      const response = await apiClient.patch("/profile", profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // --- TAMBAHAN BARU: Minta Izin Upload (Signature) ---
  async getUploadSignature() {
    try {
      // Ini memanggil endpoint POST /profile/signature
      const response = await apiClient.post("/profile/signature");
      return response.data; // Mengembalikan { success: true, signature, timestamp, ... }
    } catch (error) {
      throw error;
    }
  }

  // --- TAMBAHAN BARU: Upload Langsung ke Cloudinary ---
  async uploadToCloudinary(file, signData) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("folder", "kainest_avatars"); // Sesuaikan dengan backend

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;

      // PENTING: Gunakan axios murni, BUKAN apiClient
      // karena ini request ke domain eksternal (Cloudinary)
      const response = await axios.post(uploadUrl, formData);
      return response.data; // Mengembalikan data file dari Cloudinary
    } catch (error) {
      throw error;
    }
  }
}
