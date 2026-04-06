import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthNestModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { StoresModule } from '../stores/stores.module';
import { AuthHooks } from './auth.hooks';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    StoresModule,
    BetterAuthNestModule.forRootAsync({
      useFactory: (prisma: PrismaService) => {
        return {
          auth: betterAuth({
            database: prismaAdapter(prisma, {
              provider: 'postgresql',
            }),
            secret:
              process.env.BETTER_AUTH_SECRET ?? 'default-secret-change-me',
            session: {
              expiresIn: 60 * 60 * 24 * 7, // 7 days
            },
            emailAndPassword: {
              enabled: true,
            },
            hooks: {},
          }),
        };
      },
      inject: [PrismaService],
    }),
  ],
  providers: [AuthHooks],
})
export class AuthModule {}
