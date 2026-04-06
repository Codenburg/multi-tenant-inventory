# Contributing to Stockly

We welcome contributions! Please follow these guidelines to maintain code quality and consistency.

---

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/multi-tenant-inventory.git
   cd multi-tenant-inventory
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### 1. Make Changes

Follow the architecture rules:

- **Controller** → handles HTTP input/output only, no business logic
- **Service** → orchestrates use cases, no core business rules
- **Domain** → pure business logic, no framework dependencies
- **Repository** → only layer that accesses Prisma

### 2. Follow Coding Standards

- Use `Controller → Service → Domain → Repository` flow strictly
- Every query MUST filter by `store_id` for tenant isolation
- All inputs MUST be validated via DTOs using `class-validator`
- All responses MUST follow `{ data, error }` format
- Business logic belongs in the domain layer only
- Never access Prisma outside the repository layer

### 3. Run Quality Checks

Before submitting a PR, run:

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

### 4. Commit Your Changes

Use conventional commits:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "refactor: improve code structure"
```

### 5. Open a Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a PR with a clear description
3. Reference any related issues

---

## Project Structure

```
src/
├── modules/
│   ├── auth/          # Auth configuration (Better Auth)
│   ├── stores/        # Store management
│   ├── products/       # Product catalog
│   ├── variants/       # Product variants
│   ├── sales/          # Sales transactions
│   ├── returns/        # Returns handling
│   └── metrics/        # Dashboard metrics
├── domain/            # Pure business logic
├── common/            # Shared utilities
├── config/            # Environment config
└── prisma/            # Database schema
```

---

## Modules Overview

| Module     | Responsibility                                |
| ---------- | --------------------------------------------- |
| `auth`     | Better Auth configuration, session management |
| `stores`   | Store entity and relations                    |
| `products` | Product catalog management                    |
| `variants` | Product variants with stock/pricing           |
| `sales`    | Sale transactions                             |
| `returns`  | Return processing                             |
| `metrics`  | Analytics and reporting                       |

---

## Multi-Tenancy Rules

Every entity MUST have a `store_id` field. Every query MUST filter by `store_id`.

```typescript
// ✅ Correct
const products = await this.prisma.product.findMany({
  where: { store_id: session.user.storeId },
});

// ❌ Wrong - never skip store_id
const products = await this.prisma.product.findMany();
```

---

## Testing Guidelines

- Write unit tests for domain logic
- Write integration tests for services
- Keep tests independent and reproducible
- Use descriptive test names

---

## Questions?

Open an issue for discussion before starting large changes.

---

_Thank you for contributing to Stockly!_
