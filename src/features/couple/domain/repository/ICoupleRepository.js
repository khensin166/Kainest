export class ICoupleRepository {
  /**
   * @returns {Promise<Either<Failure, CoupleEntity>>}
   */
  async getCoupleStatus() {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} invitationCode
   * @returns {Promise<Either<Failure, CoupleEntity>>}
   */
  async connectWithCode(invitationCode) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}