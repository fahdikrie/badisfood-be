import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { AuthResponseDto } from './dto/auth.dto';
import { LoginUserDto } from './dto/login.input';
import { RegisterUserDto } from './dto/register.input';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  validatePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async getTokens(userId: string, username: string) {
    const signData = {
      sub: userId,
      username,
    };

    const signConfig = (secretKey: string, expiresIn: string) => ({
      secret: this.configService.get<string>(secretKey),
      expiresIn,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        signData,
        signConfig('JWT_ACCESS_SECRET', '30m')
      ),
      this.jwtService.signAsync(
        signData,
        signConfig('JWT_REFRESH_SECRET', '7d')
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await this.usersService.hashPassword(refreshToken);

    await this.usersService.updateUser({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser({ username: username });

    if (user && this.validatePassword(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.usersService.findUser({ id: userId });

    if (user) {
      delete user.password;
      return user;
    }

    return null;
  }

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findUser({
      username: registerUserDto.username,
    });

    if (user) {
      const message = `User ${registerUserDto.username} already exists`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const newUser = await this.usersService.createUser(registerUserDto);
    delete newUser.password;
    delete newUser.refreshToken;

    const token = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, token.refreshToken);

    return {
      user: newUser,
      ...token,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findUser({
      username: loginUserDto.username,
    });

    const isPasswordValid = await this.validatePassword(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) {
      const message = `Wrong password for user ${loginUserDto.username}`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const token = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, token.refreshToken);

    delete user.password;
    delete user.refreshToken;

    return {
      user,
      ...token,
    };
  }
}
