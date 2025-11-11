// features/auth/domain/entities/UserEntity.js

export class UserEntity {
  constructor({
    id,
    email,
    name,
    phoneNumber,
    createdAt,
    updatedAt,
    // Properti dari 'profile' yang di-nest
    profileId,
    displayName,
    avatarUrl,
    invitationCode,
  }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt ? new Date(createdAt) : null;
    this.updatedAt = updatedAt ? new Date(updatedAt) : null;

    // Data profil yang sudah di-flatten
    this.profileId = profileId;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.invitationCode = invitationCode;
  }

  // Opsional: Helper getter agar lebih mudah di UI
  // Komponen bisa memanggil `authStore.user.safeDisplayName`
  get safeDisplayName() {
    return this.displayName || this.name || this.email;
  }
}
