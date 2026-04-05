import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreGuard } from '../../common/guards/store.guard';
import { StoreId } from '../../common/decorators/store-id.decorator';

@Controller('metrics')
@UseGuards(JwtAuthGuard, StoreGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('monthly-sales')
  async getMonthlySales(@StoreId() storeId: string) {
    const result = await this.metricsService.getMonthlySales(storeId);
    return { data: result, error: null };
  }

  @Get('top-products')
  async getTopProducts(
    @StoreId() storeId: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.metricsService.getTopProducts(
      storeId,
      limit ? parseInt(limit, 10) : undefined,
    );
    return { data: result, error: null };
  }

  @Get('low-stock')
  async getLowStockProducts(
    @StoreId() storeId: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.metricsService.getLowStockProducts(
      storeId,
      limit ? parseInt(limit, 10) : undefined,
    );
    return { data: result, error: null };
  }
}
