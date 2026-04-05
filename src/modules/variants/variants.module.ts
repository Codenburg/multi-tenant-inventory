import { Module } from '@nestjs/common';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';
import { VariantsRepository } from './variants.repository';

@Module({
  controllers: [VariantsController],
  providers: [VariantsService, VariantsRepository],
  exports: [VariantsService],
})
export class VariantsModule {}
