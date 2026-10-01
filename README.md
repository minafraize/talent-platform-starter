# Talent Platform

Global social network for talent.

## Stack

- Node.js 24 LTS
- Next.js 16.3
- React 19.2
- pnpm + Turborepo
- PostgreSQL
- Redis
- Kafka
- OpenSearch
- S3-compatible object storage

## Local setup

1. Install Node 24.20.0 and pnpm.
2. Run `pnpm install`.
3. Start infrastructure with `docker compose -f infrastructure/docker/docker-compose.yml up -d`.
4. Run `pnpm dev`.

## Current state

This is the foundation skeleton. The next implementation step is the Identity service contract, PostgreSQL schema, migrations, Redis integration, Kafka event contract, and API gateway routing.
