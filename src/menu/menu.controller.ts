import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Menu, Prisma, Role } from '@prisma/client';
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
  async getMenus(): Promise<Menu[]> {
    this.logger.log('Getting all menus');

    return this.menuService.findMenus({});
  }

  @Get(':id')
  async getMenu(@Param('id') id: string): Promise<Menu> {
    this.logger.log(`Getting menu with id ${id}`);

    return this.menuService.findMenu({ id: id });
  }

  @Post()
  @Roles(Role.ADMIN)
  async addMenu(@Body() menu: Prisma.MenuCreateInput): Promise<Menu> {
    this.logger.log('Creating a new menu');

    return this.menuService.createMenu(menu);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updateMenu(
    @Param('id') id: string,
    @Body() menu: Prisma.MenuUpdateInput
  ): Promise<Menu> {
    this.logger.log(`Updating menu with id ${id}`);

    return this.menuService.updateMenu({
      where: { id: id },
      data: menu,
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteMenu(@Param('id') id: string): Promise<Menu> {
    this.logger.log(`Deleting menu with id ${id}`);

    return this.menuService.deleteMenu({ id: id });
  }
}
