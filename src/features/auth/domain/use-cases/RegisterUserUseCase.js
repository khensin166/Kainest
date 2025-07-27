// Use case ini bertanggung jawab untuk satu hal: mendaftarkan pengguna.

export class RegisterUserUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute({ email, password, displayName }) {
    // Validasi input dasar
    if (!email || !password || !displayName) {
      throw new Error("Email, password, dan nama panggilan tidak boleh kosong.");
    }
    if (password.length < 6) {
      throw new Error("Password harus terdiri dari minimal 6 karakter.");
    }
    
    // Panggil metode register dari repository
    return this.repository.register(email, password, displayName);
  }
}
