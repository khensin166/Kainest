
// Mendefinisikan bentuk data pengguna yang ideal di dalam aplikasi Anda.
// Ini membantu menjaga konsistensi data.

export class UserEntity {
  constructor({ id, email, displayName, avatarUrl = null, partnerId = null }) {
    this.id = id;
    this.email = email;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.partnerId = partnerId;
  }
}
