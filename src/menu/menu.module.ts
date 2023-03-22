import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [PrismaModule],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService],
})
export class MenuModule {}
