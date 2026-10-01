import { SignJWT } from "jose";

import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import {
  JoseTokenVerifier,
} from "@talent/auth";

import type {
  AccessTokenPayload,
  TokenService,
} from "../../application/ports/token-service.js";

export class JoseTokenService
  implements TokenService
{
  private readonly secret: Uint8Array;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly accessTokenTtlSeconds: number;
  private readonly verifier: JoseTokenVerifier;

  constructor() {
    const secret =
      process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined",
      );
    }

    if (secret.length < 32) {
      throw new Error(
        "ACCESS_TOKEN_SECRET must be at least 32 characters",
      );
    }

    this.secret = new TextEncoder().encode(
      secret,
    );

    this.issuer =
      process.env.ACCESS_TOKEN_ISSUER ??
      "talent-platform";

    this.audience =
      process.env.ACCESS_TOKEN_AUDIENCE ??
      "talent-platform-api";

    this.accessTokenTtlSeconds =
      Number(
        process.env
          .ACCESS_TOKEN_TTL_SECONDS ??
          900,
      );

    this.verifier =
      new JoseTokenVerifier();
  }

  async createAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return new SignJWT({
      sid: payload.sessionId,
    })
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setSubject(payload.userId)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt()
      .setExpirationTime(
        `${this.accessTokenTtlSeconds}s`,
      )
      .sign(this.secret);
  }

  async verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload> {
    try {
      return await this.verifier.verifyAccessToken(
        token,
      );
    } catch {
      throw AppErrors.unauthorized(
        ErrorCode.UNAUTHORIZED,
        "Invalid access token",
      );
    }
  }
}