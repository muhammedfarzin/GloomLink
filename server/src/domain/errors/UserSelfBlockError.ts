export class UserSelfBlockError extends Error {
  constructor() {
    super("User cannot block themselves");
  }
}
