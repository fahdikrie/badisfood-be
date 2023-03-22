import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('roles', context.getHandler());

    this.logger.log('Required request role: ' + role);

    if (!role) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role && user.role === role.toString();
  }
}
