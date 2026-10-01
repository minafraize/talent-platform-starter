export interface AccessTokenPayload {
  userId: string;
  sessionId: string;
}

export interface TokenService {
  createAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string>;

  verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload>;
}