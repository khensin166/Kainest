export class FeedbackEntity {
  constructor({ id, message, rating, displayName, avatarUrl }) {
    this.id = id;
    this.message = message || "";
    this.rating = rating ?? null;
    // Sudah diratakan di mapper — template tidak perlu tahu bentuk JSON backend.
    this.displayName = displayName || "Pengguna";
    this.avatarUrl = avatarUrl || null;
  }
  get initial() {
    return (this.displayName || "?").charAt(0).toUpperCase();
  }
}
