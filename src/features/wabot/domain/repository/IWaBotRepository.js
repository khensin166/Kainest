// src/features/wabot/domain/repository/IWaBotRepository.js
//
// Kontrak repository untuk fitur wabot. Implementasinya ada di
// `data/repository/`. Interface ini membuat dependency inversion menjadi
// eksplisit — sebelumnya hanya tersirat, sehingga tidak ada yang menjaga
// bila implementasi berubah.
//
// Semua method mengembalikan Either: left(Failure) | right(Entity).

export class IWaBotRepository {
  generateKey(baseUrl, name, adminSecret) {
    throw new Error("Method not implemented.");
  }
  getGroups(baseUrl, apiKey) {
    throw new Error("Method not implemented.");
  }
  sendMessage(baseUrl, apiKey, payload) {
    throw new Error("Method not implemented.");
  }
  getAllApiKeys(baseUrl, adminSecret) {
    throw new Error("Method not implemented.");
  }
}
