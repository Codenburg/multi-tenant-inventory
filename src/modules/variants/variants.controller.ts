import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';

@Controller('variants')
@UseGuards(AuthGuard)
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  async findAll(@Session() session: any) {
    const storeId = session.user.store_id;
    const variants = await this.variantsService.findAll(storeId);
    return { data: variants, error: null };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: any) {
    const storeId = session.user.store_id;
    const variant = await this.variantsService.findById(id, storeId);
    return { data: variant, error: null };
  }

  @Post()
  async create(
    @Body() createVariantDto: CreateVariantDto,
    @Session() session: any,
  ) {
    const storeId = session.user.store_id;
    const variant = await this.variantsService.create(
      createVariantDto,
      storeId,
    );
    return { data: variant, error: null };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVariantDto: UpdateVariantDto,
    @Session() session: any,
  ) {
    const storeId = session.user.store_id;
    const result = await this.variantsService.update(
      id,
      updateVariantDto,
      storeId,
    );
    return { data: result, error: null };
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @Session() session: any,
  ) {
    const storeId = session.user.store_id;
    const result = await this.variantsService.updateStock(
      id,
      updateStockDto.delta,
      storeId,
    );
    return { data: result, error: null };
  }
}
