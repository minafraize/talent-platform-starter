# TALENT PLATFORM — PROJECT CONTEXT / HANDOFF

> Snapshot date: 2026-10-01
> Repository: `~/Projects/talent-platform-starter`
> Purpose of this document: continue the project in a new ChatGPT/Codex conversation without depending on the previous conversation history.

---

## 0. How to use this handoff

Read this file before changing architecture or writing new code.

The most important rule is to preserve the existing decisions unless a new requirement explicitly changes them. In particular:

- Identity is the source of truth for account/persona type.
- Profile mirrors the type asynchronously through Kafka.
- `accountType` belongs to `Identity.User`, not to the authentication-provider `Identity.Account`.
- Access JWTs must not contain `accountType` because account type can change while the token is still valid.
- Cross-service event contracts belong in `packages/event-schemas`.
- Shared `AccountType` belongs in `packages/contracts`.
- Domain transition rules belong in Identity, not in shared contracts.
- NodeNext/ESM relative imports must use explicit `.js` extensions.
- Do not use `prisma migrate reset` on the test database unless explicitly intended; migrations are already part of the project history.

Current work-in-progress feature: **Account / Persona Upgrade**.

The desired lifecycle is:

```text
USER -> TALENT
USER -> PROFESSIONAL
TALENT -> PROFESSIONAL

TALENT -> USER           rejected
PROFESSIONAL -> TALENT   rejected
PROFESSIONAL -> USER     rejected
same-type transitions    rejected
all downgrades           rejected
```

The target architecture is:

```text
Client
  -> Identity API
      -> UpgradeAccountUseCase
          -> account-type transition policy
          -> DB transaction
          -> Outbox: identity.account.type.changed
              -> Kafka
                  -> Profile consumer
                      -> update Profile Account.type
                      -> create/convert persona profile
```

---

# 1. Project overview

`talent-platform-starter` is a pnpm + Turborepo monorepo. The current feature work is primarily around a TypeScript Identity service and a TypeScript Profile service, with shared packages for contracts and event schemas.

Known project context outside this feature:

- The broader application has a frontend context using Next.js 15.
- Next.js is used as frontend only in the discussed architecture.
- The backend business API context has been described as PHP in earlier project discussions.
- The current Account Upgrade implementation described here is in the TypeScript microservices monorepo, specifically Identity and Profile.

The current architectural goal is to keep authentication/identity concerns in Identity and user/persona/profile concerns in Profile, using asynchronous event propagation rather than a direct service-to-service database dependency.

---

# 2. Current architecture

## 2.1 High-level architecture

```text
                    ┌─────────────────────┐
                    │       Client        │
                    └──────────┬──────────┘
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │   Identity Service  │
                    │                     │
                    │ Auth / Sessions     │
                    │ User accountType    │
                    │ Upgrade API         │
                    └──────────┬──────────┘
                               │
                    DB transaction + Outbox
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Kafka         │
                    │  identity.events    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Profile Service   │
                    │                     │
                    │ Account mirror      │
                    │ Base Profile        │
                    │ TalentProfile       │
                    │ ProfessionalProfile │
                    └─────────────────────┘
```

## 2.2 Source-of-truth rule

Identity owns the authoritative account/persona type.

Profile stores a mirrored type so that Profile can model persona-specific data locally and serve profile operations without querying Identity for every request.

Therefore:

```text
Identity.User.accountType = source of truth
Profile.Account.type       = asynchronous mirror
```

A Profile consumer must not independently invent a new account-type transition. It consumes the transition chosen by Identity.

---

# 3. Repository structure

Only the structure explicitly established during this work is documented below. Do not infer additional services from this document.

```text
~/Projects/talent-platform-starter/
├── packages/
│   ├── contracts/
│   │   ├── account/
│   │   │   └── src/index.ts
│   │   ├── auth/
│   │   │   ├── package.json
│   │   │   └── src/
│   │   │       ├── index.ts
│   │   │       ├── jose-token-verifier.ts
│   │   │       └── token-verifier.ts
│   │   ├── src/index.ts
│   │   └── package.json
│   │
│   └── event-schemas/
│       ├── src/
│       │   ├── identity-events.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── services/
│   ├── identity/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   │       ├── 20260913100921_init_identity
│   │   │       ├── 20260914112509_add_login_identifier
│   │   │       ├── 20260914161649_add_outbox_retry_claiming
│   │   │       ├── 20260930150558_add_account_type_to_user
│   │   │       └── migration_lock.toml
│   │   ├── src/
│   │   │   ├── application/
│   │   │   │   ├── container.ts
│   │   │   │   ├── outbox/
│   │   │   │   └── use-cases/
│   │   │   │       ├── register-user.ts
│   │   │   │       ├── upgrade-account.ts
│   │   │   │       └── ...
│   │   │   ├── domain/
│   │   │   │   └── account/
│   │   │   │       └── account-type-transition.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/
│   │   │   │   ├── kafka/
│   │   │   │   ├── outbox/
│   │   │   │   ├── redis/
│   │   │   │   └── security/
│   │   │   ├── presentation/
│   │   │   │   └── http/
│   │   │   │       ├── account.routes.ts
│   │   │   │       ├── auth.routes.ts
│   │   │   │       └── error-handler.ts
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   └── workers/
│   │   │       ├── outbox-worker.ts
│   │   │       └── ...
│   │   └── tests/
│   │       ├── unit/
│   │       ├── integration/
│   │       └── ...
│   │
│   └── profile/
│       ├── src/
│       │   ├── application/
│       │   │   └── use-cases/
│       │   │       ├── handle-user-created.ts
│       │   │       ├── handle-account-type-changed.ts
│       │   │       └── ...
│       │   ├── infrastructure/
│       │   │   └── kafka/
│       │   │       └── profile-events.consumer.ts
│       │   └── ...
│       └── tests/
│           ├── unit/
│           ├── integration/
│           └── e2e/
│
└── ...other workspace/root files...
```

