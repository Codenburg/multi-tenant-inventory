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
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Session() session: any) {
    const storeId = session.user.store_id;
    const products = await this.productsService.findAll(storeId);
    return { data: products, error: null };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: any) {
    const storeId = session.user.store_id;
    const product = await this.productsService.findById(id, storeId);
    return { data: product, error: null };
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Session() session: any,
  ) {
    const storeId = session.user.store_id;
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
    @Session() session: any,
  ) {
    const storeId = session.user.store_id;
    const result = await this.productsService.update(
      id,
      updateProductDto,
      storeId,
    );
    return { data: result, error: null };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Session() session: any) {
    const storeId = session.user.store_id;
    await this.productsService.delete(id, storeId);
    return { data: null, error: null };
  }
}
