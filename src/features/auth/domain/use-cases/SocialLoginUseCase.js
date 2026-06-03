export class SocialLoginUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(provider, callbackURL) {
    return await this.authRepository.socialLogin(provider, callbackURL);
  }
}
