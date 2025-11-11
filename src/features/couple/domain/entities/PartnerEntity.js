// Entitas bersih untuk data pasangan
export class PartnerEntity {
  constructor({ id, name, displayName, avatarUrl }) {
    this.id = id;
    this.name = name;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
  }
}