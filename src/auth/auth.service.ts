import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { AuthResponseDto } from './dto/auth.dto';
import { LoginUserDto } from './dto/login.input';
import { RegisterUserDto } from './dto/register.input';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userService: UsersService) {}

  validatePassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser({ username: username });

    if (user && this.validatePassword(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.userService.findUser({ id: userId });

    if (user) {
      delete user.password;
      return user;
    }

    return null;
  }

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.findUser({
      username: registerUserDto.username,
    });

    if (user) {
      const message = `User ${registerUserDto.username} already exists`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    const newUser = await this.userService.createUser(registerUserDto);
    delete newUser.password;

    return {
      user: newUser,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.userService.findUser({
      username: loginUserDto.username,
    });

    const isPasswordValid = await this.validatePassword(
      loginUserDto.password,
      user.password
    );

    if (isPasswordValid) {
      const message = `Wrong password for user ${loginUserDto.username}`;

      this.logger.error(message);

      throw new BadRequestException(message);
    }

    return {
      user,
    };
  }
}
