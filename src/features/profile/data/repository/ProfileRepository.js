// src/features/profile/data/repository/ProfileRepository.js 
import { IProfileRepository } from "../../domain/repository/IProfileRepository";
import { ProfileRemoteSource } from "../source/ProfileRemoteSource";
import { mapProfileFromApi, mapProfileToApi } from "../mappers/ProfileMapper";
import {
  left,
  right,
  ServerFailure,
  GeneralFailure,
} from "../../../../core/error/failure"; // Pastikan failure.js Anda memiliki GeneralFailure

export class ProfileRepository extends IProfileRepository {
  constructor() {
    super();
    this.remoteSource = new ProfileRemoteSource();
  }

  /**
   * Mengambil profil dari API, mengembalikan ProfileEntity
   */
  async getProfile() {
    try {
      const response = await this.remoteSource.getProfile();
      if (response.success) {
        // Gunakan mapper untuk mengubah respons API mentah menjadi Entity
        const entity = mapProfileFromApi(response.profile);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil profil."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  /**
   * Mengupdate profil
   */
  async updateProfile(profileData) {
    try {
      // 1. Map data camelCase dari form ke snake_case untuk API
      const apiPayload = mapProfileToApi(profileData);

      // 2. Kirim payload
      const response = await this.remoteSource.updateProfile(apiPayload);
      if (response.success) {
        // 3. Map balikan API ke Entity
        const entity = mapProfileFromApi(response.profile);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal update profil."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  /**
   * Mengurus alur upload (tanpa menyimpan URL, itu tugas use case)
   */
  async uploadAvatar(file) {
    try {
      // 1. Dapatkan signature
      const signResponse = await this.remoteSource.getUploadSignature();
      if (!signResponse.success) {
        return left(new ServerFailure("Gagal mendapatkan izin upload."));
      }

      // 2. Upload ke Cloudinary
      const uploadResponse = await this.remoteSource.uploadToCloudinary(
        file,
        signResponse
      );

      // 3. Kembalikan URL
      if (uploadResponse.secure_url) {
        return right({ url: uploadResponse.secure_url });
      } else {
        return left(new GeneralFailure("Gagal upload ke Cloudinary."));
      }
    } catch (error) {
      return left(new ServerFailure(error.message || "Proses upload gagal."));
    }
  }
}