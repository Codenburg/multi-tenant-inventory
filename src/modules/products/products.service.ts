import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { validateProductData } from '@domain/product.domain';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(storeId: string) {
    return this.productsRepository.findAll(storeId);
  }

  async findById(id: string, storeId: string) {
    const product = await this.productsRepository.findById(id, storeId);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(
    data: { name: string; brand?: string; category_id?: string },
    storeId: string,
  ) {
    validateProductData(data.name);
    return this.productsRepository.create(data, storeId);
  }

  async update(
    id: string,
    data: Partial<{ name: string; brand: string; category_id: string }>,
    storeId: string,
  ) {
    await this.findById(id, storeId); // ensure exists
    return this.productsRepository.update(id, data, storeId);
  }

  async delete(id: string, storeId: string) {
    await this.findById(id, storeId); // ensure exists
    return this.productsRepository.delete(id, storeId);
  }
}
