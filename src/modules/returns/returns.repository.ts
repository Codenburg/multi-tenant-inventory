import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ReturnsRepository {
  constructor(private prisma: PrismaService) {}

  findBySaleItem(saleItemId: string, storeId: string) {
    return this.prisma.return.findMany({
      where: {
        sale_item_id: saleItemId,
        sale_item: {
          sale: { store_id: storeId },
        },
      },
      include: { sale_item: true },
    });
  }

  async create(saleItemId: string, quantity: number, storeId: string) {
    return this.prisma.$transaction(async (tx) => {
      const saleItem = await tx.saleItem.findFirst({
        where: {
          id: saleItemId,
          sale: { store_id: storeId },
        },
        include: { returns: true },
      });

      if (!saleItem) {
        throw new BadRequestException('Sale item not found');
      }

      const returnRecord = await tx.return.create({
        data: {
          sale_item_id: saleItemId,
          quantity,
          date: new Date(),
        },
      });

      await tx.variant.update({
        where: { id: saleItem.variant_id },
        data: { stock: { increment: quantity } },
      });

      return returnRecord;
    });
  }
}
