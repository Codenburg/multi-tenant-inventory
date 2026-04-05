export function validateProductData(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Product name is required');
  }
}
