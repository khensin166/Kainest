// AuthRepository.js
import { IAuthRepository } from "../../domain/repository/IAuthRepository";
import { UserEntity } from "../../domain/entities/UserEntity";
import {
  left,
  right,
  ServerFailure,
  IncorrectPasswordFailure,
  RateLimitFailure,
} from "../../../../core/error/failure.js";
import {
  LoginResponseModel,
  ProfileUserModel,
} from "../models/AuthResponseModel.js";
import { AuthRemoteSource } from "../source/AuthRemoteSource";

export class AuthRepository extends IAuthRepository {
  constructor() {
    super();
    this.remoteSource = new AuthRemoteSource();
  }

  async login(email, password) {
    try {
      const loginApiResponse = await this.remoteSource.login(email, password);
      const loginModel = LoginResponseModel.fromJSON(loginApiResponse);
      const token = loginModel.token;

      if (!token) {
        return left(new ServerFailure("Login gagal: Token tidak diterima."));
      }

      localStorage.setItem("auth_token", token);
      const profileResult = await this.getProfile();

      if (profileResult.left) {
        return left(profileResult.left);
      }

      const userEntity = profileResult.right;
      return right({ token, user: userEntity });
    } catch (error) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      if (statusCode === 401) {
        // Jika password salah, gunakan pesan dari 'remaining_attempts'
        const specificMessage =
          errorData?.error?.remaining_attempts ||
          errorData?.message ||
          "Password salah.";
        return left(new IncorrectPasswordFailure(specificMessage));
      }

      if (statusCode === 429) {
        // Jika terlalu banyak percobaan, ambil waktu countdown
        const retrySeconds = errorData?.error?.retry_after_seconds || 60;
        return left(new RateLimitFailure(errorData.message, retrySeconds));
      }

      // Untuk semua error lainnya
      return left(
        new ServerFailure(error.message || "Terjadi kesalahan pada server.")
      );
    }
  }

  async getProfile(token) {
    // PERUBAHAN: Tambahkan try-catch untuk menangani error
    try {
      const profileApiResponse = await this.remoteSource.getProfile(token);
      const profileModel = ProfileUserModel.fromJSON(profileApiResponse.data);

      const userEntity = new UserEntity({
        id: profileModel.id,
        name: profileModel.name,
        email: profileModel.email,
        role: profileModel.roleName,
        username: profileModel.username,
        phone: profileModel.phone || "",
        gender: profileModel.gender || "",
        dateOfBirth: profileModel.dateOfBirth || "",
        photo: profileModel.photo || "",
      });

      // PERUBAHAN: Kembalikan data sukses dalam 'right'
      return right(userEntity);
    } catch (error) {
      // PERUBAHAN: Kembalikan error dalam 'left'
      return left(new ServerFailure(error.message));
    }
  }

  async logout() {
    // Panggil API untuk memberitahu server agar menghapus sesi/token
    await this.remoteSource.logout();
    // Hapus token dari penyimpanan lokal
    localStorage.removeItem("auth_token");
  }
}
