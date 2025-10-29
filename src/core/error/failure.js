// File: src/core/error/failure.js
// Objek dasar untuk semua jenis kegagalan
export class Failure {
  constructor(message) {
    this.message = message;
  }
}

// Kegagalan spesifik dari server (misal: error 500)
export class ServerFailure extends Failure {}

// Kegagalan karena tidak ada koneksi internet
export class NetworkFailure extends Failure {
  constructor(message = "Tidak ada koneksi internet.") {
    super(message);
  }
}

// PERUBAHAN: Kegagalan karena password salah, sekarang menyimpan pesan spesifik
export class IncorrectPasswordFailure extends Failure {}

// Kegagalan karena terlalu banyak percobaan (menyimpan durasi countdown)
export class RateLimitFailure extends Failure {
  constructor(message, retryAfterSeconds) {
    super(message);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class GeneralFailure extends Failure {}

// Fungsi helper untuk Either
export const left = (failure) => ({ left: failure, right: null });
export const right = (data) => ({ left: null, right: data });
