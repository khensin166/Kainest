// src\features\settings\domain\use-cases\ChangePasswordUseCase.js
export class ChangePasswordUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(passwords) {
    // Validasi dasar
    if (!passwords.currentPassword || !passwords.newPassword) {
      throw new Error("Password lama dan baru tidak boleh kosong.");
    }
    if (passwords.newPassword !== passwords.confirmationPassword) {
      throw new Error("Konfirmasi password baru tidak cocok.");
    }
    return this.repository.changePassword(passwords);
  }
}