// src/features/auth/data/source/AuthRemoteSource.js
import { supabase } from "@/lib/supabase"; // Pastikan path ke supabase.js benar

export class AuthRemoteSource {
  // ... (metode login, getProfile, logout yang sudah ada) ...

  /**
   * ✅ TAMBAHKAN INI: Metode untuk mendaftarkan pengguna baru di Supabase.
   * Ini adalah implementasi "kotor" yang hanya berurusan dengan API.
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Lemparkan error dari Supabase agar bisa ditangkap oleh Repository
      throw error;
    }
    if (!data.user) {
      throw new Error("Login Supabase berhasil tetapi tidak ada data user.");
    }
    return data.user;
  }
  
  async register(email, password, displayName) {
    // Langkah 1: Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // Jika error dari Supabase, langsung lemparkan agar bisa ditangkap oleh Repository
      throw authError;
    }
    if (!authData.user) {
      throw new Error(
        "Registrasi Supabase Auth berhasil tetapi tidak ada data user."
      );
    }

    // Langkah 2: Buat profil di tabel `user_profiles`
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        display_name: displayName,
      })
      .select()
      .single();

    if (profileError) {
      // Jika pembuatan profil gagal, hapus user yang baru dibuat agar tidak ada data yatim.
      // Ini membutuhkan akses admin, pastikan RLS Anda mengizinkannya jika perlu.
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    // Gabungkan data dari auth dan profil untuk dikembalikan
    return {
      ...authData.user,
      profile: profileData,
    };
  }
}
