import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async createStoreAndLink(user: { id: string; email: string; name?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: { name: `${user.email.split('@')[0]}'s Store` },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { storeId: store.id },
      });

      return store;
    });
  }
}
