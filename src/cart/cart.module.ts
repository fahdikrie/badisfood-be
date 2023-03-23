import { Module } from '@nestjs/common';
import { MenuModule } from 'src/menu/menu.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [PrismaModule, MenuModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
