import { validateStock, computeSaleTotal } from './sale.domain';
import { resolvePrice } from './variant.domain';

describe('validateStock', () => {
  it('throws when stock is insufficient', () => {
    const variant = { stock: 2, sku: 'SKU-001' } as any;
    expect(() => validateStock(variant, 5)).toThrow('Insufficient stock');
  });

  it('passes when stock is sufficient', () => {
    const variant = { stock: 10, sku: 'SKU-001' } as any;
    expect(() => validateStock(variant, 5)).not.toThrow();
  });

  it('throws when trying to sell exactly available stock', () => {
    const variant = { stock: 5, sku: 'SKU-001' } as any;
    expect(() => validateStock(variant, 5)).not.toThrow();
  });
});

describe('computeSaleTotal', () => {
  it('calculates total for cash payment', () => {
    const items = [
      {
        variant: { price_cash: 100, price_debit: 110, price_credit: 120 },
        quantity: 2,
      },
      {
        variant: { price_cash: 50, price_debit: 55, price_credit: 60 },
        quantity: 1,
      },
    ] as any[];
    expect(computeSaleTotal(items, 'cash')).toBe(250);
  });

  it('calculates total for debit payment', () => {
    const items = [
      {
        variant: { price_cash: 100, price_debit: 110, price_credit: 120 },
        quantity: 2,
      },
    ] as any[];
    expect(computeSaleTotal(items, 'debit')).toBe(220);
  });

  it('calculates total for credit payment', () => {
    const items = [
      {
        variant: { price_cash: 100, price_debit: 110, price_credit: 120 },
        quantity: 3,
      },
    ] as any[];
    expect(computeSaleTotal(items, 'credit')).toBe(360);
  });
});

describe('resolvePrice', () => {
  it('returns cash price for cash payment', () => {
    const variant = {
      price_cash: 100,
      price_debit: 110,
      price_credit: 120,
    } as any;
    expect(resolvePrice(variant, 'cash')).toBe(100);
  });

  it('returns debit price for debit payment', () => {
    const variant = {
      price_cash: 100,
      price_debit: 110,
      price_credit: 120,
    } as any;
    expect(resolvePrice(variant, 'debit')).toBe(110);
  });

  it('returns credit price for credit payment', () => {
    const variant = {
      price_cash: 100,
      price_debit: 110,
      price_credit: 120,
    } as any;
    expect(resolvePrice(variant, 'credit')).toBe(120);
  });
});
