# ADR-001: Domain-oriented microservices from day one

## Decision
Use domain-oriented microservices from the beginning. Services own their data and communicate through REST/gRPC for synchronous operations and Kafka events for asynchronous workflows.

## Initial services
- Identity
- Profile
- Social
- Content
- Media
- Feed
- Discovery
- Search
- Messaging
- Notification
- Community
- Challenge
- Verification
- Moderation
- Recommendation

## Constraints
- No cross-service database foreign keys.
- No direct database access from another service.
- Shared packages contain contracts/utilities only, not business logic.
- Important event-producing writes use the transactional outbox pattern.
