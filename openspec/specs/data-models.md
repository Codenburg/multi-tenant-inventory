# Data Models — NestJS SaaS

## Auth tables (managed by Better Auth — do not create manually)

### User *(extended with store_id)*
- id
- email
- name
- store_id ← custom field added to Better Auth's user model
- emailVerified
- image
- createdAt
- updatedAt

### Session *(Better Auth managed)*
- id
- userId
- token
- expiresAt
- ipAddress
- userAgent
- createdAt
- updatedAt

### Account *(Better Auth managed)*
- id
- userId
- accountId
- providerId
- accessToken
- refreshToken
- expiresAt

### Verification *(Better Auth managed)*
- id
- identifier
- value
- expiresAt

> `store_id` is a custom field on `User`. It is populated via a Better Auth `after sign-up` hook that creates a `Store` record and writes its id back to the user.

## Store *(domain model — created automatically on sign-up)*
- id
- name
- created_at

- id
- store_id
- name
- parent_id

## Product
- id
- store_id
- name
- brand
- category_id
- created_at

## Variant
- id
- product_id
- sku
- stock
- stock_min
- price_cash
- price_debit
- price_credit

## Attribute
- id
- store_id
- name

## AttributeValue
- id
- attribute_id
- value

## VariantAttribute
- variant_id
- attribute_value_id

## Sale
- id
- store_id
- date
- payment_method
- total

## SaleItem
- id
- sale_id
- variant_id
- quantity
- price

## Return
- id
- sale_item_id
- quantity
- date