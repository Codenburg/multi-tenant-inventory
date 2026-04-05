# API — NestJS REST Endpoints

## Auth (managed by Better Auth — `/api/auth/*`)
> These routes are handled automatically by `@thallesp/nestjs-better-auth`. Do NOT create manual controllers for them.

- POST /api/auth/sign-up/email → register user (creates user + store)
- POST /api/auth/sign-in/email → login, sets session cookie
- POST /api/auth/sign-out → logout, clears session cookie
- GET  /api/auth/get-session → returns current session + user

> All other endpoints below require a valid session cookie.
> `store_id` is always derived from `session.user.store_id` — never passed as a param.

## Products
- GET /products → list all products
- GET /products/:id → get product
- POST /products → create product
- PUT /products/:id → update product
- DELETE /products/:id → delete product

## Variants
- GET /variants → list variants
- POST /variants → create variant
- PUT /variants/:id → update variant
- PATCH /variants/:id/stock → update stock

## Sales
- GET /sales → list sales
- POST /sales → create sale

## Returns
- POST /returns → register a return

## Metrics
- GET /metrics/monthly-sales → monthly sales
- GET /metrics/top-products → top sold products