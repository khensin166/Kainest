// src/features/security/domain/use-case/ChangePasswordUseCase.js
export class ChangePasswordUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(passwords) {

    // Validasi dasar
    if (!passwords.currentPassword || !passwords.newPassword) {
      return left(
        new GeneralFailure("Password lama dan baru tidak boleh kosong.")
      );
    }
    if (passwords.newPassword !== passwords.confirmationPassword) {
      // Ini adalah error yang Anda lihat
      return left(new GeneralFailure("Konfirmasi password baru tidak cocok."));
    } 
    return this.repository.changePassword(passwords);
  }
}
