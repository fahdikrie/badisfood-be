import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { CartService } from './cart.service';
import { UpdateCartItemDto } from './dto/update-cart-item.input';
import { UpdateCartItemsDto } from './dto/update-cart-items.input';

/**
 * API for managing a user's food cart.
 * 1. addMenuToCart - Add a menu to the cart
 * 2. addMenusToCart - Add batch of menus to the cart (ga perlu)
 * 3. updateCartItem - Update a menu in the cart
 * 4. removeCartItem - Remove a menu from the cart
 * 5. emptyCart - Remove all menus from the cart
 * 6. checkoutCart - Make an order from the cart
 */
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

  @Put(':cartId/:menuId')
  async updateCartItem(
    @Param('cartId') cartId: string,
    @Param('menuId') menuId: string,
    @Body() cartItem: UpdateCartItemDto
  ): Promise<CartItem> {
    this.logger.log(`Updating menu with id ${menuId} in cart`);

    return this.menuService.updateCartItem(cartId, menuId, cartItem);
  }

  @Put(':cartId')
  async updateCartItems(
    @Param('cartId') cartId: string,
    @Body() cartItems: UpdateCartItemsDto[]
  ): Promise<CartItem[]> {
    this.logger.log(`Updating menus on cartId ${cartId} in cart`);

    return this.menuService.updateCartItems(cartId, cartItems);
  }
}
