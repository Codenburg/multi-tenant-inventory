import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnsRepository } from './returns.repository';
import { validateReturn } from '@domain/return.domain';
import { PrismaService } from '@prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ReturnsService {
  constructor(
    private readonly returnsRepository: ReturnsRepository,
    private prisma: PrismaService,
  ) {}

  async findBySaleItem(saleItemId: string, storeId: string) {
    const returns = await this.returnsRepository.findBySaleItem(
      saleItemId,
      storeId,
    );
    if (!returns || returns.length === 0) {
      throw new NotFoundException(
        `No returns found for sale item ${saleItemId}`,
      );
    }
    return returns;
  }

  async create(saleItemId: string, quantity: number, storeId: string) {
    // Get sale item with returns for validation
    const saleItem = await this.prisma.saleItem.findFirst({
      where: {
        id: saleItemId,
        sale: { store_id: storeId },
      },
      include: { returns: true },
    });

    if (!saleItem) {
      throw new NotFoundException(`Sale item ${saleItemId} not found`);
    }

    validateReturn(saleItem, quantity);
    return this.returnsRepository.create(saleItemId, quantity, storeId);
  }
}
