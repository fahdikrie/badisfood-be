import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth.output';
import { RegisterUserDto } from './dto/register.input';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<AuthResponseDto> {
    this.logger.log('Registering user ', registerUserDto.username);

    return await this.authService.register(registerUserDto);
  }

  // @Post('login')
  // async login() {
  //   return this.authService.login();
  // }
}
