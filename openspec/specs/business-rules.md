# Business Rules — NestJS SaaS

## Multi-Tenant Isolation
- Every query must filter `store_id = session.store_id`
- Guards enforce isolation at controller level

## Stock Management
- Sale reduces stock
- Return increases stock

## Stock Validation
- Sale cannot exceed current stock
- Return cannot exceed quantity sold

## Low Stock Alert
- Triggered when stock = stock_min

## Pricing
- Variants have cash, debit, credit prices
- Selected price depends on payment method