export class SessionExpiredError extends Error {
  constructor(message = "SESSION_EXPIRED") {
    super(message); // ← message সহ
    this.name = "SessionExpiredError";
  }
}
