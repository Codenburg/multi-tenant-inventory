import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class VariantsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(storeId: string) {
    return this.prisma.variant.findMany({
      where: { product: { store_id: storeId } },
      include: {
        product: true,
        attributes: { include: { attribute_value: true } },
      },
    });
  }

  findById(id: string, storeId: string) {
    return this.prisma.variant.findFirst({
      where: { id, product: { store_id: storeId } },
      include: {
        product: true,
        attributes: { include: { attribute_value: true } },
      },
    });
  }

  create(
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
    const { product_id, ...rest } = data;
    return this.prisma.variant.create({
      data: {
        ...rest,
        product: { connect: { id: product_id } },
      },
      include: { product: true },
    });
  }

  update(
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
    return this.prisma.variant.updateMany({
      where: { id, product: { store_id: storeId } },
      data,
    });
  }

  updateStock(id: string, stockDelta: number, storeId: string) {
    return this.prisma.variant.updateMany({
      where: { id, product: { store_id: storeId } },
      data: { stock: { increment: stockDelta } },
    });
  }
}
