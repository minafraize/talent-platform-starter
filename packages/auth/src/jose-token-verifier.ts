import { jwtVerify } from "jose";

import {
  AccessTokenVerificationError,
  type AccessTokenPayload,
  type TokenVerifier,
} from "./token-verifier.js";

interface JoseTokenVerifierConfig {
  secret: Uint8Array;
  issuer: string;
  audience: string;
}

export class JoseTokenVerifier
  implements TokenVerifier
{
  private readonly config: JoseTokenVerifierConfig;

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

    this.config = {
      secret: new TextEncoder().encode(
        secret,
      ),
      issuer:
        process.env.ACCESS_TOKEN_ISSUER ??
        "talent-platform",
      audience:
        process.env.ACCESS_TOKEN_AUDIENCE ??
        "talent-platform-api",
    };
  }

  async verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload> {
    try {
      const { payload } =
        await jwtVerify(
          token,
          this.config.secret,
          {
            issuer: this.config.issuer,
            audience:
              this.config.audience,
            algorithms: ["HS256"],
          },
        );

      if (
        typeof payload.sub !== "string" ||
        typeof payload.sid !== "string"
      ) {
        throw new AccessTokenVerificationError();
      }

      return {
        userId: payload.sub,
        sessionId: payload.sid,
      };
    } catch {
      throw new AccessTokenVerificationError();
    }
  }
}
