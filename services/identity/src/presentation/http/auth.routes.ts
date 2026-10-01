import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import type { RegisterUserUseCase } from "../../application/use-cases/register-user.js";
import type { LoginUserUseCase } from "../../application/use-cases/login-user.js";
import type { RefreshSessionUseCase } from "../../application/use-cases/refresh-session.js";
import type { LogoutUserUseCase } from "../../application/use-cases/logout-user.js";
import type { GetCurrentUserUseCase } from "../../application/use-cases/get-current-user.js";
import type { TokenService } from "../../application/ports/token-service.js";
import { AppErrors, ErrorCode } from "@talent/errors";
import { hashIp } from "../../infrastructure/security/ip-hash.js";

interface AuthRoutesOptions {
  registerUser: RegisterUserUseCase;
  loginUser: LoginUserUseCase;
  refreshSession: RefreshSessionUseCase;
  logoutUser: LogoutUserUseCase;
  getCurrentUser: GetCurrentUserUseCase;
  tokenService: TokenService;
}

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12).max(128),
  accountType: z.enum([
    "USER",
    "TALENT",
    "PROFESSIONAL",
  ]),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

function extractBearerToken(
  authorization: string | undefined,
): string {
  if (!authorization) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Authorization header is required",
    );
  }

  const [scheme, token] =
    authorization.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    throw AppErrors.unauthorized(
      ErrorCode.UNAUTHORIZED,
      "Invalid authorization header",
    );
  }

  return token;
}

export const authRoutes: FastifyPluginAsync<
  AuthRoutesOptions
> = async (app, options) => {
  app.post("/register", async (request, reply) => {
    const input = registerSchema.parse(
      request.body,
    );

    const user =
      await options.registerUser.execute(input);

    return reply.status(201).send({
      success: true,
      data: user,
      meta: {
        requestId: request.id,
      },
    });
  });

  app.post("/login", async (request, reply) => {
    const input = loginSchema.parse(
      request.body,
    );

    const ipHash = hashIp(
      request.ip,
    );

    const result =
      await options.loginUser.execute({
        ...input,
        ipHash,
      });

    return reply.status(200).send({
      success: true,
      data: result,
      meta: {
        requestId: request.id,
      },
    });
  });

  app.post("/refresh", async (request, reply) => {
    const input = refreshSchema.parse(
      request.body,
    );

    const result =
      await options.refreshSession.execute(
        input,
      );

    return reply.status(200).send({
      success: true,
      data: result,
      meta: {
        requestId: request.id,
      },
    });
  });

  app.post("/logout", async (request, reply) => {
    const input = logoutSchema.parse(
      request.body,
    );

    await options.logoutUser.execute(input);

    return reply.status(200).send({
      success: true,
      data: null,
      meta: {
        requestId: request.id,
      },
    });
  });

  app.get("/me", async (request, reply) => {
    const token = extractBearerToken(
      request.headers.authorization,
    );

    const payload =
      await options.tokenService.verifyAccessToken(
        token,
      );

    const user =
      await options.getCurrentUser.execute(
        payload.userId,
      );

    return reply.status(200).send({
      success: true,
      data: user,
      meta: {
        requestId: request.id,
      },
    });
  });
};