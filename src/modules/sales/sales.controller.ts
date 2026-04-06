import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';

@Controller('sales')
@UseGuards(AuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async findAll(@Session() session: any) {
    const storeId = session.user.store_id;
    const sales = await this.salesService.findAll(storeId);
    return { data: sales, error: null };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: any) {
    const storeId = session.user.store_id;
    const sale = await this.salesService.findById(id, storeId);
    return { data: sale, error: null };
  }

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, @Session() session: any) {
    const storeId = session.user.store_id;
    const sale = await this.salesService.create(
      storeId,
      createSaleDto.paymentMethod,
      createSaleDto.items,
    );
    return { data: sale, error: null };
  }
}
