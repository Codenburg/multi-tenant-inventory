# Skills

Always read the relevant skill **before** writing any code or reviewing architecture.

| Task | Skill |
|------|-------|
| Creating or editing a module (products, sales, variants, returns, metrics, auth) | `stockly-dev` |
| Adding or modifying an endpoint | `stockly-dev` |
| Writing Prisma queries or migrations | `stockly-dev` |
| Reviewing code for architecture violations | `stockly-dev` |
| Any NestJS / backend task in this repo | `stockly-dev` |

---

## Architecture

All code must follow this flow — no exceptions:

```
Controller → Service → Domain → Repository
```

Never skip layers. Never place business logic outside the domain layer. Never access Prisma outside the repository layer.

---

## Non-negotiable rules

- Every query **must** filter by `store_id`
- Controllers handle HTTP only — no business logic, no Prisma
- Repositories are the only layer that touches Prisma
- All inputs must be validated via DTOs using `class-validator`
- All responses must follow `{ data, error }` format
- Modules must remain isolated — no cross-module internal imports

---

## Reference docs

| File | Purpose |
|------|---------|
| `config.yaml` | Architecture rules and conventions |
| `data-models.md` | Prisma schema reference |
| `business-rules.md` | Domain rules (stock, pricing, returns) |
| `api.md` | REST endpoint definitions |
| `architecture.md` | Module structure and layer responsibilities |