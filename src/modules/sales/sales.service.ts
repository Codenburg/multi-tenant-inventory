import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { PrismaService } from '@prisma/prisma.service';
import { validateStock, computeSaleTotal } from '@domain/sale.domain';
import { resolvePrice, PaymentMethod } from '@domain/variant.domain';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private prisma: PrismaService,
  ) {}

  async findAll(storeId: string) {
    return this.salesRepository.findAll(storeId);
  }

  async findById(id: string, storeId: string) {
    const sale = await this.salesRepository.findById(id, storeId);
    if (!sale) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }
    return sale;
  }

  async create(
    storeId: string,
    paymentMethod: PaymentMethod,
    items: Array<{ variantId: string; quantity: number }>,
  ) {
    // Fetch all variants and validate stock
    const variantIds = items.map((i) => i.variantId);
    const variants = await this.prisma.variant.findMany({
      where: { id: { in: variantIds }, product: { store_id: storeId } },
    });

    const itemsWithVariants = items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new NotFoundException(`Variant ${item.variantId} not found`);
      }
      validateStock(variant, item.quantity);
      return { variant, quantity: item.quantity };
    });

    const total = computeSaleTotal(itemsWithVariants, paymentMethod);

    const itemsData = itemsWithVariants.map((item) => ({
      variantId: item.variant.id,
      quantity: item.quantity,
      price: resolvePrice(item.variant, paymentMethod),
    }));

    return this.salesRepository.createSaleWithItems(
      storeId,
      paymentMethod,
      total,
      itemsData,
    );
  }
}
