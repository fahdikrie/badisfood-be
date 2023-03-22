import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { Menu, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { MenuService } from './menu.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu')
export class MenuController {
  private readonly logger = new Logger(MenuController.name);

  constructor(private menuService: MenuService) {}

  @Get()
  @Roles(Role.CUSTOMER)
  async getUsers(): Promise<Menu[]> {
    this.logger.log('Getting all menus');

    return this.menuService.findMenus({});
  }
}