The repository is managed with pnpm/Turbo. The exact complete workspace tree was not reconstructed in the previous conversation, so files/services not explicitly listed here should be inspected with `git ls-files`, workspace metadata, or the repository itself rather than guessed.

---

# 4. Services and responsibilities

## 4.1 Identity Service

Identity owns:

- user identity
- authentication accounts/providers
- sessions
- access/refresh tokens
- authoritative `User.accountType`
- account upgrade authorization/business transition policy
- transactional outbox events
- publishing Identity events to Kafka

Identity must not delegate the actual account-type transition to Profile.

## 4.2 Profile Service

Profile owns:

- local account/profile mirror
- base profile data
- `TalentProfile`
- `ProfessionalProfile`
- profile APIs
- consuming Identity events
- idempotent event processing
- applying persona conversion after receiving `identity.account.type.changed`

Profile should treat Identity events as the source of truth for account/persona changes.

---

# 5. Database / schema decisions

## 5.1 Identity: `AccountType` is on `User`

The Prisma decision is:

```prisma
enum AccountType {
  USER
  TALENT
  PROFESSIONAL
}

model User {
  id          String      @id @default(uuid()) @db.Uuid
  status      UserStatus  @default(ACTIVE)
  accountType AccountType @default(USER)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?

  accounts       Account[]
  sessions       Session[]
  securityEvents SecurityEvent[]

  @@index([status])
  @@index([createdAt])
  @@map("users")
}
```

This was intentionally put on `User`, not on Identity `Account`.

Identity `Account` represents an authentication-provider credential/account, for example:

```text
provider
loginIdentifier
passwordHash
providerAccountId
userId
```

A user may have multiple authentication providers, therefore persona/account type is a property of the person/user identity, not a specific login provider record.

## 5.2 Profile mirror

Profile's local `Account` model contains the mirrored type:

```text
Account.type = USER | TALENT | PROFESSIONAL
```

Persona-specific records are represented separately:

```text
Account
 ├── Profile
 ├── TalentProfile           optional
 └── ProfessionalProfile     optional
```

The implemented conversion rules are:

```text
USER -> TALENT
  Account.type = TALENT
  create TalentProfile if missing

USER -> PROFESSIONAL
  Account.type = PROFESSIONAL
  create ProfessionalProfile if missing

TALENT -> PROFESSIONAL
  Account.type = PROFESSIONAL
  delete TalentProfile if present
  create ProfessionalProfile if missing

anything -> USER through upgrade event
  rejected
```

## 5.3 Idempotency table

Profile consumes Identity events using a `processedEvent` table/model.

The implementation uses:

```ts
tx.processedEvent.createMany({
  data: [{
    eventId: event.eventId,
    eventType: event.eventType,
  }],
  skipDuplicates: true,
});
```

First delivery => inserted row => process the event.

Duplicate delivery => zero inserted rows => return `{ processed: false }`.

This is done inside the same database transaction as the profile mutation, so a failed transaction does not leave a permanently processed marker.

## 5.4 Identity outbox

The Identity outbox model is already designed for retry/claiming. Relevant fields established during the project include:

```text
eventId
 eventType
aggregateType
aggregateId
payload
createdAt
publishedAt
attempts
nextAttemptAt
claimedAt
claimedBy
lastError
failedAt
```

The migration history includes:

```text
20260914161649_add_outbox_retry_claiming
```

and the AccountType migration:

```text
20260930150558_add_account_type_to_user
```

---

# 6. API contracts

## 6.1 Account upgrade endpoint

Implemented endpoint:

```http
POST /v1/account/upgrade
```

Authenticated request body:

```json
{
  "targetAccountType": "TALENT"
}
```

or:

```json
{
  "targetAccountType": "PROFESSIONAL"
}
```

The request schema is strict Zod validation against the shared account-type list.

The HTTP layer:

1. extracts the Bearer token
2. verifies the access token
3. obtains `userId`
4. validates `targetAccountType`
5. calls `UpgradeAccountUseCase`
6. returns the use-case result

Success response shape implemented by the route:

```json
{
  "success": true,
  "data": {
    "userId": "...",
    "previousAccountType": "USER",
    "newAccountType": "TALENT"
  }
}
```

Invalid authentication => HTTP 401.

Invalid request payload => HTTP 400 with the project's validation error shape.

Invalid/disallowed transition => conflict error (HTTP 409 in the current Identity error architecture).

## 6.2 Registration

Current registration flow uses `accountType` as part of registration input.

The intended request is:

```json
{
  "email": "...",
  "password": "...",
  "accountType": "USER"
}
```

The registration flow stores `User.accountType` and creates `identity.user.created` outbox data containing account type.

Important historical note: older tests/snippets existed that called registration without `accountType`, and those resulted in validation failures after account type became required. Any remaining old tests must be audited and updated rather than weakening the current contract unintentionally.

## 6.3 Auth endpoints

The project contains the existing authentication routes under:

```text
/v1/auth/register
/v1/auth/login
/v1/auth/refresh
/v1/auth/logout
```

A current authenticated-user/read path also exists through the existing auth/current-user use case. The exact route naming for that current-user endpoint should be read from the current `auth.routes.ts` before building new clients instead of guessing.

---

# 7. Authentication / session / JWT implementation

