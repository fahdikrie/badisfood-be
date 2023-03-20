import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findUsers({});
  }
}
