# Architecture — NestJS SaaS

## Repositories

Backend:
- multi-tenant-inventory (NestJS API)
The backend is a standalone NestJS API consumed by external clients. It provides REST endpoints for all resources and handles business logic, data access, and multi-tenancy.

Frontend:
- (future) stockly-web (Next.js client)

## Stack
- Backend: NestJS
- ORM: Prisma
- Database: PostgreSQL
- Frontend: React / Next.js
- Styling: TailwindCSS
- Auth: Better Auth (`better-auth` + `@thallesp/nestjs-better-auth`)
- Hosting: Vercel (frontend) / Node server (backend)
- Database Hosting: Neon / managed Postgres

## Structure
NestJS modular design:

/src
 ├─ modules/
 │   ├─ auth/
 │   ├─ stores/
 │   ├─ products/
 │   ├─ variants/
 │   ├─ sales/
 │   ├─ returns/
 │   └─ metrics/
 ├─ common/
 │   ├─ guards/
 │   ├─ interceptors/
 │   └─ filters/
 ├─ config/
 └─ main.ts

## Auth Strategy
- **Provider**: Better Auth (`better-auth` + `@thallesp/nestjs-better-auth`)
- Better Auth is mounted via `AuthModule.forRoot({ auth })` in `AppModule`
- All auth routes handled under `/api/auth/*` (sign-up, sign-in, sign-out, session)
- Sessions are cookie-based (HTTP-only, secure)
- The `@Session()` decorator injects the authenticated user into controllers
- `store_id` is read from `session.user.store_id` — no separate StoreGuard needed
- `bodyParser: false` must be set in `NestFactory.create()` (Better Auth handles it)
- All non-auth routes are protected globally via `BetterAuthGuard`
- Public routes use `@AllowAnonymous()` decorator

### Better Auth Prisma tables (auto-generated, do not edit manually)
- `user` — id, email, name, store_id (custom field), createdAt, updatedAt
- `session` — id, userId, token, expiresAt, createdAt, updatedAt
- `account` — id, userId, providerId, accountId, ...
- `verification` — id, identifier, value, expiresAt

### Auth flow (sign-up)
1. Client calls `POST /api/auth/sign-up/email` with `{ email, password, name }`
2. Better Auth creates `user` + `session` records in Postgres via Prisma
3. A `store` record is created for the new user (via Better Auth hook → `StoresService`)
4. `store_id` is written to `user.store_id`
5. Session cookie is set on the response

### Auth flow (sign-in)
1. Client calls `POST /api/auth/sign-in/email` with `{ email, password }`
2. Better Auth validates credentials and returns a session cookie
3. All subsequent requests carry the cookie; `@Session()` provides `user` + `session`

## Multi-Tenant Strategy
- Each table includes `store_id`
- `store_id` is sourced from `session.user.store_id` on every request
- Queries automatically filter by `store_id`
- No cross-tenant access is possible since `store_id` comes from the verified session

## API Strategy
- REST endpoints for all resources
- Controllers → Services → Repositories (Prisma)
- Validation using class-validator
- DTOs for input/output