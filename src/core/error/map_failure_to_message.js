// File: src/core/error/map_failure_to_message.js
import { ServerFailure, NetworkFailure, IncorrectPasswordFailure } from "./failure";

export function mapFailureToMessage(failure) {
  // Gunakan 'instanceof' untuk mengecek tipe dari Failure
  if (failure instanceof ServerFailure) {
    return failure.message; // Tampilkan pesan error dari server
  }
  if (failure instanceof NetworkFailure) {
    return failure.message; // Tampilkan pesan error jaringan
  }
  if (failure instanceof IncorrectPasswordFailure) {
    return failure.message; // Tampilkan pesan error password salah
  }
  return "Terjadi kesalahan yang tidak terduga."; // Pesan default
}
