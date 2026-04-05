import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreGuard } from '../../common/guards/store.guard';
import { StoreId } from '../../common/decorators/store-id.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, StoreGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@StoreId() storeId: string) {
    const products = await this.productsService.findAll(storeId);
    return { data: products, error: null };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @StoreId() storeId: string) {
    const product = await this.productsService.findById(id, storeId);
    return { data: product, error: null };
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @StoreId() storeId: string,
  ) {
    const product = await this.productsService.create(
      createProductDto,
      storeId,
    );
    return { data: product, error: null };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @StoreId() storeId: string,
  ) {
    const result = await this.productsService.update(
      id,
      updateProductDto,
      storeId,
    );
    return { data: result, error: null };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @StoreId() storeId: string) {
    await this.productsService.delete(id, storeId);
    return { data: null, error: null };
  }
}
