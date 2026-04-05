export type PaymentMethod = 'cash' | 'debit' | 'credit';

export function resolvePrice(
  variant: any,
  paymentMethod: PaymentMethod,
): number {
  const priceMap = {
    cash: variant.price_cash,
    debit: variant.price_debit,
    credit: variant.price_credit,
  };
  return Number(priceMap[paymentMethod]);
}

export function isLowStock(variant: any): boolean {
  return variant.stock <= variant.stock_min;
}
