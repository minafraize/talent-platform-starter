export interface AccessTokenPayload {
  userId: string;
  sessionId: string;
}

export interface TokenVerifier {
  verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload>;
}

export class AccessTokenVerificationError extends Error {
  constructor(
    message = "Invalid access token",
  ) {
    super(message);
    this.name =
      "AccessTokenVerificationError";
  }
}
