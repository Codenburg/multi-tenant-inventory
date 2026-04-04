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

## Multi-Tenant Strategy
- Each table includes `store_id`
- Guards ensure requests only access current store
- Example: `@UseGuards(StoreGuard)` for controllers
- Queries automatically filter by `store_id`

## API Strategy
- REST endpoints for all resources
- Controllers → Services → Repositories (Prisma)
- Validation using class-validator
- DTOs for input/output