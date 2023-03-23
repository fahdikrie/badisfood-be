import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CartService } from './cart/cart.service';
import config from './common/config/config';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    UsersModule,
    PrismaModule,
    MenuModule,
    CartModule,
  ],
  controllers: [AppController, AuthController, UsersController, MenuController],
  providers: [AppService, PrismaService, CartService],
})
export class AppModule {}
