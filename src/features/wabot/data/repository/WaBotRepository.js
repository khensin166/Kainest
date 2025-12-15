import { WaGroupEntity } from '../../domain/entities/WaGroupEntity';
import { WaBotRemoteSource } from '../sources/WaBotRemoteSource';

export class WaBotRepository {
  constructor() {
    this.remoteSource = new WaBotRemoteSource();
  }

  async generateKey(baseUrl, name, adminSecret) {
    const data = await this.remoteSource.generateKey(baseUrl, name, adminSecret);
    // Kembalikan apiKey langsung
    return data.apiKey; 
  }

  async getGroups(baseUrl, apiKey) {
    const response = await this.remoteSource.getGroups(baseUrl, apiKey);
    
    // Mapping data mentah ke Entity
    // (Asumsi response.data.data adalah array grup)
    const rawGroups = response.data?.data || response.data || [];
    
    if (Array.isArray(rawGroups)) {
      return rawGroups.map(g => new WaGroupEntity({ id: g.id, subject: g.subject }));
    }
    return [];
  }

  async sendMessage(baseUrl, apiKey, payload) {
    const response = await this.remoteSource.sendMessage(baseUrl, apiKey, payload);
    return response.status || response.success;
  }
}