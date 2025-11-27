export class CategoryEntity {
  constructor({ id, name, type, icon, isDefault }) {
    this.id = id;
    this.name = name;
    this.type = type; // 'EXPENSE' atau 'INCOME'
    this.icon = icon || '🏷️';
    this.isDefault = isDefault;
    // Kita tidak butuh createdAt atau userId di UI dropdown
  }

  // Helper getter untuk tampilan di dropdown (Icon + Nama)
  get displayName() {
    return `${this.icon} ${this.name}`;
  }
}