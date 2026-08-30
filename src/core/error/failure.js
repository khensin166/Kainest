// File: src/core/error/failure.js
// Objek dasar untuk semua jenis kegagalan
export class Failure {
  constructor(message) {
    this.message = message;
  }
}

// Kegagalan spesifik dari server (misal: error 422, 500)
export class ServerFailure extends Failure {
  constructor(message, code) {
    super(message);
    this.code = code ?? null; // Kode error semantik (misal: 'TRANSACTION_CLOSED_PERIOD')
  }
}

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

/**
 * Membuat ServerFailure sambil MEWARISKAN tanda `__handled` dari error asal.
 *
 * apiClient menandai error 403 yang sudah ia tampilkan lewat modal global.
 * Tanpa pewarisan ini tanda tersebut hilang di lapisan repository (setiap
 * `catch` membuat Failure baru dari pesannya saja), sehingga satu galat
 * memunculkan dua notifikasi: modal DAN toast.
 */
export const taggedServerFailure = (sumber, message, code) => {
  const failure = new ServerFailure(message, code);
  failure.__handled = Boolean(sumber && sumber.__handled);
  return failure;
};

// Fungsi helper untuk Either
// Fungsi helper untuk Either
export const left = (failure) => ({
  left: failure,
  right: null,
  fold: (onLeft, onRight) => onLeft(failure),
});

export const right = (data) => ({
  left: null,
  right: data,
  fold: (onLeft, onRight) => onRight(data),
});
