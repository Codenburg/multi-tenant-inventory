import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStockDto {
  @IsInt()
  @Type(() => Number)
  delta: number;
}