## 7.1 Token contents

The access token already contains:

```text
userId
sessionId
```

The JWT subject is the user id, and the session id is carried as the `sid` claim.

The access token must NOT contain `accountType`.

Reason:

```text
USER -> TALENT
```

can happen while an old access token is still valid. Putting account type into the JWT creates stale authorization/state data unless every consumer handles token invalidation or re-issuance correctly.

The authoritative current account type is therefore read from Identity/DB where needed, and Profile follows Kafka state changes asynchronously.

## 7.2 JWT implementation

The project uses JOSE and the shared auth contract package.

Access JWT characteristics established in the project:

```text
Algorithm: HS256
Issuer: configured via ACCESS_TOKEN_ISSUER
Audience: configured via ACCESS_TOKEN_AUDIENCE
Access TTL: ACCESS_TOKEN_TTL_SECONDS (currently configured as 900 in test env)
Refresh TTL: REFRESH_TOKEN_TTL_DAYS (currently configured as 30 in test env)
```

The project previously hit a JOSE/TypeScript problem around `SignJWT.setClaim`. Do not reintroduce that exact API usage without checking the currently installed JOSE types/API. Test JWT construction was adapted during the work.

## 7.3 Current Identity route authentication detail

`services/identity/src/presentation/http/account.routes.ts` currently verifies the token directly using the shared `@talent/auth` `JoseTokenVerifier`.

This is working for the account-upgrade route.

The Profile service already has its own infrastructure authentication implementation under:

```text
services/profile/src/infrastructure/security/authentication.ts
```

Long-term architectural cleanup can move route authentication behind a reusable DI/plugin abstraction, but that refactor is not required for the current feature and was not completed.

---

# 8. Events and Outbox architecture

## 8.1 Shared `AccountType`

Shared account type lives under:

```text
packages/contracts/account/src/index.ts
```

Current values:

```ts
export const ACCOUNT_TYPES = [
  "USER",
  "TALENT",
  "PROFESSIONAL",
] as const;

export type AccountType =
  (typeof ACCOUNT_TYPES)[number];
```

The root contracts package re-exports these definitions from:

```text
packages/contracts/src/index.ts
```

## 8.2 Event schema package

Events live under:

```text
packages/event-schemas/
```

The package exports its Identity event schemas through:

```text
packages/event-schemas/src/index.ts
```

with the event definitions in:

```text
packages/event-schemas/src/identity-events.ts
```

The package depends on:

```text
@talent/contracts
zod
```

## 8.3 `identity.user.created`

Current shared schema:

```text
eventId: UUID
eventType: "identity.user.created"
version: 1
producer: "identity-service"
occurredAt: ISO datetime
aggregateId: UUID
payload:
  userId: UUID
  email: email
  accountType: USER | TALENT | PROFESSIONAL
```

## 8.4 `identity.account.type.changed`

Current shared schema:

```text
eventId: UUID
eventType: "identity.account.type.changed"
version: 1
producer: "identity-service"
occurredAt: ISO datetime
aggregateId: UUID
payload:
  userId: UUID
  previousAccountType: USER | TALENT | PROFESSIONAL
  newAccountType: USER | TALENT | PROFESSIONAL
```

The Profile consumer validates incoming messages against these shared schemas instead of maintaining a second independent definition of the event envelope.

## 8.5 Identity Outbox

Identity persists state changes and the associated outbox event in the same DB transaction.

The conceptual flow is:

```text
DB update
   +
outbox insert
   = one transaction
```

The outbox publisher then sends pending events to Kafka and marks them published/retryable/failed according to the existing retry infrastructure.

The worker source currently exists at:

```text
services/identity/src/workers/outbox-worker.ts
```

The worker uses `OutboxPublisher` and `KafkaEventPublisher` and polls periodically.

Current worker defaults established in the source include:

```text
KAFKA_IDENTITY_TOPIC ?? "identity.events"
OUTBOX_BATCH_SIZE ?? "100"
OUTBOX_POLL_INTERVAL_MS ?? "1000"
```

Important environment-key detail:

The Identity `.env.test` pasted during the work contained `KAFKA_TOPIC_IDENTITY_EVENTS`, while current worker/consumer code uses `KAFKA_IDENTITY_TOPIC`. Verify the actual environment key used by each service before assuming the names are interchangeable.

## 8.6 Profile consumer

Current `services/profile/src/infrastructure/kafka/profile-events.consumer.ts` supports:

```text
identity.user.created
identity.account.type.changed
```

The current implementation:

- imports `AccountTypeChangedEventSchema` and `UserCreatedEventSchema` from `@talent/event-schemas`
- parses the shared envelope
- maps each event into the corresponding application use-case input
- supports an optional `waitForReady` mode for deterministic tests
- supports explicit topic/group/fromBeginning options
- logs processed event information

The uploaded current version of this file is 403 lines and is the latest known implementation snapshot used during the handoff.

## 8.7 Legacy `identity.user.created` compatibility

The Profile consumer also contains a compatibility path for old `identity.user.created` messages in which `accountType` was optional.

Behavior:

```text
legacy event with accountType -> process
legacy event without accountType -> log warning + ignore
```

This exists because Kafka can contain messages produced before the account type became part of the registration event contract.

## 8.8 Profile account type handler

Current file:

```text
services/profile/src/application/use-cases/handle-account-type-changed.ts
```

Current behavior:

1. Start DB transaction.
2. Insert idempotency marker with `skipDuplicates`.
3. If already processed, return `{ processed: false }`.
4. Find Profile `Account` by `event.payload.userId`.
5. Verify its current type matches `previousAccountType`.
6. Update `Account.type` to `newAccountType`.
7. Convert persona data according to target type.
8. Commit.

