---
name: stockly-dev
description: >
  Guía de desarrollo para Stockly, un SaaS de inventario multi-tenant en NestJS + Prisma + PostgreSQL.
  Usá este skill siempre que el usuario pida generar código para Stockly: módulos, endpoints, servicios,
  repositorios, DTOs, migraciones de Prisma, o cualquier feature del backend. También usalo cuando el
  usuario pida revisar código existente para detectar violaciones de arquitectura. Si la tarea involucra
  NestJS, Prisma, multi-tenant, store_id, o cualquier módulo del proyecto (products, sales, variants,
  returns, metrics, auth), este skill debe activarse.
---

# Stockly Dev Skill

Stockly es un SaaS de gestión de inventario y ventas para pequeños comercios minoristas.
Este skill te da todo el contexto necesario para generar código correcto y consistente desde el primer día.

---

## Stack

- **Backend**: NestJS + TypeScript
- **ORM**: Prisma
- **DB**: PostgreSQL
- **Frontend**: Next.js (cliente separado, no parte de este repo)
- **Testing**: Jest
- **Package manager**: npm

---

## Arquitectura: flujo obligatorio

Todo el código DEBE seguir este flujo sin excepciones:

```
Controller → Service → Domain → Repository
```

### Responsabilidades por capa

| Capa | Responsabilidad |
|------|-----------------|
| **Controller** | Recibir HTTP, validar DTO de entrada, devolver respuesta. Nada más. |
| **Service** | Orquestar casos de uso. Coordina domain + repository. |
| **Domain** | Lógica de negocio pura. Sin framework, sin Prisma. |
| **Repository** | Único lugar que accede a Prisma. Sin lógica de negocio. |

### Violaciones frecuentes a evitar

- ❌ Lógica de negocio en el controller
- ❌ Acceso directo a Prisma desde service o controller
- ❌ Reglas de negocio en el repository
- ❌ Cualquier query sin `store_id`
- ❌ Módulos que importan internals de otros módulos (rompe aislamiento)

---

## Multi-tenancy: regla crítica

**Cada entidad tiene `store_id`. Cada query filtra por `store_id`.**

```typescript
// ✅ Correcto
findAll(storeId: string) {
  return this.prisma.product.findMany({ where: { store_id: storeId } });
}

// ❌ Incorrecto — falta store_id
findAll() {
  return this.prisma.product.findMany();
}
```

El `store_id` viene del request (guard/middleware de autenticación) y se pasa explícitamente por toda la cadena.

---

## Estructura de módulo

Cada feature sigue esta estructura:

```
src/modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.repository.ts
├── dto/
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
└── (opcional) <feature>.domain.ts  ← si tiene lógica de negocio propia
```

La lógica de negocio compleja va en `src/domain/<feature>.domain.ts` (funciones puras, sin dependencias de NestJS).

---

## Módulos del proyecto

| Módulo | Descripción |
|--------|-------------|
| `auth` | Autenticación de usuarios |
| `stores` | Gestión de tiendas |
| `products` | Catálogo de productos |
| `variants` | Variantes por producto (stock, precio, atributos) |
| `sales` | Registro de ventas |
| `returns` | Devoluciones |
| `metrics` | Dashboard y métricas |

---

## Modelos de datos (Prisma)

```prisma
model Store { id, name, created_at }
model User { id, email, password_hash, store_id }
model Category { id, store_id, name, parent_id }
model Product { id, store_id, name, brand, category_id, created_at }
model Variant { id, product_id, sku, stock, stock_min, price_cash, price_debit, price_credit }
model Attribute { id, store_id, name }
model AttributeValue { id, attribute_id, value }
model VariantAttribute { variant_id, attribute_value_id }
model Sale { id, store_id, date, payment_method, total }
model SaleItem { id, sale_id, variant_id, quantity, price }
model Return { id, sale_item_id, quantity, date }
```

---

## Reglas de negocio (dominio)

Estas reglas van en la capa domain, no en service ni controller:

- **Stock**: una venta reduce el stock de la variante; una devolución lo incrementa
- **Validación de stock**: no se puede vender más unidades de las disponibles
- **Validación de devolución**: no se puede devolver más de lo que se vendió en ese SaleItem
- **Precios**: cada variante tiene `price_cash`, `price_debit`, `price_credit`; el precio usado depende del `payment_method` de la venta
- **Alerta de stock bajo**: se dispara cuando `stock <= stock_min`

---

## Formato de respuesta API

Todas las respuestas siguen este formato:

```typescript
// Éxito
{ data: any, error: null }

// Error
{ data: null, error: { message: string, code: string } }
```

---

## Convenciones de código

```
Controllers  → PascalCase
Services     → PascalCase
Módulos      → kebab-case
Archivos     → kebab-case
Variables    → camelCase
Types/Interfaces → PascalCase
Constantes   → UPPER_SNAKE_CASE
```

DTOs usan `class-validator`:

```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  brand?: string;
}
```

---

## Ejemplo de implementación completa

### Caso: `GET /products` — listar productos de la tienda

**Controller** (`products.controller.ts`):
```typescript
@Get()
async findAll(@StoreId() storeId: string) {
  const products = await this.productsService.findAll(storeId);
  return { data: products, error: null };
}
```

**Service** (`products.service.ts`):
```typescript
async findAll(storeId: string) {
  return this.productsRepository.findAll(storeId);
}
```

**Repository** (`products.repository.ts`):
```typescript
async findAll(storeId: string) {
  return this.prisma.product.findMany({
    where: { store_id: storeId },
    include: { variants: true },
  });
}
```

---

## Endpoints definidos en api.md

```
GET    /products          → listar productos
GET    /products/:id      → obtener producto
POST   /products          → crear producto
PUT    /products/:id      → actualizar producto
DELETE /products/:id      → eliminar producto

GET    /variants          → listar variantes
POST   /variants          → crear variante
PUT    /variants/:id      → actualizar variante
PATCH  /variants/:id/stock → actualizar stock

GET    /sales             → listar ventas
POST   /sales             → registrar venta

POST   /returns           → registrar devolución

GET    /metrics/monthly-sales  → ventas mensuales
GET    /metrics/top-products   → productos más vendidos
```

---

## Checklist antes de generar código

Antes de escribir cualquier implementación, verificá:

- [ ] ¿El código sigue el flujo controller → service → domain → repository?
- [ ] ¿Todos los queries incluyen `store_id`?
- [ ] ¿La lógica de negocio está en la capa domain?
- [ ] ¿El controller solo maneja HTTP (entrada/salida)?
- [ ] ¿El repository es el único que usa Prisma?
- [ ] ¿Los DTOs usan `class-validator`?
- [ ] ¿La respuesta sigue el formato `{ data, error }`?
- [ ] ¿Los módulos están aislados (no importan internals de otros)?