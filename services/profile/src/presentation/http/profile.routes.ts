import type {
  FastifyInstance,
} from "fastify";

import { z } from "zod";

import { container } from "../../application/container.js";
import { authenticate } from "../../infrastructure/security/authentication.js";

const updateProfileSchema =
  z
    .object({
      username: z
        .string()
        .trim()
        .toLowerCase()
        .regex(
          /^[a-z0-9_.-]{3,30}$/,
          "Username must be 3-30 characters and contain only letters, numbers, _, ., or -",
        )
        .optional(),

      displayName: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

      bio: z
        .string()
        .trim()
        .max(500)
        .optional(),

      countryCode: z
        .string()
        .trim()
        .regex(
          /^[A-Za-z]{2}$/,
          "Country code must contain 2 letters",
        )
        .transform(
          (value) =>
            value.toUpperCase(),
        )
        .optional(),

      city: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

      avatarMediaId: z
        .string()
        .trim()
        .min(1)
        .max(255)
        .optional(),
    })
    .strict();

export async function profileRoutes(
  fastify: FastifyInstance,
): Promise<void> {
  fastify.patch<{
    Body: unknown;
  }>(
    "/v1/profile/me",
    {
      preHandler: authenticate,
    },
    async (
      request,
      reply,
    ) => {
      const userId =
        request.user!.userId;

      const parsed =
        updateProfileSchema.safeParse(
          request.body,
        );

      if (!parsed.success) {
        return reply
          .code(400)
          .send({
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message:
                "Invalid profile data",
              details:
                parsed.error.flatten(),
            },
          });
      }

      const result =
        await container.updateProfile.execute(
          {
            userId,
            ...parsed.data,
          },
        );

      return reply
        .code(200)
        .send({
          success: true,
          data: result,
        });
    },
  );

  fastify.get(
    "/v1/profile/me",
    {
      preHandler: authenticate,
    },
    async (
      request,
      reply,
    ) => {
      const userId =
        request.user!.userId;

      const profile =
        await container.profileRepository.findByUserId(
          userId,
        );

      if (!profile) {
        return reply
          .code(404)
          .send({
            success: false,
            error: {
              code: "PROFILE_NOT_FOUND",
              message:
                "Profile was not found",
            },
          });
      }

      return reply
        .code(200)
        .send({
          success: true,
          data: profile,
        });
    },
  );
}
