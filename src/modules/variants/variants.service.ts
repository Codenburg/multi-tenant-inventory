import { Injectable, NotFoundException } from '@nestjs/common';
import { VariantsRepository } from './variants.repository';
import { isLowStock } from '@domain/variant.domain';

@Injectable()
export class VariantsService {
  constructor(private readonly variantsRepository: VariantsRepository) {}

  async findAll(storeId: string) {
    const variants = await this.variantsRepository.findAll(storeId);
    return variants.map((v) => ({
      ...v,
      isLowStock: isLowStock(v),
    }));
  }

  async findById(id: string, storeId: string) {
    const variant = await this.variantsRepository.findById(id, storeId);
    if (!variant) {
      throw new NotFoundException(`Variant with id ${id} not found`);
    }
    return { ...variant, isLowStock: isLowStock(variant) };
  }

  async create(
    data: {
      product_id: string;
      sku: string;
      stock: number;
      stock_min: number;
      price_cash: number;
      price_debit: number;
      price_credit: number;
    },
    storeId: string,
  ) {
    const variant = await this.variantsRepository.create(data, storeId);
    return { ...variant, isLowStock: isLowStock(variant) };
  }

  async update(
    id: string,
    data: Partial<{
      sku: string;
      stock: number;
      stock_min: number;
      price_cash: number;
      price_debit: number;
      price_credit: number;
    }>,
    storeId: string,
  ) {
    await this.findById(id, storeId);
    return this.variantsRepository.update(id, data, storeId);
  }

  async updateStock(id: string, stockDelta: number, storeId: string) {
    await this.findById(id, storeId);
    return this.variantsRepository.updateStock(id, stockDelta, storeId);
  }
}
