import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';

@Controller('metrics')
@UseGuards(AuthGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('monthly-sales')
  async getMonthlySales(@Session() session: any) {
    const storeId = session.user.store_id;
    const result = await this.metricsService.getMonthlySales(storeId);
    return { data: result, error: null };
  }

  @Get('top-products')
  async getTopProducts(
    @Session() session: any,
    @Query('limit') limit?: string,
  ) {
    const storeId = session.user.store_id;
    const result = await this.metricsService.getTopProducts(
      storeId,
      limit ? parseInt(limit, 10) : undefined,
    );
    return { data: result, error: null };
  }

  @Get('low-stock')
  async getLowStockProducts(
    @Session() session: any,
    @Query('limit') limit?: string,
  ) {
    const storeId = session.user.store_id;
    const result = await this.metricsService.getLowStockProducts(
      storeId,
      limit ? parseInt(limit, 10) : undefined,
    );
    return { data: result, error: null };
  }
}
