import { PartnerEntity } from "./PartnerEntity";

// Entitas untuk status koneksi
export class CoupleEntity {
  constructor({
    connected,
    coupleId = null,
    partner = null,
    createdAt = null,
  }) {
    this.connected = connected; // boolean
    this.coupleId = coupleId;
    this.partner = partner ? new PartnerEntity(partner) : null;
    this.createdAt = createdAt ? new Date(createdAt) : null;
  }
}