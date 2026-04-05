import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreGuard } from '../../common/guards/store.guard';
import { StoreId } from '../../common/decorators/store-id.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, StoreGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async findAll(@StoreId() storeId: string) {
    const sales = await this.salesService.findAll(storeId);
    return { data: sales, error: null };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @StoreId() storeId: string) {
    const sale = await this.salesService.findById(id, storeId);
    return { data: sale, error: null };
  }

  @Post()
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @StoreId() storeId: string,
  ) {
    const sale = await this.salesService.create(
      storeId,
      createSaleDto.paymentMethod,
      createSaleDto.items,
    );
    return { data: sale, error: null };
  }
}
