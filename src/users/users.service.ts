import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { SecurityConfig } from 'src/common/config/config.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    readonly configService: ConfigService
  ) {}

  validatePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findUser({ username: username });

    if (user && this.validatePassword(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.findUser({ id: userId });

    if (user) {
      delete user.password;
      return user;
    }

    return null;
  }

  async hashPassword(password: string): Promise<string> {
    const securityConfig = this.configService.get<SecurityConfig>('security');

    return hash(password, securityConfig.bcryptSaltOrRound);
  }

  async findUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });
  }

  async createAdmin(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
