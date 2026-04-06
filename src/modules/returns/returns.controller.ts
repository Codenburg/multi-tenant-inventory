import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';

@Controller('returns')
@UseGuards(AuthGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  async create(
    @Body() createReturnDto: CreateReturnDto,
    @Session() session: any,
  ) {
    const storeId = session.user.store_id;
    const returnRecord = await this.returnsService.create(
      createReturnDto.sale_item_id,
      createReturnDto.quantity,
      storeId,
    );
    return { data: returnRecord, error: null };
  }
}