Defensive ordering check:

```text
Profile.Account.type must equal event.previousAccountType
```

This means Profile will reject an event that arrives against a different local state rather than silently applying an out-of-order transition.

---

# 9. Important technical decisions and why

## Decision 1 — Put account type on Identity.User

Reason:

`Account` in Identity is an authentication-provider record. Persona/account type describes the user identity, not the provider credential.

## Decision 2 — Identity is the source of truth

Reason:

Identity owns the authenticated user and authorization lifecycle. Profile mirrors the state so Profile does not become a competing authority.

## Decision 3 — No account type in JWT

Reason:

JWTs can remain valid after an account upgrade. Embedding mutable persona state risks stale claims.

## Decision 4 — Transition policy stays in Identity domain

Reason:

The valid upgrade graph is business logic, not a generic API contract. Shared packages should define values/contracts, not business rules.

## Decision 5 — Use optimistic concurrency on upgrade

The Identity use case reads the current type and performs an update constrained by the previously read type:

```text
WHERE id = userId
  AND accountType = currentAccountType
```

If the update count is not exactly 1, the operation reports a conflict because another request changed the account type concurrently.

## Decision 6 — Outbox transaction

Reason:

The account change and event must not diverge. If the DB update succeeds but the event insert fails, Profile cannot be synchronized reliably. The outbox write is therefore part of the same DB transaction.

## Decision 7 — Shared event schemas

Reason:

Identity and Profile should validate the same event contract, not carry duplicated event-envelope definitions.

## Decision 8 — Idempotent Profile consumers

Reason:

Kafka delivery can repeat. `processedEvent` ensures duplicate delivery does not create duplicate persona/profile rows.

## Decision 9 — Explicit `.js` in relative TypeScript imports

Reason:

The project uses NodeNext/ESM resolution. Relative imports therefore require the runtime `.js` suffix in source imports.

## Decision 10 — Legacy event compatibility at the consumer edge

Reason:

Existing Kafka topics can still contain older `identity.user.created` messages. The Profile consumer should handle them safely rather than crash the consumer because of missing `accountType`.

---

# 10. Problems we solved

## 10.1 AccountType missing from test database

Symptom:

```text
The column `accountType of relation users` does not exist in the current database.
```

Cause:

The migration had been applied to the development database, while integration tests were using the test database from `.env.test`.

Solution:

Applied the Identity migrations to the test database, including:

```text
20260930150558_add_account_type_to_user
```

Then the account upgrade integration suite passed 7/7.

## 10.2 Prisma migration command pointed to development DB

Running ordinary:

```bash
pnpm exec prisma migrate deploy
```

from Identity loaded the Prisma config and showed:

```text
Database "talent_platform"
```

while the tests use:

```text
talent_platform_test
```

The fix was to deploy the migration against the test DB explicitly.

## 10.3 NodeNext import failures

The project previously had many TypeScript errors of the form:

```text
TS2835: Relative import paths need explicit file extensions
```

The project was corrected to use explicit `.js` extensions for relative imports.

## 10.4 `buildApp()` accidentally became async

An earlier route registration change used `await app.register(...)`, which made `buildApp()` asynchronous and caused server/type issues.

The final approach registers the routes without awaiting the Fastify registration call at that point, preserving the synchronous `buildApp()` API.

## 10.5 Wrong location/duplication for account-type contract

The shared `AccountType` was moved conceptually to:

```text
packages/contracts
```

rather than hiding it under `packages/contracts/auth`.

## 10.6 `@talent/event-schemas` missing from Profile

Profile initially reported:

```text
Cannot find module '@talent/event-schemas'
```

The event-schemas package wiring and imports were corrected, and the TypeScript compilation error was later resolved.

## 10.7 Wrong event-handler type shape in Profile consumer

The code initially mixed envelope-level fields with payload-level fields and attempted to use fields such as `userId` on the Zod-inferred envelope object.

The current consumer explicitly maps:

```text
event.payload.userId
```

and converts the shared event schema into the use-case input shape.

## 10.8 Wrong import/export of `IdentityAccountTypeChangedEvent`

The consumer temporarily tried to import an event type directly from `handle-account-type-changed.ts` that was not exported there.

The current consumer instead derives the use-case input type from the handler's `execute` parameter type.

## 10.9 Identity Account Upgrade unit tests

The upgrade domain policy and use case tests were created.

Result:

```text
14 passed / 14 tests
```

This covered valid transitions, invalid downgrades/same-type transitions, user-not-found, and optimistic concurrency conflict handling.

## 10.10 Identity Account Upgrade integration tests

The integration test suite was created for:

```text
USER -> TALENT
USER -> PROFESSIONAL
TALENT -> PROFESSIONAL
invalid downgrades
unauthenticated request
invalid account type
```

After migrating the test DB:

```text
7 passed / 7 tests
```

---

# 11. Problems still unresolved

## 11.1 Current blocking issue: PostgreSQL is not reachable during Profile integration tests

The latest Profile integration run failed with:

```text
Can't reach database server at 127.0.0.1:5432
```

The same infrastructure failure caused multiple Profile integration suites to fail, including:

```text
profile-update.test.ts
user-created-kafka.test.ts
failure/kafka-redelivery.test.ts
failure/profile-transaction.test.ts
```

This is currently an environment/database availability problem, not a TypeScript compile problem.

The current Profile TypeScript compilation was reported as resolved before the latest runtime run.

## 11.2 Full AccountTypeChanged Kafka test has not yet passed end-to-end

