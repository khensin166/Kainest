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
    // Kita coba kirim parameter folder yang diinginkan: 'kainest_notes'
    const targetFolder = "kainest_notes";
    console.log("Requesting signature for folder:", targetFolder);

    const { data: signData } = await apiClient.post("/profile/signature", {
        folder: targetFolder
    });
    
    console.log("Signature received:", signData);

    if (!signData.success) {
      throw new Error("Gagal mendapatkan signature dari server.");
    }

    // 2. Siapkan FormData untuk dikirim ke Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    
    // PENTING: Jika backend tanda tangan menyertakan folder, kita WAJIB kirim folder yang SAMA.
    // Jika backend mengabaikan request body kita dan tetap sign 'kainest_avatars', 
    // maka kita harus menyesuaikan di sini. Untuk sekarang kita coba kirim sesuai target.
    formData.append("folder", targetFolder);

    // Debug: Cek isi formData
    console.log("FormData entries:");
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    // 3. Upload langsung ke Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
    
    // PENTING: Gunakan axios murni, BUKAN apiClient
    const uploadResponse = await axios.post(uploadUrl, formData);

    // 4. Kembalikan data dalam format yang DIMINTA oleh Editor.js
    return {
      success: 1,
      file: {
        url: uploadResponse.data.secure_url,
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