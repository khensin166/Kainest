export class ForgotPasswordUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(email) {
    return await this.authRepository.forgotPassword(email);
  }
}