The consumer and handler are implemented, but there is not yet a final green end-to-end result proving:

```text
Identity DB update
  -> Outbox
  -> Kafka
  -> Profile consumer
  -> Profile Account conversion
```

for the account upgrade flow.

## 11.3 Verify Outbox envelope mapping for `identity.account.type.changed`

The shared event schema expects envelope-level fields:

```text
version
producer
occurredAt
aggregateId
```

while the current `UpgradeAccountUseCase` outbox payload for the account-type-changed event contains the business payload:

```text
userId
previousAccountType
newAccountType
```

The use case also computes `occurredAt`, but the current code snapshot does not directly place it in the business payload.

Before declaring the full path complete, verify that `OutboxPublisher`/`KafkaEventPublisher` constructs the final envelope exactly as required by `@talent/event-schemas`.

Do not blindly add duplicated envelope fields to the business payload until the publisher implementation has been checked.

## 11.4 Environment variable naming needs cleanup/verification

Known names in code/config are not perfectly consistent:

```text
KAFKA_IDENTITY_TOPIC
KAFKA_TOPIC_IDENTITY_EVENTS
```

The consumer/worker code currently uses `KAFKA_IDENTITY_TOPIC` with a fallback to `identity.events`.

The pasted Identity `.env.test` contained `KAFKA_TOPIC_IDENTITY_EVENTS`.

Verify the actual files before making the next configuration change.

## 11.5 Worker file/script naming needs verification

The actual worker source documented in current project context is:

```text
services/identity/src/workers/outbox-worker.ts
```

There was an earlier command/script mismatch where output referenced an older `outbox.worker.ts` name.

Before changing worker logic, run `git grep -n "outbox\.worker\|outbox-worker"` and make the script/import/file name consistent.

## 11.6 Historical Profile authentication test failures

Earlier Profile E2E runs had two authenticated-profile tests returning 401 even though registration and non-auth validation tests passed.

This was previously traced to token verification behavior in Profile. The latest test run was blocked earlier by database reachability, so the authentication issue is not currently re-verified as fixed.

Treat this as a historical open item that must be re-tested after infrastructure is stable.

## 11.7 Historical Profile full-suite failures

A previous full Profile integration run had failures unrelated to the Account Upgrade feature, including authenticated profile GET/update failures and an earlier USER event timeout.

Because the latest run was blocked by PostgreSQL availability, their final current status is unknown.

Do not assume those tests are fixed or broken until re-run with a healthy test environment.

---

# 12. Current implementation status

| Area | Status | Notes |
|---|---|---|
| Shared `AccountType` | ✅ Implemented | `packages/contracts` |
| Identity `User.accountType` | ✅ Implemented | Prisma schema + migration |
| Identity upgrade transition policy | ✅ Implemented | USER→TALENT/PROFESSIONAL; TALENT→PROFESSIONAL |
| Identity upgrade use case | ✅ Implemented | Transaction + optimistic concurrency |
| `POST /v1/account/upgrade` | ✅ Implemented | Authenticated + Zod validation |
| Identity account upgrade unit tests | ✅ Green | 14/14 |
| Identity account upgrade integration tests | ✅ Green | 7/7 |
| Shared identity event schemas | ✅ Implemented | user-created + account-type-changed |
| Profile user-created handler | ✅ Implemented | Transaction + idempotency |
| Profile account-type-changed handler | ✅ Implemented | Transaction + persona conversion |
| Profile Kafka consumer | ✅ Implemented | Handles both events + legacy compatibility |
| Profile TypeScript compilation | ✅ Current reported state | `tsc --noEmit` resolved |
| Profile DB integration runtime | ❌ Blocked | PostgreSQL unreachable at `127.0.0.1:5432` |
| Outbox→Kafka→Profile upgrade E2E | ⏳ Not yet green | Must run after DB/infrastructure repair |
| Full Profile regression suite | ⏳ Not re-verified | Historical failures exist |

---

# 13. Files created/modified during this work

This list contains the files explicitly created, modified, or retrieved as part of the feature work. It is not a substitute for `git diff`.

## Shared contracts

```text
packages/contracts/account/src/index.ts
packages/contracts/src/index.ts
packages/contracts/package.json
```

## Shared event schemas

```text
packages/event-schemas/package.json
packages/event-schemas/tsconfig.json
packages/event-schemas/src/index.ts
packages/event-schemas/src/identity-events.ts
```

## Identity source/schema

```text
services/identity/prisma/schema.prisma
services/identity/prisma/migrations/20260930150558_add_account_type_to_user/migration.sql
```

## Identity application/domain/http

```text
services/identity/src/domain/account/account-type-transition.ts
services/identity/src/application/use-cases/upgrade-account.ts
services/identity/src/application/use-cases/register-user.ts
services/identity/src/application/container.ts
services/identity/src/app.ts
services/identity/src/presentation/http/account.routes.ts
```

## Identity worker/outbox area

```text
services/identity/src/workers/outbox-worker.ts
```

Also inspect the existing:

```text
services/identity/src/application/outbox/outbox-publisher.ts
services/identity/src/infrastructure/kafka/kafka-event-publisher.ts
```

before changing the event envelope/publishing behavior.

## Identity tests

```text
services/identity/tests/unit/domain/account-type-transition.test.ts
services/identity/tests/unit/application/upgrade-account.test.ts
services/identity/tests/integration/account/upgrade.test.ts
```

## Profile event handling

```text
services/profile/src/application/use-cases/handle-user-created.ts
services/profile/src/application/use-cases/handle-account-type-changed.ts
services/profile/src/infrastructure/kafka/profile-events.consumer.ts
```

