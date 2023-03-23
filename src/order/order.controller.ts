import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { UpdateOrderDto } from './dto/update-order.input';
import { OrderService } from './order.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders() {
    this.logger.log('Getting all orders...');

    return this.orderService.findOrders({});
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    this.logger.log(`Getting order with id ${id}`);

    return this.orderService.findOrder({ id: id });
  }

  @Get('by-user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    this.logger.log(`Getting orders for user with id ${userId}`);

    return this.orderService.findOrders({ where: { userId: userId } });
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateData: UpdateOrderDto
  ) {
    this.logger.log(
      `Updating order with id ${id} with status ${updateData.status}`
    );

    if (OrderStatus[updateData.status] === undefined) {
      throw new BadRequestException('Invalid order status');
    }

    return this.orderService.updateOrder({
      where: { id: id },
      data: { status: updateData.status },
    });
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    this.logger.log(`Deleting order with id ${id}`);

    return this.orderService.deleteOrder({ id: id });
  }
}
