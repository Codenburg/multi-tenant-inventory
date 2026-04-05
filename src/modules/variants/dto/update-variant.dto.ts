import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock_min?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price_cash?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price_debit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price_credit?: number;
}
