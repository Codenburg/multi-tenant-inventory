# Data Models — NestJS SaaS

## Store
- id
- name
- created_at

## User
- id
- email
- password_hash
- store_id

## Category
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