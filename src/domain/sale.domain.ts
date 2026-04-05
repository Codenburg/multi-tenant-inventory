import { BadRequestException } from '@nestjs/common';
import { resolvePrice, PaymentMethod } from './variant.domain';

export function validateStock(variant: any, quantity: number): void {
  if (variant.stock < quantity) {
    throw new BadRequestException(`Insufficient stock for SKU ${variant.sku}`);
  }
}

export function computeSaleTotal(
  items: Array<{ variant: any; quantity: number }>,
  paymentMethod: PaymentMethod,
): number {
  return items.reduce((sum, { variant, quantity }) => {
    return sum + resolvePrice(variant, paymentMethod) * quantity;
  }, 0);
}
