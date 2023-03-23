import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Cart, CartItem, Order, Prisma, User } from '@prisma/client';
import { Request } from 'express';
import { MenuService } from 'src/menu/menu.service';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateCartItemDto } from './dto/update-cart-item.input';
import { UpdateCartItemsDto } from './dto/update-cart-items.input';

@Injectable({ scope: Scope.REQUEST })
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private prisma: PrismaService,
    private menuService: MenuService,
    private orderService: OrderService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async findCarts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CartWhereUniqueInput;
    where?: Prisma.CartWhereInput;
    orderBy?: Prisma.CartOrderByWithRelationInput;
  }): Promise<Cart[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.cart.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findCart(where: Prisma.CartWhereUniqueInput): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where,
    });

    if (!cart) {
      const message = `Cart with ${
        where.userId ? 'userId ' + where.userId : 'id ' + where.id
      } does not exist`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    return cart;
  }

  async addMenuToCart(menuId: string): Promise<CartItem> {
    const menu = await this.menuService.findMenu({ id: menuId });

    if (!menu) {
      const message = `Menu with id ${menuId} does not exist`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const cart = await this.prisma.cart.upsert({
      where: {
        userId: (this.request.user as User).id,
      },
      update: {},
      create: {
        user: {
          connect: {
            id: (this.request.user as User).id,
          },
        },
      },
      include: {
        cartItems: true,
      },
    });

    return this.prisma.cartItem.upsert({
      where: {
        menuId_cartId: {
          menuId,
          cartId: cart.id,
        },
      },
      update: {
        quantity: {
          increment: 1,
        },
        totalPrice: {
          increment: menu.price,
        },
      },
      create: {
        menu: {
          connect: {
            id: menuId,
          },
        },
        cart: {
          connect: {
            id: cart.id,
          },
        },
        quantity: 1,
        totalPrice: menu.price,
      },
    });
  }

  async updateCartItems(
    cartId: string,
    updateItemsData: UpdateCartItemsDto[]
  ): Promise<CartItem[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId,
      },
      include: {
        menu: true,
      },
    });

    const updatedCartItems = [];

    for (const cartItem of cartItems) {
      const updateItemData = updateItemsData.find(
        (updateItemData) => updateItemData.menuId === cartItem.menuId
      );

      if (updateItemData) {
        const updatedCartItem = await this.updateCartItem(
          cartId,
          cartItem.menuId,
          updateItemData
        );

        updatedCartItems.push(updatedCartItem);
      }
    }

    return updatedCartItems;
  }

  async updateCartItem(
    cartId: string,
    menuId: string,
    updateItemData: UpdateCartItemDto
  ): Promise<CartItem> {
    const menu = await this.menuService.findMenu({ id: menuId });

    if (!menu) {
      const message = `Menu with id ${menuId} does not exist`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    return await this.prisma.cartItem.update({
      where: {
        menuId_cartId: {
          menuId,
          cartId,
        },
      },
      data: {
        quantity: updateItemData.newQuantity,
        totalPrice: updateItemData.newQuantity * menu.price,
      },
    });
  }

  async removeCartItem(cartId: string, menuId: string): Promise<CartItem> {
    return await this.prisma.cartItem.delete({
      where: {
        menuId_cartId: {
          menuId,
          cartId,
        },
      },
    });
  }

  async emptyCart(cartId: string): Promise<void> {
    await this.prisma.cart.delete({
      where: {
        id: cartId,
      },
    });
  }

  async checkoutCart(cartId: string): Promise<Order> {
    const cart = await this.findCart({ id: cartId });

    if (!cart) {
      const message = `Cart with id ${cartId} does not exist`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    return await this.orderService.createOrder(cartId);
  }
}
