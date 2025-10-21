
// features\auth\domain\entities\UserEntity.js

export class UserEntity {
  constructor({ id, email, displayName, avatarUrl = null, partnerId = null }) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.partnerId = partnerId;
  }
}
