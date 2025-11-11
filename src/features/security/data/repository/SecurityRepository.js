// src/features/security/data/repository/SecurityRepository.js
import { ISecurityRepository } from "../../domain/repository/ISecurityRepository";
import { SecurityRemoteSource } from "../source/SecurityRemoteSource";
import {
  left,
  right,
  ServerFailure,
  IncorrectPasswordFailure,
} from "../../../../core/error/failure";

export class SecurityRepository extends ISecurityRepository {
  constructor() {
    super();
    this.remoteSource = new SecurityRemoteSource();
  }

  async changePassword(passwords) {
    try {
      const response = await this.remoteSource.changePassword(passwords);
      return right({ message: response.message });
    } catch (error) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      if (statusCode === 400 || statusCode === 401) { // Error password salah
        return left(
          new IncorrectPasswordFailure(
            errorData.message || "Password saat ini salah."
          )
        );
      }
      return left(
        new ServerFailure(errorData.message || "Gagal mengubah password.")
      );
    }
  }
}