// src/features/auth/data/source/AuthRemoteSource.js
import { supabase } from "@/lib/supabase";

export class AuthRemoteSource {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user)
      throw new Error("Login Supabase berhasil tetapi tidak ada data user.");
    return data.user;
  }

  async register(email, password, displayName) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;
    if (!authData.user)
      throw new Error(
        "Registrasi Supabase Auth berhasil tetapi tidak ada data user."
      );

    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id,
        display_name: displayName,
      })
      .select()
      .single();
    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return { ...authData.user, profile: profileData };
  }

  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
