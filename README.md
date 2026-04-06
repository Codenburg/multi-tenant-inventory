# Stockly — Inventory Management API

A modular, multi-tenant inventory and sales management system for small retail stores.

Built with **NestJS + Prisma + PostgreSQL**.

---

## Features

- Multi-tenant architecture — each store's data is fully isolated
- Product catalog with dynamic variants (size, color, etc.)
- Sales registration with automatic stock management
- Returns with stock restoration
- Dashboard metrics (monthly sales, top products)
- Low stock alerts
- Cookie-based session authentication (Better Auth)

---

## Tech Stack

- [NestJS](https://nestjs.com/) — Node.js framework
- [Prisma](https://www.prisma.io/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — Database
- [Better Auth](https://www.better-auth.com/) — Authentication
- TypeScript

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Codenburg/multi-tenant-inventory.git
cd multi-tenant-inventory

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

### Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/stockly_db
BETTER_AUTH_SECRET=your-secret-key-at-least-32-chars
PORT=3000
```

---

## Authentication

All API endpoints (except auth routes) require authentication via session cookie.

### Auth Endpoints

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | `/api/auth/sign-up/email` | Register new user + store |
| POST   | `/api/auth/sign-in/email` | Sign in                   |
| POST   | `/api/auth/sign-out`      | Sign out                  |
| GET    | `/api/auth/get-session`   | Get current session       |

### Using the API

1. Sign up or sign in to receive a session cookie
2. Include the cookie in subsequent requests
3. Protected routes return `401` without a valid session

---

## API Endpoints

### Products

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/products`     | List all products |
| GET    | `/api/products/:id` | Get a product     |
| POST   | `/api/products`     | Create a product  |
| PUT    | `/api/products/:id` | Update a product  |
| DELETE | `/api/products/:id` | Delete a product  |

### Variants

| Method | Endpoint                  | Description      |
| ------ | ------------------------- | ---------------- |
| GET    | `/api/variants`           | List variants    |
| POST   | `/api/variants`           | Create a variant |
| PUT    | `/api/variants/:id`       | Update a variant |
| PATCH  | `/api/variants/:id/stock` | Update stock     |

### Sales

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/api/sales` | List sales      |
| POST   | `/api/sales` | Register a sale |

### Returns

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | `/api/returns` | Register a return |

### Metrics

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/metrics/monthly-sales` | Monthly sales summary |
| GET    | `/api/metrics/top-products`  | Top sold products     |

---

## Architecture

The project follows a strict layered architecture:

```
Controller → Service → Domain → Repository
```

- **Controller** — handles HTTP input/output only
- **Service** — orchestrates use cases
- **Domain** — pure business logic (no framework dependencies)
- **Repository** — only layer that accesses Prisma

Multi-tenancy is enforced via `store_id` on every entity and every query.

---

## Project Structure

```
src/
├── modules/
│   ├── auth/          # Better Auth configuration
│   ├── stores/        # Store management
│   ├── products/
│   ├── variants/
│   ├── sales/
│   ├── returns/
│   └── metrics/
├── domain/        # Pure business logic
├── common/        # Guards, interceptors, filters
├── config/
└── main.ts
```

_Built for small retail stores. Designed to be fast, simple, and scalable._