## Profile tests already relevant to the event flow

```text
services/profile/tests/integration/user-created-kafka.test.ts
services/profile/tests/integration/failure/kafka-redelivery.test.ts
services/profile/tests/integration/failure/profile-transaction.test.ts
services/profile/tests/e2e/register-to-profile.e2e.test.ts
services/profile/tests/e2e/authenticated-profile.e2e.test.ts
```

Use `git diff --name-only` in the repository to get the authoritative modified-file list before committing.

---

# 14. Important commands

## 14.1 Root/project location

```bash
cd ~/Projects/talent-platform-starter
```

## 14.2 Identity

Build:

```bash
pnpm --filter @talent/identity-service build
```

Account upgrade integration test:

```bash
pnpm --filter @talent/identity-service exec vitest run \
  tests/integration/account/upgrade.test.ts
```

Identity unit tests used during the work:

```bash
pnpm --filter @talent/identity-service exec vitest run \
  tests/unit/domain/account-type-transition.test.ts \
  tests/unit/application/upgrade-account.test.ts
```

## 14.3 Identity test DB migration

Go to Identity:

```bash
cd ~/Projects/talent-platform-starter/services/identity
```

List migrations:

```bash
ls prisma/migrations
```

The important AccountType migration is:

```text
20260930150558_add_account_type_to_user
```

Deploy to the same test DB used by `.env.test`:

```bash
DATABASE_URL='<same DATABASE_URL as services/identity/.env.test>' \
pnpm exec prisma migrate deploy
```

Then generate Prisma Client:

```bash
pnpm exec prisma generate
```

Important: running plain `pnpm exec prisma migrate deploy` used the development DB (`talent_platform`) in the previous environment, not the test DB. Verify the URL before applying migrations.

## 14.4 Profile TypeScript

```bash
pnpm --filter @talent/profile-service exec tsc -p tsconfig.json --noEmit
```

At the latest known point this compilation problem was resolved.

## 14.5 Run one Profile integration test correctly

Because the Profile package test script already passes `tests/integration`, this command:

```bash
pnpm --filter @talent/profile-service test:integration -- tests/integration/user-created-kafka.test.ts
```

previously caused the integration directory to be included rather than cleanly isolating a single file.

Use direct Vitest execution for an isolated file:

```bash
pnpm --filter @talent/profile-service exec vitest run \
  --config vitest.config.mts \
  tests/integration/user-created-kafka.test.ts
```

## 14.6 Full Profile integration suite

```bash
pnpm --filter @talent/profile-service test:integration
```

Only run this after PostgreSQL/Kafka test infrastructure is healthy.

## 14.7 Environment / DB availability check

The latest blocking error was:

```text
Can't reach database server at 127.0.0.1:5432
```

First check:

```bash
pg_isready -h 127.0.0.1 -p 5432
```

If this project environment uses a local systemd PostgreSQL service, the relevant commands are:

