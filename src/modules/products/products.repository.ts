import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(storeId: string) {
    return this.prisma.product.findMany({
      where: { store_id: storeId },
      include: { variants: true, category: true },
    });
  }

  findById(id: string, storeId: string) {
    return this.prisma.product.findFirst({
      where: { id, store_id: storeId },
      include: { variants: true, category: true },
    });
  }

  create(
    data: { name: string; brand?: string; category_id?: string },
    storeId: string,
  ) {
    return this.prisma.product.create({
      data: { ...data, store_id: storeId },
      include: { variants: true, category: true },
    });
  }

  update(
    id: string,
    data: Partial<{ name: string; brand: string; category_id: string }>,
    storeId: string,
  ) {
    return this.prisma.product.updateMany({
      where: { id, store_id: storeId },
      data,
    });
  }

  delete(id: string, storeId: string) {
    return this.prisma.product.deleteMany({
      where: { id, store_id: storeId },
    });
  }
}
