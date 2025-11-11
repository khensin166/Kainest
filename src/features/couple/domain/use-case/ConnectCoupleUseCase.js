export class ConnectCoupleUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(invitationCode) {
    if (!invitationCode) {
      throw new Error("Kode undangan tidak boleh kosong.");
    }
    return this.repository.connectWithCode(invitationCode);
  }
}