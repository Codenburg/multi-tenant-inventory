import { IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReturnDto {
  @IsUUID()
  sale_item_id: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
