import { validateReturn } from './return.domain';

describe('validateReturn', () => {
  it('throws when return quantity exceeds sold quantity', () => {
    const saleItem = { quantity: 5, returns: [] } as any;
    expect(() => validateReturn(saleItem, 10)).toThrow(
      'Cannot return 10 units',
    );
  });

  it('throws when return quantity exceeds remaining returnable', () => {
    const saleItem = { quantity: 5, returns: [{ quantity: 3 }] } as any;
    expect(() => validateReturn(saleItem, 3)).toThrow('Cannot return 3 units');
  });

  it('passes when return quantity is within limit', () => {
    const saleItem = { quantity: 5, returns: [{ quantity: 2 }] } as any;
    expect(() => validateReturn(saleItem, 2)).not.toThrow();
  });

  it('passes when no returns exist and quantity is available', () => {
    const saleItem = { quantity: 5, returns: [] } as any;
    expect(() => validateReturn(saleItem, 5)).not.toThrow();
  });
});
