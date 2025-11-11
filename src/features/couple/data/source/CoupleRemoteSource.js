import apiClient from "../../../../lib/apiClient";

export class CoupleRemoteSource {
  async getCoupleStatus() {
    try {
      const response = await apiClient.get("/couple");
      return response.data; // Mengembalikan { success, connected, data }
    } catch (error) {
      throw error;
    }
  }

  async connectWithCode(invitationCode) {
    try {
      const response = await apiClient.post("/couple/connect", {
        invitationCode,
      });
      return response.data; // Mengembalikan { success, data } atau { success, message }
    } catch (error) {
      throw error;
    }
  }
}