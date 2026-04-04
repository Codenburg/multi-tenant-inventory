# Feature: Sales Flow

## Problema
Registrar ventas rápidamente sin errores de stock.

## Scope
- seleccionar producto
- seleccionar variante
- ingresar cantidad
- seleccionar medio de pago
- confirmar venta

## Reglas
- stock debe ser suficiente
- cada venta genera sale + sale_items
- stock se reduce automáticamente
- el precio depende del medio de pago

## Acceptance Criteria
- venta registrada correctamente
- stock actualizado
- no permite vender sin stock
- tiempo de registro < 10 segundos