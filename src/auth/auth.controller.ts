import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth.dto';
import { LoginUserDto } from './dto/login.input';
import { RegisterUserDto } from './dto/register.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<AuthResponseDto> {
    this.logger.log('Registering user ', registerUserDto.username);

    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    this.logger.log('Registering user ', loginUserDto.username);

    return await this.authService.login(loginUserDto);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    const user = req.user;

    this.logger.log(`Logging user with user id ${(user as User).id} out`);

    this.authService.logout((user as User).id);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@Req() req: Request) {
    this.logger.log(`Refreshing user ${req.user['username']}'s token`);

    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshTokens(userId, refreshToken);
  }
}
