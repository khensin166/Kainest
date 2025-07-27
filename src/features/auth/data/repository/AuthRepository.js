import { IAuthRepository } from "../../domain/repository/IAuthRepository";
import { UserEntity } from "../../domain/entities/UserEntity";
import {
  left,
  right,
  ServerFailure,
  IncorrectPasswordFailure,
} from "../../../../core/error/failure.js";
import { AuthRemoteSource } from "../source/AuthRemoteSource";
import { supabase } from "@/lib/supabase"; // ✅ INI BARIS YANG PERLU DITAMBAHKAN

export class AuthRepository extends IAuthRepository {
  constructor() {
    super();
    this.remoteSource = new AuthRemoteSource();
  }

  async login(email, password) {
    try {
      const userFromAuth = await this.remoteSource.login(email, password);

      // Setelah login berhasil, ambil data profil dari tabel 'user_profiles'
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userFromAuth.id)
        .single();

      if (profileError) throw profileError;

      // Ubah data gabungan menjadi UserEntity yang bersih
      const userEntity = new UserEntity({
        id: userFromAuth.id,
        email: userFromAuth.email,
        displayName: profileData.display_name,
        avatarUrl: profileData.avatar_url,
        partnerId: profileData.partner_id,
      });

      return right(userEntity);
    } catch (error) {
      // Supabase mengembalikan pesan spesifik untuk password salah
      if (error.message.includes("Invalid login credentials")) {
        return left(new IncorrectPasswordFailure("Email atau password salah."));
      }
      // Untuk error lainnya
      return left(new ServerFailure(error.message || "Gagal melakukan login."));
    }
  }

  async register(email, password, displayName) {
    try {
      const userFromSupabase = await this.remoteSource.register(
        email,
        password,
        displayName
      );

      const userEntity = new UserEntity({
        id: userFromSupabase.id,
        email: userFromSupabase.email,
        displayName: userFromSupabase.profile.display_name,
      });

      return right(userEntity);
    } catch (error) {
      return left(
        new ServerFailure(error.message || "Gagal melakukan registrasi.")
      );
    }
  }
}
