import { BadRequestException } from '@nestjs/common';

export function validateReturn(saleItem: any, quantity: number): void {
  const alreadyReturned =
    saleItem.returns?.reduce((sum: number, r: any) => sum + r.quantity, 0) || 0;
  const available = saleItem.quantity - alreadyReturned;
  if (quantity > available) {
    throw new BadRequestException(
      `Cannot return ${quantity} units. Max returnable: ${available}`,
    );
  }
}
