// features\settings\data\repository\SettingsRepository.js
import { ISettingsRepository } from "../../domain/repository/ISettingsRepository";
import {
  left,
  right,
  ServerFailure,
  IncorrectPasswordFailure,
  GeneralFailure,
} from "../../../../core/error/failure";
import { SettingsRemoteSource } from "../source/SettingsRemoteSource";

export class SettingsRepository extends ISettingsRepository {
  constructor() {
    super();
    this.remoteSource = new SettingsRemoteSource();
  }

  async changePassword(passwords) {
    try {
      const response = await this.remoteSource.changePassword(passwords);
      // Jika berhasil, kita hanya butuh pesannya
      return right({ message: response.message });
    } catch (error) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      // Tangani kasus spesifik "invalid current password"
      if (statusCode === 400) {
        return left(
          new IncorrectPasswordFailure(
            errorData.message || "Password saat ini salah."
          )
        );
      }

      // Untuk error lainnya (token expired, dll)
      return left(
        new ServerFailure(errorData.message || "Gagal mengubah password.")
      );
    }
  }

  // --- TAMBAHAN BARU: Implementasi Update Profile ---
  async updateProfile(profileData) {
    try {
      const response = await this.remoteSource.updateProfile(profileData);
      if (response.success) {
        // Asumsi backend mengembalikan data user lengkap di 'profile'
        return right(response.profile);
      } else {
        return left(new ServerFailure(response.message || "Gagal update profil."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  // --- TAMBAHAN BARU: Implementasi Alur Upload Avatar ---
  async uploadAvatar(file) {
    try {
      // 1. Dapatkan signature dari backend
      const signResponse = await this.remoteSource.getUploadSignature();
      if (!signResponse.success) {
        return left(new ServerFailure("Gagal mendapatkan izin upload."));
      }

      // 2. Upload file ke Cloudinary
      const uploadResponse = await this.remoteSource.uploadToCloudinary(
        file,
        signResponse
      );

      // 3. Kembalikan URL yang aman
      if (uploadResponse.secure_url) {
        return right({ url: uploadResponse.secure_url });
      } else {
        return left(new GeneralFailure("Gagal upload ke Cloudinary."));
      }
    } catch (error) {
      return left(new ServerFailure(error.message || "Proses upload gagal."));
    }
  }

  async getProfile() {
    try {
      const response = await this.remoteSource.getProfile();
      if (response.success) {
        // Kembalikan data 'profile' yang di-nest
        return right(response.profile); 
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil profil."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server saat ambil profil."));
    }
  }
}
