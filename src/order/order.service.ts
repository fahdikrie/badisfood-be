import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private prisma: PrismaService) {}

  async createOrder(cartId: string): Promise<Order> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        user: true,
        cartItems: {
          include: { menu: true },
        },
      },
    });

    if (!cart) {
      const message = `Cart with id ${cartId} does not exist`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const order = await this.prisma.order.create({
      data: {
        user: { connect: { id: cart.userId } },
        orderItems: {
          create: cart.cartItems.map((cartItem) => ({
            menu: { connect: { id: cartItem.menuId } },
            totalPrice: cartItem.menu.price * cartItem.quantity,
            quantity: cartItem.quantity,
          })),
        },
        totalPurchase: cart.cartItems.reduce(
          (total, cartItem) => total + cartItem.quantity * cartItem.menu.price,
          0
        ),
      },
    });

    await this.prisma.cart.delete({
      where: { id: cartId },
    });

    return order;
  }

  async findOrders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrderWhereUniqueInput;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput;
  }): Promise<Order[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.order.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOrder(where: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where,
    });
  }

  async updateOrder(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;

    return this.prisma.order.update({
      data,
      where,
    });
  }

  async deleteOrder(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
    return this.prisma.order.delete({
      where,
    });
  }
}
