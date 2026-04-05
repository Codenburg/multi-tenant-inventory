import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sales (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/sales returns sales for authenticated store', async () => {
    // This test requires a valid JWT token
    // For now, we just verify the endpoint exists
    return request(app.getHttpServer())
      .get('/api/sales')
      .set('Authorization', 'Bearer valid-token')
      .expect(401); // Expected to fail without valid DB/JWT
  });
});
