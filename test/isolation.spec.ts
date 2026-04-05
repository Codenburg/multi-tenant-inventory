import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { ProductsRepository } from '../src/modules/products/products.repository';
import { ProductsService } from '../src/modules/products/products.service';

describe('Multi-tenant Isolation', () => {
  let productsRepository: ProductsRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ProductsRepository],
    }).compile();

    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('findAll MUST always include store_id filter', async () => {
    const storeId = 'store-123';

    // Mock Prisma
    const mockFindMany = jest.fn().mockResolvedValue([]);
    prismaService.product = { findMany: mockFindMany } as any;

    await productsRepository.findAll(storeId);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          store_id: storeId,
        }),
      }),
    );
  });

  it('findById MUST always include store_id filter', async () => {
    const storeId = 'store-123';
    const productId = 'product-456';

    const mockFindFirst = jest.fn().mockResolvedValue(null);
    prismaService.product = { findFirst: mockFindFirst } as any;

    await productsRepository.findById(productId, storeId);

    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: productId,
          store_id: storeId,
        }),
      }),
    );
  });

  it('create MUST always include store_id in data', async () => {
    const storeId = 'store-123';
    const data = { name: 'Test Product' };

    const mockCreate = jest
      .fn()
      .mockResolvedValue({ id: 'new-product', ...data, store_id: storeId });
    prismaService.product = { create: mockCreate } as any;

    await productsRepository.create(data, storeId);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Test Product',
          store_id: storeId,
        }),
      }),
    );
  });
});
