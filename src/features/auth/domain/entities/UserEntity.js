// 📦features/auth/domain/entities/UserEntity.js
export class UserEntity {
  constructor({ id, name, email, role, username, phone, gender, date_of_birth, photo }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.role = role;
    this.phone = phone;
    this.gender = gender;
    this.dateOfBirth = date_of_birth;
    this.photo = photo;
  }
}