```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

If PostgreSQL is run through another mechanism (for example an existing container setup), use that existing project-specific startup mechanism instead of introducing a new infrastructure layout.

## 14.8 Kafka availability

The known test broker configuration is:

```text
KAFKA_BROKERS=localhost:9092
```

The current Profile consumer defaults to:

```text
identity.events
```

The exact topic/environment configuration should be verified from current `.env.test` files before changing it.

## 14.9 Useful repository inspection

```bash
git status --short
```

```bash
git diff --name-only
```

```bash
git grep -n "outbox\\.worker\|outbox-worker"
```

```bash
git grep -n "KAFKA_IDENTITY_TOPIC\|KAFKA_TOPIC_IDENTITY_EVENTS"
```

These are especially useful before touching the unresolved worker/config naming issues.

---

# 15. Testing strategy and current test status

## 15.1 Unit tests

Unit tests are used for pure/domain/application behavior:

- transition matrix
- use-case error behavior
- concurrency conflict behavior

Current known result:

```text
14 passed / 14 tests
```

## 15.2 Identity integration tests

These verify Fastify + authentication + Prisma + actual test DB behavior.

Current Account Upgrade integration result:

```text
7 passed / 7 tests
```

This is the strongest currently verified result for the feature on the Identity side.

## 15.3 Profile Kafka integration tests

The existing Profile Kafka test architecture starts a real Kafka consumer with a test-specific consumer group and verifies database mutations after delivery.

It also tests duplicate delivery.

The Profile consumer supports `waitForReady`, which was added specifically to reduce race conditions where a producer publishes before the test consumer has actually joined the group.

The latest run, however, was blocked by PostgreSQL reachability. The test output reported Kafka consumer group joins successfully, followed by Prisma `P1001` errors against `127.0.0.1:5432`.

## 15.4 Failure/redelivery tests

Existing Profile tests cover:

- transaction failure rollback
- Kafka redelivery after Profile processing failure
- duplicate event handling

These are important regression tests for the outbox/Kafka architecture.

## 15.5 E2E tests

There is an existing:

```text
services/profile/tests/e2e/register-to-profile.e2e.test.ts
```

Historical result:

```text
8 passed / 8 tests
```

That historical run covered registration -> Kafka -> Profile for USER, TALENT and PROFESSIONAL.

There is also:

```text
services/profile/tests/e2e/authenticated-profile.e2e.test.ts
```

A historical run had 2 authenticated-profile failures returning 401 while other tests passed. This needs re-verification.

## 15.6 Account Upgrade end-to-end test still needed

The missing final regression test should prove:

```text
1. Create a user in Identity.
2. Allow identity.user.created to create the Profile structure.
3. Call POST /v1/account/upgrade.
4. Confirm Identity.User.accountType changed.
5. Confirm an identity.account.type.changed outbox event exists.
6. Publish the outbox event through the actual OutboxPublisher/KafkaEventPublisher path.
7. Confirm Profile consumes it.
8. Confirm Profile.Account.type changed.
9. Confirm persona profile conversion happened.
10. Deliver the same event again and confirm no duplicate conversion occurs.
```

That is the core remaining proof for the feature.

---

# 16. Remaining TODOs

## P0 — Blocking

1. Restore PostgreSQL availability at `127.0.0.1:5432` for the Profile test environment.
2. Verify Profile `.env.test` points to the intended test DB.
3. Verify the Profile test DB schema is current before rerunning Kafka tests.
4. Run the isolated Profile Kafka integration test with direct Vitest execution.

## P1 — Feature completion

5. Create or finish a dedicated `identity.account.type.changed` Kafka integration test.
6. Verify OutboxPublisher/KafkaEventPublisher envelope mapping for `identity.account.type.changed`.
7. Add the full upgrade E2E path: Identity API -> Outbox -> Kafka -> Profile.
8. Verify duplicate account-type-changed events are idempotent.
9. Verify USER -> TALENT and USER -> PROFESSIONAL conversions.
10. Verify TALENT -> PROFESSIONAL removes TalentProfile and creates ProfessionalProfile.

## P1 — Reliability / ordering

11. Confirm Kafka message key/partitioning strategy preserves ordering for account-type events for the same user. This is a verification item, not an implementation claim.
12. Decide how Profile should recover if an out-of-order event is received and fails the previousAccountType guard. Current code fails the transaction, which is intentionally defensive, but the surrounding retry semantics must be verified.

## P2 — Cleanup

13. Align `KAFKA_IDENTITY_TOPIC` vs `KAFKA_TOPIC_IDENTITY_EVENTS` naming.
14. Align `outbox-worker.ts` vs any stale `outbox.worker` references.
15. Re-run Profile authenticated E2E tests after DB recovery.
16. Audit old registration tests that omit `accountType`.
17. Consider moving account-route authentication behind a reusable DI/auth plugin instead of constructing `JoseTokenVerifier` directly in the route.
18. Confirm all package dependency wiring is workspace-safe and does not depend on accidental root resolution.

---

# 17. Exact next steps for the new conversation

Do these in this order.

## Step 1 — Fix database availability

From any terminal:

```bash
pg_isready -h 127.0.0.1 -p 5432
```

If it is not ready, start the PostgreSQL instance using the existing local/container setup.

## Step 2 — Verify Profile test database

Inspect the non-secret `DATABASE_URL` target inside:

```text
services/profile/.env.test
```

Do not copy secrets into the chat. Only confirm that the host/port/database are correct.

## Step 3 — Verify Profile Prisma migrations

```bash
cd ~/Projects/talent-platform-starter/services/profile
pnpm exec prisma migrate status
```

If migrations are pending, deploy them against the SAME database used by Profile tests. Do not use a different development DB accidentally.

## Step 4 — Re-run Profile compilation

```bash
pnpm --filter @talent/profile-service exec tsc -p tsconfig.json --noEmit
```

Expected result: no TypeScript errors.

## Step 5 — Run only the user-created Kafka test

```bash
pnpm --filter @talent/profile-service exec vitest run \
  --config vitest.config.mts \
  tests/integration/user-created-kafka.test.ts
```

Do not use the earlier `test:integration -- tests/...` form for isolation.

## Step 6 — Inspect the real Outbox publisher before writing the upgrade E2E

Read:

```text
services/identity/src/application/outbox/outbox-publisher.ts
services/identity/src/infrastructure/kafka/kafka-event-publisher.ts
services/identity/src/workers/outbox-worker.ts
```

Specifically verify how an outbox row becomes the final Kafka event envelope and where these fields are added:

```text
version
producer
occurredAt
aggregateId
payload
```

## Step 7 — Add account-type-changed Kafka integration coverage

The test should publish a valid `identity.account.type.changed` event and assert the Profile database conversion.

At minimum cover:

```text
USER -> TALENT
USER -> PROFESSIONAL
TALENT -> PROFESSIONAL
duplicate delivery
```

For the handler unit/integration conversion tests, also assert the final state of:

```text
Account.type
TalentProfile
ProfessionalProfile
ProcessedEvent
```

## Step 8 — Add the true Outbox -> Kafka -> Profile upgrade E2E

The preferred final test shape is:

```text
register user
   ↓
identity.user.created
   ↓
profile exists
   ↓
POST /v1/account/upgrade
   ↓
Identity.User updated
   ↓
identity.account.type.changed outbox row
   ↓
OutboxPublisher publishes
   ↓
Kafka
   ↓
Profile consumer
   ↓
Profile persona conversion
```

## Step 9 — Re-run Profile regression suites

First:

```bash
pnpm --filter @talent/profile-service test:integration
```

Then:

```bash
pnpm --filter @talent/profile-service exec vitest run \
  --config vitest.config.mts \
  tests/e2e
```

The old failures must be treated as historical until verified again.

## Step 10 — Finish cleanup after the feature is green

Only after the functional path is green:

```bash
git grep -n "outbox\\.worker\|outbox-worker"
git grep -n "KAFKA_IDENTITY_TOPIC\|KAFKA_TOPIC_IDENTITY_EVENTS"
```

Then remove naming inconsistencies and re-run the relevant suites.

---

# 18. Detailed current code behavior reference

## 18.1 Identity transition policy

Current policy:

```ts
const UPGRADE_TRANSITIONS: Record<
  AccountType,
  readonly AccountType[]
