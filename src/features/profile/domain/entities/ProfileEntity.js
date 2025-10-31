export class ProfileEntity {
  constructor({
    id,
    email,
    name,
    phoneNumber, // phone_number
    createdAt,
    updatedAt,
    // Nested profile data
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

    // Properti dari 'profile' yang di-nest
    this.profileId = profileId;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.invitationCode = invitationCode;
  }
}