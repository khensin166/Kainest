// features/auth/data/models/AuthResponseModel.js
// Model untuk response /login
export class LoginResponseModel {
  constructor({ statusCode, message, token }) {
    this.statusCode = statusCode;
    this.message = message;
    this.token = token;
  }

  static fromJSON(json) {
    return new LoginResponseModel({
      statusCode: json.status_code,
      message: json.message,
      token: json.data,
    });
  }
}

// Model untuk nested object 'data' dari API /auth/me
export class ProfileUserModel {
  constructor({
    id,
    name,
    email,
    role,
    username,
    phone,
    gender,
    date_of_birth,
    photo,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.roleName = role.name;
    this.phone = phone;
    this.gender = gender;
    this.dateOfBirth = date_of_birth;
    this.photo = photo;
  }

  static fromJSON(json) {
    return new ProfileUserModel({
      id: json.id,
      name: json.name,
      email: json.email,
      username: json.username,
      role: json.role,
      phone: json.phone,
      gender: json.gender,
      date_of_birth: json.date_of_birth,
      photo: json.photo,
    });
  }
}
