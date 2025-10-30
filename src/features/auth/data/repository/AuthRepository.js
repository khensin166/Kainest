// 📄 feature/auth/data/repository/AuthRepository.js

import { IAuthRepository } from "../../domain/repository/IAuthRepository";
import { UserEntity } from "../../domain/entities/UserEntity";
import {
  left,
  right,
  ServerFailure,
  IncorrectPasswordFailure,
  NetworkFailure,
} from "../../../../core/error/failure.js";
import { AuthRemoteSource } from "../source/AuthRemoteSource";

export class AuthRepository extends IAuthRepository {
  constructor() {
    super();
    this.remoteSource = new AuthRemoteSource();
  }

  /**
   * Menangani login ke Hono API, menyimpan token, dan mengambil profil user.
   */
  async login(email, password) {
    try {
      // 1. Panggil API /auth/login
      //    Respons yang diharapkan: { success: true, token: "..." }
      const response = await this.remoteSource.login(email, password);

      if (!response.success || !response.token) {
        throw new Error(response.message || "Token tidak diterima dari server.");
      }

      // 2. Simpan token ke localStorage
      localStorage.setItem("authToken", response.token);

      // 3. Ambil data profil user dengan token yang baru disimpan
      //    (Interceptor axios akan otomatis menambahkannya ke header)
      const profileData = await this.remoteSource.getProfile();

      // 4. Buat UserEntity dari data profil
      //    ASUMSI: Endpoint /auth/me Anda mengembalikan data dengan field ini.
      //    Sesuaikan 'profileData.displayName' dll dengan respons API Anda.
      const userEntity = new UserEntity({
        id: profileData.id,
        email: profileData.email,
        displayName: profileData.displayName, // e.g., dari profileData.display_name
        avatarUrl: profileData.avatarUrl,   // e.g., dari profileData.avatar_url
        partnerId: profileData.partnerId,   // e.g., dari profileData.partner_id
      });

      return right(userEntity);

    } catch (error) {
      if (error.response) {
        // Error dari server (misal: 401, 400)
        const message = error.response.data?.message || "Email atau password salah.";
        if (error.response.status === 401) {
           return left(new IncorrectPasswordFailure(message));
        }
        return left(new ServerFailure(message));
      } else if (error.request) {
        // Error jaringan (tidak ada respons)
        return left(new NetworkFailure());
      } else {
        // Error JavaScript lainnya
        return left(new ServerFailure(error.message || "Gagal melakukan login."));
      }
    }
  }

  /**
   * Menangani registrasi ke Hono API.
   */
  async register(email, password, displayName) {
    try {
      await this.remoteSource.register(
        email,
        password,
        displayName
      );

      // Registrasi sukses. Kita kembalikan 'true'.
      // Store akan mengarahkan ke halaman login.
      return right(true);
    } catch (error) {
       if (error.response) {
        const message = error.response.data?.message || "Registrasi gagal.";
        return left(new ServerFailure(message));
      } else if (error.request) {
        return left(new NetworkFailure());
      } else {
        return left(
          new ServerFailure(error.message || "Gagal melakukan registrasi.")
        );
      }
    }
  }

  /**
   * Mendapatkan user saat ini dengan memvalidasi token di localStorage.
   */
  async getCurrentUser() {
    try {
      // 1. Cek apakah token ada
      const token = localStorage.getItem("authToken");
      if (!token) {
        return right(null); // Tidak ada user yang login, ini bukan error.
      }

      // 2. Token ada, panggil /auth/me untuk validasi dan ambil profil
      const profileData = await this.remoteSource.getProfile();

      // 3. Buat UserEntity (sesuaikan field jika perlu)
      const userEntity = new UserEntity({
        id: profileData.id,
        email: profileData.email,
        displayName: profileData.displayName,
        avatarUrl: profileData.avatarUrl,
        partnerId: profileData.partnerId,
      });

      return right(userEntity);

    } catch (error) {
      // Jika error.response.status adalah 401/403, token tidak valid.
      // Interceptor kita akan menghapus token, tapi di sini kita
      // anggap saja user tidak terautentikasi.
      if (error.response && [401, 403].includes(error.response.status)) {
        localStorage.removeItem("authToken"); // Hapus token mati
        return right(null); // Bukan error, hanya tidak login
      }
      // Error lain (misal server down) adalah Failure
      return left(new ServerFailure(error.message || "Gagal mengambil sesi user."));
    }
  }

  /**
   * Logout user dengan menghapus token dari localStorage.
   */
  async logout() {
    try {
      localStorage.removeItem("authToken");
      return right(true); // Sukses
    } catch (error) {
      return left(new ServerFailure(error.message || "Gagal menghapus sesi lokal."));
    }
  }
}