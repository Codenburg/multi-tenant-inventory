import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Variant, Product } from '@prisma/client';

export type VariantWithProduct = Variant & { product: Product };

export interface TopProductGroupByResult {
  variant_id: string;
  _sum: { quantity: number | null } | null;
}

export interface TopProductResult {
  variant_id: string;
  product_name: string;
  sku: string;
  total_sold: number;
}

@Injectable()
export class MetricsRepository {
  constructor(private prisma: PrismaService) {}

  async monthlySales(storeId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.sale.aggregate({
      where: {
        store_id: storeId,
        date: { gte: startOfMonth },
      },
      _sum: { total: true },
      _count: { id: true },
    });
  }

  async topProducts(storeId: string, limit = 10): Promise<TopProductResult[]> {
    const results = await this.prisma.saleItem.groupBy({
      by: ['variant_id'],
      where: {
        sale: { store_id: storeId },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    // Fetch variant details for the top products
    const variantIds = results.map(
      (r: TopProductGroupByResult) => r.variant_id,
    );
    const variants = await this.prisma.variant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    return results.map((r: TopProductGroupByResult) => {
      const variant = variants.find(
        (v: VariantWithProduct) => v.id === r.variant_id,
      );
      return {
        variant_id: r.variant_id,
        product_name: variant?.product?.name || 'Unknown',
        sku: variant?.sku || 'Unknown',
        total_sold: r._sum?.quantity || 0,
      };
    });
  }

  async lowStockProducts(
    storeId: string,
    limit = 10,
  ): Promise<VariantWithProduct[]> {
    // Fetch variants with stock <= stock_min
    const variants = await this.prisma.variant.findMany({
      where: {
        product: { store_id: storeId },
      },
      include: { product: true },
    });

    // Filter in memory for stock <= stock_min
    const lowStock = variants
      .filter((v: VariantWithProduct) => v.stock <= v.stock_min)
      .slice(0, limit);

    return lowStock;
  }
}
