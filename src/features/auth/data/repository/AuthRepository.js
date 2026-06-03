// 📄 feature/auth/data/repository/AuthRepository.js

import { IAuthRepository } from "../../domain/repository/IAuthRepository";
import { mapUserFromApi } from "../mappers/AuthMapper";
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
  async login(email, password, rememberMe = false) {
    try {
      // 1. Panggil API /auth/login
      const response = await this.remoteSource.login(email, password);

      if (!response.user || !response.token) {
        throw new Error(
          response.message || "Token tidak diterima dari server."
        );
      }

      // 2. Simpan token ke localStorage atau sessionStorage
      if (rememberMe) {
        localStorage.setItem("authToken", response.token);
      } else {
        sessionStorage.setItem("authToken", response.token);
      }

      // Ambil data profil user (sekarang memanggil GET /profile)
      const profileData = await this.remoteSource.getProfile();

      // 4. Buat UserEntity dari data profil dengan mapper
      const userEntity = mapUserFromApi(profileData);

      return right(userEntity);
    } catch (error) {
      if (error.response) {
        // Error dari server (misal: 401, 400)
        const message =
          error.response.data?.message || "Email atau password salah.";
        if (error.response.status === 401) {
          return left(new IncorrectPasswordFailure(message));
        }
        return left(new ServerFailure(message));
      } else if (error.request) {
        // Error jaringan (tidak ada respons)
        return left(new NetworkFailure());
      } else {
        // Error JavaScript lainnya
        return left(
          new ServerFailure(error.message || "Gagal melakukan login.")
        );
      }
    }
  }

  /**
   * Menangani registrasi ke Hono API.
   */
  async register(email, password, displayName) {
    try {
      await this.remoteSource.register(email, password, displayName);

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
   * Menangani inisiasi login sosial
   */
  async socialLogin(provider, callbackURL) {
    try {
      const response = await this.remoteSource.socialLogin(provider, callbackURL);
      if (response && response.url) {
        return right(response.url);
      } else {
        return left(new ServerFailure("Gagal mendapatkan URL otorisasi."));
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Social login gagal.";
        return left(new ServerFailure(message));
      } else if (error.request) {
        return left(new NetworkFailure());
      } else {
        return left(
          new ServerFailure(error.message || "Gagal melakukan inisiasi social login.")
        );
      }
    }
  }

  /**
   * Mendapatkan user saat ini.
   * Mendukung dua mode auth:
   * 1. Token di localStorage (email/password login)
   * 2. Session cookie (social login via better-auth)
   * 
   * Jika berhasil via cookie (social login), token akan diambil dan disimpan
   * ke localStorage agar request berikutnya menggunakan Bearer token.
   */
  async getCurrentUser() {
    try {
      // Jika belum ada token di localStorage atau sessionStorage
      const existingToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!existingToken) {
        try {
          const sessionToken = await this.remoteSource.getSessionToken();
          if (sessionToken) {
            localStorage.setItem("authToken", sessionToken);
            console.log("[Auth] Token berhasil diambil dari sesi cookie dan disimpan ke localStorage.");
          }
        } catch (sessionError) {
          // Tidak ada sesi aktif, lanjutkan tanpa token
          console.log("[Auth] Tidak ada sesi cookie aktif.");
        }
      }

      // Langsung panggil /profile — browser akan otomatis mengirim session cookie
      // jika ada (dari social login), atau Authorization header dari interceptor
      // jika ada token di localStorage (dari email/password login).
      const profileData = await this.remoteSource.getProfile();

      // Buat UserEntity dari data profil
      const userEntity = mapUserFromApi(profileData);

      return right(userEntity);
    } catch (error) {
      // Jika 401/403, user memang tidak terautentikasi — bukan error
      if (error.response && [401, 403].includes(error.response.status)) {
        localStorage.removeItem("authToken"); // Bersihkan token mati jika ada
        sessionStorage.removeItem("authToken");
        return right(null);
      }
      // Error lain (misal server down) adalah Failure
      return left(
        new ServerFailure(error.message || "Gagal mengambil sesi user.")
      );
    }
  }


  /**
   * Logout user dengan menghapus token dari localStorage dan sessionStorage.
   */
  async logout() {
    try {
      await this.remoteSource.logout();
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      return right(true); // Sukses
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || error.message || "Gagal menghapus sesi lokal.")
      );
    }
  }
}
