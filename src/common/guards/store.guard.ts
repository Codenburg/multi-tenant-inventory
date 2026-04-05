import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class StoreGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // injected by JwtAuthGuard
    if (!user?.store_id) {
      throw new UnauthorizedException('store_id missing');
    }
    request.storeId = user.store_id;
    return true;
  }
}
