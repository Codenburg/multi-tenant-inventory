import { Injectable } from '@nestjs/common';
import { AfterHook, Hook } from '@thallesp/nestjs-better-auth';
import { StoresService } from '../stores/stores.service';

@Injectable()
@Hook()
export class AuthHooks {
  constructor(private storesService: StoresService) {}

  @AfterHook('/sign-up')
  async afterSignUp(user: { id: string; email: string; name?: string }) {
    await this.storesService.createStoreAndLink({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }
}
