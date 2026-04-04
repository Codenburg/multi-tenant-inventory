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

---

## Tech Stack

- [NestJS](https://nestjs.com/) — Node.js framework
- [Prisma](https://www.prisma.io/) — ORM
- [PostgreSQL](https://www.postgresql.org/) — Database
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
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| GET | `/products/:id` | Get a product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### Variants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/variants` | List variants |
| POST | `/variants` | Create a variant |
| PUT | `/variants/:id` | Update a variant |
| PATCH | `/variants/:id/stock` | Update stock |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sales` | List sales |
| POST | `/sales` | Register a sale |

### Returns
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/returns` | Register a return |

### Metrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/metrics/monthly-sales` | Monthly sales summary |
| GET | `/metrics/top-products` | Top sold products |

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
│   ├── auth/
│   ├── stores/
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

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the architecture guidelines below
4. Run the build and linter before submitting:
   ```bash
   npm run build
   npm run lint
   ```
5. Open a Pull Request with a clear description of the change

### Guidelines

- Follow the `Controller → Service → Domain → Repository` architecture strictly
- Every query must include `store_id` for tenant isolation
- Business logic belongs in the domain layer only
- All inputs must be validated via DTOs using `class-validator`
- All responses must follow `{ data, error }` format

---

## Roadmap

- Product search
- CSV export for sales
- Barcode scanner support
- Customer management
- Price history
- POS-optimized sales screen

---

*Built for small retail stores. Designed to be fast, simple, and scalable.*