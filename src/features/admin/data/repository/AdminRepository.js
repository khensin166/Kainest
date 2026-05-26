import { left, right } from "@/core/utils/either";
import { ServerFailure } from "@/core/error/failures";

export class AdminRepository {
  constructor(remoteSource) {
    this.remoteSource = remoteSource;
  }

  async getUsers() {
    try {
      const response = await this.remoteSource.getUsers();
      if (response.success) {
        return right(response.data);
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil data user"));
      }
    } catch (error) {
      return left(new ServerFailure(error.message || "Terjadi kesalahan koneksi"));
    }
  }

  async updateUserAccess(userId, data) {
    try {
      const response = await this.remoteSource.updateUserAccess(userId, data);
      if (response.success) {
        return right(response.data);
      } else {
        return left(new ServerFailure(response.message || "Gagal update akses user"));
      }
    } catch (error) {
      return left(new ServerFailure(error.message || "Terjadi kesalahan koneksi"));
    }
  }
}
