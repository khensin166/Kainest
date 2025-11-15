export class NoteEntity {
  constructor({
    id,
    title,
    content, // Ini akan berupa objek JSON dari Editor.js
    isPublic,
    partnerPermission,
    createdAt,
    updatedAt,
    authorId,
    coupleId,
    // Kita bisa tambahkan data author yang sudah di-flatten di sini
    authorName,
    authorAvatar,
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.isPublic = isPublic;
    this.partnerPermission = partnerPermission; // 'VIEWER' atau 'EDITOR'
    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;
    this.authorId = authorId;
    this.coupleId = coupleId;
    this.authorName = authorName;
    this.authorAvatar = authorAvatar;
  }
}