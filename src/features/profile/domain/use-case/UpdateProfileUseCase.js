// src/features/profile/domain/use-case/UpdateProfileUseCase.js
export class UpdateProfileUseCase {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(profileData) {
    return this.repository.updateProfile(profileData);
  }
}