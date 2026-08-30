import { IAdminRepository } from "../../domain/repository/IAdminRepository";
import { left, right, ServerFailure, taggedServerFailure } from "../../../../core/error/failure";

export class AdminRepository extends IAdminRepository {
  constructor(remoteSource) {
    super();
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
      return left(taggedServerFailure(error, error.message || "Terjadi kesalahan koneksi"));
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
      return left(taggedServerFailure(error, error.message || "Terjadi kesalahan koneksi"));
    }
  }

  // --- RBAC / IAM ---
  async getGroups() {
    try {
      const response = await this.remoteSource.getGroups();
      if (response.success) {
        return right(response.data);
      }
      return left(new ServerFailure(response.message || "Gagal mengambil data group"));
    } catch (error) {
      return left(taggedServerFailure(error, "Terjadi kesalahan saat mengambil group"));
    }
  }

  async createGroup(data) {
    try {
      const response = await this.remoteSource.createGroup(data);
      if (response.success) {
        return right(response.data);
      }
      return left(new ServerFailure(response.message || "Gagal membuat group"));
    } catch (error) {
      return left(taggedServerFailure(error, "Terjadi kesalahan saat membuat group"));
    }
  }

  async updateGroup(groupId, data) {
    try {
      const response = await this.remoteSource.updateGroup(groupId, data);
      if (response.success) {
        return right(response.data);
      }
      return left(new ServerFailure(response.message || "Gagal mengupdate group"));
    } catch (error) {
      return left(taggedServerFailure(error, "Terjadi kesalahan saat mengupdate group"));
    }
  }

  async deleteGroup(groupId) {
    try {
      const response = await this.remoteSource.deleteGroup(groupId);
      if (response.success) {
        return right(response.message);
      }
      return left(new ServerFailure(response.message || "Gagal menghapus group"));
    } catch (error) {
      return left(taggedServerFailure(error, "Terjadi kesalahan saat menghapus group"));
    }
  }

  async assignUserToGroup(userId, groupId) {
    try {
      const response = await this.remoteSource.assignUserToGroup(userId, groupId);
      if (response.success) {
        return right(response.data);
      }
      return left(new ServerFailure(response.message || "Gagal menetapkan group"));
    } catch (error) {
      return left(taggedServerFailure(error, "Terjadi kesalahan saat menetapkan group"));
    }
  }
}
