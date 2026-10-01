Project

talent-platform-starter is a pnpm/Turbo monorepo for a scalable talent platform.

The repository contains independently organized services. The current work is focused primarily on identity/authentication and profile flows.

The repository is the source of truth. Previous conversation context is useful, but always inspect the actual repository before making assumptions.

Core Working Rules

Inspect before changing.

Search for existing implementations and conventions before introducing new ones.

Keep changes focused and avoid unrelated refactors.

Prefer the smallest correct change over a broad rewrite.

Do not invent architecture that is not supported by the existing codebase.

Preserve existing user changes; never overwrite or reset unrelated work.

Never claim a test, build, or command passed unless it was actually executed.

Do not expose secrets, tokens, passwords, API keys, or sensitive configuration in logs or responses.

Package Manager and Monorepo

Use pnpm.

Do not switch to npm or yarn unless explicitly requested.

Before changing workspace dependencies, inspect:

root package.json

pnpm-workspace.yaml

turbo.json

relevant service package.json

lockfile

Typical commands:

pnpm install
pnpm build
pnpm test
pnpm lint

For a specific service:

pnpm --filter @talent/identity-service build
pnpm --filter @talent/profile-service test

Always verify the actual package name from package.json before using a filter.

TypeScript

Backend services use TypeScript.

Prefer:

strict typing

async/await

small focused functions

explicit domain types

safe error handling

no unnecessary any

Do not add TypeScript dependencies blindly. If a command reports something such as tsc: not found, inspect workspace dependency installation and package boundaries before changing scripts.

Architecture

Favor clear boundaries between services.

Identity Service

Owns identity/authentication concerns such as:

registration

authentication

sessions

JWT

refresh/session management

authentication events

outbox processing

Profile Service

Owns talent/profile business logic such as:

profile creation

profile updates

profile data

profile-related business rules

Do not couple profile business logic to identity service internals.

Use explicit APIs/events/contracts between services where appropriate.

Events and Outbox

The project uses an outbox-style event flow.

Important principles:

event contracts should be explicit

consumers should validate payloads

event processing should be idempotent where possible

duplicate delivery must be considered

failures must not be silently swallowed

do not tightly couple consumers to producer internals

Known worker file:

services/identity/src/workers/outbox-worker.ts

The filename is outbox-worker.ts.

Do not assume it is named outbox.worker.ts.

JWT / jose

JWT implementation uses the jose library.

Known implementation detail:

SignJWT does not provide .setClaim().

Do not write:

new SignJWT({})
  .setClaim("sid", value)

For custom claims, put them in the payload:

new SignJWT({
  sid: randomUUID(),
})

Typical JWT structure:

new SignJWT({
  sid: randomUUID(),
})
  .setProtectedHeader({
    alg: "HS256",
  })
  .setSubject(userId)
  .setIssuer(issuer)
  .setAudience(audience)
  .setIssuedAt()
  .setExpirationTime("15m")
  .sign(secret)

When working on authentication:

validate issuer

validate audience

respect expiration

use secure random identifiers

keep secrets server-side

never log tokens or secrets

Authentication and Sessions

Treat authentication and session security as first-class concerns.

When changing auth code:

Inspect existing token/session flow.

Identify where secrets and environment variables are loaded.

Preserve existing security boundaries.

Avoid exposing internal session identifiers unnecessarily.

Add or update tests for security-sensitive behavior.

Do not make authentication behavior changes solely to make tests pass.

Testing

The project uses Vitest.

E2E tests may live under:

services/*/tests/e2e/

A known E2E test is:

services/profile/tests/e2e/register-to-profile.e2e.test.ts

Example:

pnpm --filter @talent/profile-service exec vitest run \
  tests/e2e/register-to-profile.e2e.test.ts

When modifying behavior:

Run the smallest relevant unit test.

Run integration tests when service boundaries are affected.

Run relevant E2E tests for end-to-end flows.

Run typecheck/build when appropriate.

Environment

Use environment variables for:

database credentials

JWT secrets

API keys

service credentials

external provider credentials

Never hard-code secrets.

Test environments may use:

.env.test

Do not modify production configuration merely to make local tests pass.

Database

Before modifying database code:

Inspect the current schema.

Inspect existing migrations.

Understand relationships and constraints.

Follow current repository conventions.

Avoid destructive migrations unless explicitly requested.

Error Handling

Errors should be:

explicit

meaningful

safe for clients

logged appropriately on the server

free of secrets/tokens/passwords

Do not expose stack traces or internal implementation details through public API responses unless the existing project explicitly requires it.

Git Safety

Before substantial changes:

git status
git diff

Do not:

reset user changes

delete unrelated work

use destructive git commands

rewrite history

unless explicitly requested.

Implementation Workflow

For non-trivial tasks:

Step 1 — Inspect

Read the relevant files and search for related implementations.

Step 2 — Understand

Identify:

current behavior

dependencies

boundaries

tests

likely failure point

Step 3 — Plan

For large changes, explain a concise implementation plan before modifying code.

Step 4 — Implement

Make the smallest coherent change.

Step 5 — Validate

Run relevant tests/build/typecheck/lint commands.

Step 6 — Review

Inspect the final diff:

git diff
git status

Step 7 — Report

Report:

files changed

what changed

commands executed

test results

remaining issues

Communication Style

Be concise but technically precise.

When a task has uncertainty:

state what is known

state what needs inspection

do not invent missing facts

When a command fails:

show the relevant failure

identify the likely root cause

distinguish environment problems from code problems

Do not claim success without validation.

Important Project Rule

PROJECT_CONTEXT.md contains historical context and current project state.

Read it when a task relates to previous decisions, known problems, or ongoing work.

However, the actual source code always wins if the context file conflicts with the repository.