import { Injectable } from '@nestjs/common';
import { Menu, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findMenus(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MenuWhereUniqueInput;
    where?: Prisma.MenuWhereInput;
    orderBy?: Prisma.MenuOrderByWithRelationInput;
  }): Promise<Menu[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.menu.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findMenu(where: Prisma.MenuWhereUniqueInput): Promise<Menu | null> {
    return this.prisma.menu.findUnique({
      where,
    });
  }

  async createMenu(data: Prisma.MenuCreateInput): Promise<Menu> {
    return this.prisma.menu.create({ data });
  }

  async updateMenu(params: {
    where: Prisma.MenuWhereUniqueInput;
    data: Prisma.MenuUpdateInput;
  }): Promise<Menu> {
    const { where, data } = params;

    return this.prisma.menu.update({
      data,
      where,
    });
  }

  async deleteMenu(where: Prisma.MenuWhereUniqueInput): Promise<Menu> {
    return this.prisma.menu.delete({
      where,
    });
  }
}
