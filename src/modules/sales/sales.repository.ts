import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesRepository {
  constructor(private prisma: PrismaService) {}

  findAll(storeId: string) {
    return this.prisma.sale.findMany({
      where: { store_id: storeId },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  findById(id: string, storeId: string) {
    return this.prisma.sale.findFirst({
      where: { id, store_id: storeId },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });
  }

  async createSaleWithItems(
    storeId: string,
    paymentMethod: string,
    total: number,
    items: Array<{ variantId: string; quantity: number; price: number }>,
  ) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const sale = await tx.sale.create({
        data: {
          store_id: storeId,
          payment_method: paymentMethod,
          total,
          date: new Date(),
        },
      });

      for (const item of items) {
        await tx.saleItem.create({
          data: {
            sale_id: sale.id,
            variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price,
          },
        });

        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return sale;
    });
  }
}
