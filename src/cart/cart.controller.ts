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
import { Cart, CartItem, Order } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { CartService } from './cart.service';
import { UpdateCartItemDto } from './dto/update-cart-item.input';
import { UpdateCartItemsDto } from './dto/update-cart-items.input';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private menuService: CartService) {}

  @Get()
  async getCarts(): Promise<Cart[]> {
    this.logger.log('Getting all carts');

    return this.menuService.findCarts({});
  }

  @Get(':id')
  async getCart(@Param('id') id: string): Promise<Cart> {
    this.logger.log(`Getting cart with id ${id}`);

    return this.menuService.findCart({ id: id });
  }

  @Get('user/:userId')
  async getCartByUserId(@Param('userId') userId: string): Promise<Cart> {
    this.logger.log(`Getting cart with user id ${userId}`);

    return this.menuService.findCart({ userId: userId });
  }

  @Post(':menuId')
  async addMenuToCart(@Param('menuId') menuId: string): Promise<CartItem> {
    this.logger.log(`Adding menu with id ${menuId} to cart`);

    return this.menuService.addMenuToCart(menuId);
  }

  @Put(':cartId')
  async updateCartItems(
    @Param('cartId') cartId: string,
    @Body() cartItems: UpdateCartItemsDto[]
  ): Promise<CartItem[]> {
    this.logger.log(`Updating menus on cartId ${cartId} in cart`);

    return this.menuService.updateCartItems(cartId, cartItems);
  }

  @Put(':cartId/:menuId')
  async updateCartItem(
    @Param('cartId') cartId: string,
    @Param('menuId') menuId: string,
    @Body() cartItem: UpdateCartItemDto
  ): Promise<CartItem> {
    this.logger.log(`Updating menu with id ${menuId} in cart`);

    return this.menuService.updateCartItem(cartId, menuId, cartItem);
  }

  @Delete(':cartId/:menuId')
  async removeCartItem(
    @Param('cartId') cartId: string,
    @Param('menuId') menuId: string
  ): Promise<CartItem> {
    this.logger.log(`Removing menu with id ${menuId} from cart`);

    return this.menuService.removeCartItem(cartId, menuId);
  }

  @Delete(':cartId')
  async emptyCart(@Param('cartId') cartId: string): Promise<void> {
    this.logger.log(`Emptying cart with id ${cartId}`);

    return this.menuService.emptyCart(cartId);
  }

  @Post(':cartId/checkout')
  async checkoutCart(@Param('cartId') cartId: string): Promise<Order> {
    this.logger.log(`Checking out cart with id ${cartId}`);

    return this.menuService.checkoutCart(cartId);
  }
}
