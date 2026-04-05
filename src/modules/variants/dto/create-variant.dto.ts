import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsUUID()
  product_id: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsNumber()
  @Type(() => Number)
  stock_min: number;

  @IsNumber()
  @Type(() => Number)
  price_cash: number;

  @IsNumber()
  @Type(() => Number)
  price_debit: number;

  @IsNumber()
  @Type(() => Number)
  price_credit: number;
}
