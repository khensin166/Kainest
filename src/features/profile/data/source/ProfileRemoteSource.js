import apiClient from "../../../../lib/apiClient";
import axios from "axios";

export class ProfileRemoteSource {
  async getProfile() {
    try {
      const response = await apiClient.get("/profile");
      return response.data; // Mengembalikan { success: true, profile: {...} }
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileApiPayload) {
    try {
      const response = await apiClient.patch("/profile", profileApiPayload);
      return response.data; // Mengembalikan { success: true, profile: {...} }
    } catch (error) {
      throw error;
    }
  }

  async getUploadSignature() {
    try {
      const response = await apiClient.post("/profile/signature");
      return response.data; // Mengembalikan { success: true, signature, ... }
    } catch (error) {
      throw error;
    }
  }

  async uploadToCloudinary(file, signData) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("folder", "kainest_avatars");

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
      
      const response = await axios.post(uploadUrl, formData);
      return response.data; // Mengembalikan data file dari Cloudinary
    } catch (error) {
      throw error;
    }
  }
}