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
}
