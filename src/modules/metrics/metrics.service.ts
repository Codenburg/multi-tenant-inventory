import { Injectable } from '@nestjs/common';
import { MetricsRepository } from './metrics.repository';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async getMonthlySales(storeId: string) {
    const result = await this.metricsRepository.monthlySales(storeId);
    return {
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      total_sales: result._sum?.total ? Number(result._sum.total) : 0,
      transaction_count: result._count?.id || 0,
    };
  }

  async getTopProducts(storeId: string, limit?: number) {
    return this.metricsRepository.topProducts(storeId, limit);
  }

  async getLowStockProducts(storeId: string, limit?: number) {
    return this.metricsRepository.lowStockProducts(storeId, limit);
  }
}
