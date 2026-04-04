# API — NestJS REST Endpoints

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