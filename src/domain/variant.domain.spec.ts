import { isLowStock } from './variant.domain';

describe('isLowStock', () => {
  it('returns true when stock equals stock_min', () => {
    const variant = { stock: 5, stock_min: 5 } as any;
    expect(isLowStock(variant)).toBe(true);
  });

  it('returns true when stock is below stock_min', () => {
    const variant = { stock: 3, stock_min: 5 } as any;
    expect(isLowStock(variant)).toBe(true);
  });

  it('returns false when stock is above stock_min', () => {
    const variant = { stock: 10, stock_min: 5 } as any;
    expect(isLowStock(variant)).toBe(false);
  });
});
