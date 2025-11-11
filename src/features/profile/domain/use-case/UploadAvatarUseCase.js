// src/features/profile/domain/use-case/UploadAvatarUseCase.js
export class UploadAvatarUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(file) {
    // 1. Upload foto ke Cloudinary dan dapatkan URL
    const uploadResult = await this.repository.uploadAvatar(file);

    if (uploadResult.left) {
      return uploadResult; // Gagal upload, kembalikan failure
    }

    const { url } = uploadResult.right;

    // 2. Simpan URL baru ke database via endpoint updateProfile
    const updateResult = await this.repository.updateProfile({
      avatarUrl: url,
    });

    return updateResult; // Kembalikan hasil akhir (user baru atau failure)
  }
}