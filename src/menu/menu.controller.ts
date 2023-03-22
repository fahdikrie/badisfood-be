import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { Menu } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  private readonly logger = new Logger(MenuController.name);

  constructor(private menuService: MenuService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(): Promise<Menu[]> {
    this.logger.log('Getting all menus');

    return this.menuService.findMenus({});
  }
}
