export class SystemUpdateEntity {
  constructor({ id, version, date, title, description, url, badge }) {
    this.id = id;
    this.version = version || "";
    this.date = date || null;
    this.title = title || "";
    this.description = description || "";
    this.url = url || null;
    this.badge = badge || null;
  }
}
