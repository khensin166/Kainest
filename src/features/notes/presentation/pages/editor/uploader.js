// src/features/notes/presentation/pages/editor/uploader.js
import apiClient from "@/lib/apiClient"; // API client Anda yang sudah ada
import axios from "axios"; // Axios murni untuk upload ke Cloudinary

/**
 * Fungsi uploader kustom untuk Editor.js (Image & File)
 * Ini mengikuti alur "Modern / Signed Upload"
 */
export async function customUploader(file) {
  try {
    // 1. Minta izin/signature dari backend Hono Anda
    // (Menggunakan apiClient yang sudah ada, yang menyertakan token auth)
    const { data: signData } = await apiClient.post("/profile/signature");

    if (!signData.success) {
      throw new Error("Gagal mendapatkan signature dari server.");
    }

    // 2. Siapkan FormData untuk dikirim ke Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", "kainest_notes"); // Folder khusus untuk notes

    // 3. Upload langsung ke Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
    
    // PENTING: Gunakan axios murni, BUKAN apiClient
    const uploadResponse = await axios.post(uploadUrl, formData);

    // 4. Kembalikan data dalam format yang DIMINTA oleh Editor.js
    return {
      success: 1,
      file: {
        url: uploadResponse.data.secure_url,
        // Anda bisa tambahkan data lain di sini jika perlu
        // name: uploadResponse.data.original_filename,
        // size: uploadResponse.data.bytes,
      },
    };
  } catch (error) {
    console.error("Upload ke Cloudinary gagal:", error);
    // Kembalikan format error yang DIMINTA oleh Editor.js
    return {
      success: 0,
      message: error.message || "Upload gagal.",
    };
  }
}