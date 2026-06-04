export class ResetPasswordUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(newPassword, token) {
    return await this.authRepository.resetPassword(newPassword, token);
  }
}
