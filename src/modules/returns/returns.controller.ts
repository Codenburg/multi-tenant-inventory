import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreGuard } from '../../common/guards/store.guard';
import { StoreId } from '../../common/decorators/store-id.decorator';

@Controller('returns')
@UseGuards(JwtAuthGuard, StoreGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  async create(
    @Body() createReturnDto: CreateReturnDto,
    @StoreId() storeId: string,
  ) {
    const returnRecord = await this.returnsService.create(
      createReturnDto.sale_item_id,
      createReturnDto.quantity,
      storeId,
    );
    return { data: returnRecord, error: null };
  }
}
