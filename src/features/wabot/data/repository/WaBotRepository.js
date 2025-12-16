import { WaGroupEntity } from "../../domain/entities/WaGroupEntity";
import { WaBotRemoteSource } from "../sources/WaBotRemoteSource";

export class WaBotRepository {
  constructor() {
    this.remoteSource = new WaBotRemoteSource();
  }

  async generateKey(baseUrl, name, adminSecret) {
    const data = await this.remoteSource.generateKey(
      baseUrl,
      name,
      adminSecret
    );
    // Pastikan mengembalikan apiKey dari response
    return data.apiKey;
  }

  async getGroups(baseUrl, apiKey) {
    const response = await this.remoteSource.getGroups(baseUrl, apiKey);

    // Mapping dari JSON { groups: [...] } ke Entity
    const rawGroups = response.groups || [];

    if (Array.isArray(rawGroups)) {
      return rawGroups.map(
        (g) =>
          new WaGroupEntity({
            id: g.id,
            name: g.name, // Sesuai JSON response Anda: "name"
          })
      );
    }
    return [];
  }

  async sendMessage(baseUrl, apiKey, payload) {
    return await this.remoteSource.sendMessage(baseUrl, apiKey, payload);
  }
}