> = {
  USER: ["TALENT", "PROFESSIONAL"],
  TALENT: ["PROFESSIONAL"],
  PROFESSIONAL: [],
};
```

Function:

```text
isAccountUpgradeAllowed(currentAccountType, targetAccountType)
```

## 18.2 Upgrade use case flow

Current logic:

```text
find User by userId
↓
not found -> NOT_FOUND
↓
read current accountType
↓
check transition policy
↓
reject disallowed transition with CONFLICT
↓
UPDATE user
  WHERE id = input.userId
  AND accountType = currentAccountType
↓
if updated.count !== 1 -> concurrent-change conflict
↓
create identity.account.type.changed outbox row
↓
return previous/new types
```

The DB mutation and outbox insert are inside one transaction.

## 18.3 Profile account-type-changed flow

Current logic:

```text
start transaction
↓
insert processedEvent with skipDuplicates
↓
if duplicate -> processed:false
↓
find Profile.Account by userId
↓
require Account.type === previousAccountType
↓
set Account.type = newAccountType
↓
switch newAccountType
    TALENT:
      reject if professionalProfile exists
      create TalentProfile if missing

    PROFESSIONAL:
      delete TalentProfile if present
      create ProfessionalProfile if missing

    USER:
      reject
↓
commit
```

---

# 19. Testing/environment notes that should not be forgotten

1. Tests load `.env.test` in the services. Previous test output showed explicit `.env.test` injection.
2. Identity and Profile can have separate Prisma schemas/databases/configuration. Never assume one service's migration command updates another service's DB.
3. Kafka topic names in old test logs included both `identity.events` and `identity.events.test` depending on the suite.
4. The Profile consumer defaults to `identity.events`, but tests can override `topic`.
5. Profile consumer test groups are intentionally unique in integration tests to avoid cross-test consumer interference.
6. `waitForReady` exists specifically to remove the race between starting the Kafka consumer and publishing the test event.
7. Duplicate-delivery handling is intentionally part of the design and must remain transactional.
8. Do not solve the current PostgreSQL failure by changing application code until DB availability/configuration is checked.

---

# 20. What is implemented vs what is only a proposal

## Implemented

- `AccountType` contract in `packages/contracts`.
- `User.accountType` in Identity Prisma.
- AccountType migration `20260930150558_add_account_type_to_user`.
- Identity upgrade transition policy.
- Identity `UpgradeAccountUseCase`.
- `POST /v1/account/upgrade`.
- transactional account update + outbox write.
- shared Identity event schemas.
- Profile `HandleAccountTypeChangedUseCase`.
- Profile consumer support for the two Identity event types.
- Profile legacy compatibility path for old user-created events.
- Profile idempotency via `processedEvent`.
- Identity account-upgrade unit tests (14/14).
- Identity account-upgrade integration tests (7/7).
- Profile TypeScript compilation fix.

## Not yet proven green / still to complete

- Full Outbox -> Kafka -> Profile account upgrade E2E.
- Current Profile Kafka integration run after restoring PostgreSQL.
- Full current Profile regression suite.
- Final event-envelope verification for account-type-changed publishing.
- Kafka ordering/keying verification for multiple transitions of one user.

## Proposals / cleanup only

- Reusable authentication DI/plugin in Identity.
- Environment variable renaming cleanup.
- Worker filename/script cleanup.
- Additional operational polish.

Do not describe proposals as already implemented.

---

# 21. Secrets and sensitive configuration

The original conversation contained actual test credentials/secrets in `.env.test` messages.

They are intentionally NOT reproduced here.

Known variable names that exist in the Identity test environment include:

```text
DATABASE_URL
REDIS_URL
KAFKA_BROKERS
NODE_ENV
KAFKA_CLIENT_ID
KAFKA_TOPIC_IDENTITY_EVENTS
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_ISSUER
ACCESS_TOKEN_AUDIENCE
ACCESS_TOKEN_TTL_SECONDS
REFRESH_TOKEN_TTL_DAYS
IP_HASH_SECRET
```

Use the local `.env.test` files directly. Do not paste secret values into a new ChatGPT conversation unless there is a specific reason and it is safe to do so.

---

# 22. Recommended first message in the new conversation

Paste this file and say:

```text
This is the PROJECT_CONTEXT.md for talent-platform-starter.
Read it as the current source-of-context and continue from the exact next steps.
Do not redesign the architecture unless the current code proves the design is wrong.
The immediate goal is to finish and verify Outbox -> Kafka -> Profile for account upgrades.
The last known blocker is PostgreSQL unreachable at 127.0.0.1:5432 during Profile integration tests.
```

Then continue with the terminal output from the first healthy Profile integration run.

---

# 23. Final state summary

The Account Upgrade feature is **mostly implemented on the Identity side and structurally implemented on the Profile side**.

The strongest verified green results are:

```text
Identity AccountType policy/use-case unit tests:      14/14 ✅
Identity Account Upgrade integration tests:             7/7 ✅
Profile TypeScript compile:                              resolved ✅
```

The main missing proof is:

```text
POST /v1/account/upgrade
        ↓
Identity Outbox
        ↓
Kafka
        ↓
Profile consumer
        ↓
Profile persona conversion
```

The latest attempt to continue that path was blocked by:

```text
Can't reach database server at 127.0.0.1:5432
```

Therefore the next conversation should start by restoring/validating PostgreSQL connectivity, then run the isolated Profile Kafka test, inspect the Outbox event envelope publisher, and finish the dedicated account-type-changed E2E test.

