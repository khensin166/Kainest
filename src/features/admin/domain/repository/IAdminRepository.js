// src/features/admin/domain/repository/IAdminRepository.js
//
// Kontrak repository untuk fitur admin. Implementasinya ada di
// `data/repository/`. Interface ini membuat dependency inversion menjadi
// eksplisit — sebelumnya hanya tersirat, sehingga tidak ada yang menjaga
// bila implementasi berubah.
//
// Semua method mengembalikan Either: left(Failure) | right(Entity).

export class IAdminRepository {
  getUsers() {
    throw new Error("Method not implemented.");
  }
  updateUserAccess(userId, data) {
    throw new Error("Method not implemented.");
  }
}
